// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ChainSusu
/// @notice A trustless rotating savings group (susu). Members contribute a fixed
///         amount each round; the contract — not a human collector — automatically
///         releases the full pot to the next member in rotation once everyone has
///         paid in. No custodian ever holds the funds, so no one can disappear
///         with the group's money.
///
///         A simple on-chain reliability score tracks how consistently each
///         member has paid on time, so new members can see who they're joining
///         a group with before trusting them with real money.
contract ChainSusu {
    struct Group {
        address[] members;
        uint256 contributionAmount;   // amount each member must pay per round
        uint256 currentRound;         // 0-indexed round counter
        uint256 payoutIndex;          // whose turn it is to receive the pot (index into members)
        uint256 roundDeadline;        // timestamp by which this round's contributions are due
        uint256 roundLength;          // seconds allotted per round
        bool active;
        mapping(address => bool) hasPaidThisRound;
        mapping(address => uint256) pot; // tracks amount collected this round (redundant safety)
    }

    // Simple global reliability score per address: +2 for on-time payment, -3 for a missed one.
    // Capped between 0 and 100, starts at 50 (neutral / unproven).
    mapping(address => int256) public reliabilityScore;
    mapping(address => bool) public hasScore;

    uint256 public groupCount;
    mapping(uint256 => Group) private groups;

    event GroupCreated(uint256 indexed groupId, address[] members, uint256 contributionAmount, uint256 roundLength);
    event ContributionMade(uint256 indexed groupId, address indexed member, uint256 round);
    event PayoutReleased(uint256 indexed groupId, address indexed recipient, uint256 amount, uint256 round);
    event MemberMissedPayment(uint256 indexed groupId, address indexed member, uint256 round);
    event ReliabilityUpdated(address indexed member, int256 newScore);

    modifier onlyMember(uint256 groupId) {
        require(_isMember(groupId, msg.sender), "not a member of this group");
        _;
    }

    /// @notice Create a new rotating savings group.
    /// @param members Ordered list of participant addresses. Payout order follows this order.
    /// @param contributionAmount Fixed amount (in wei) each member must contribute per round.
    /// @param roundLength Duration of each round in seconds (e.g. 7 days = 604800).
    function createGroup(
        address[] calldata members,
        uint256 contributionAmount,
        uint256 roundLength
    ) external returns (uint256 groupId) {
        require(members.length >= 2, "need at least 2 members");
        require(contributionAmount > 0, "contribution must be > 0");
        require(roundLength > 0, "round length must be > 0");

        groupId = groupCount++;
        Group storage g = groups[groupId];
        g.members = members;
        g.contributionAmount = contributionAmount;
        g.roundLength = roundLength;
        g.roundDeadline = block.timestamp + roundLength;
        g.active = true;

        for (uint256 i = 0; i < members.length; i++) {
            if (!hasScore[members[i]]) {
                reliabilityScore[members[i]] = 50; // neutral starting score
                hasScore[members[i]] = true;
            }
        }

        emit GroupCreated(groupId, members, contributionAmount, roundLength);
    }

    /// @notice Contribute this round's amount. Funds go straight into the contract —
    ///         no human ever holds or controls them.
    function contribute(uint256 groupId) external payable onlyMember(groupId) {
        Group storage g = groups[groupId];
        require(g.active, "group not active");
        require(msg.value == g.contributionAmount, "incorrect contribution amount");
        require(!g.hasPaidThisRound[msg.sender], "already paid this round");

        g.hasPaidThisRound[msg.sender] = true;
        g.pot[msg.sender] = msg.value;

        emit ContributionMade(groupId, msg.sender, g.currentRound);

        // If everyone has paid, auto-release the payout immediately — no human approval needed.
        if (_allPaid(groupId)) {
            _releasePayout(groupId);
        }
    }

    /// @notice Anyone can call this after the deadline to close out a round: pay out
    ///         whoever DID contribute, and penalize the reliability score of anyone
    ///         who missed. Keeps the group moving even if one member stalls.
    function finalizeRound(uint256 groupId) external {
        Group storage g = groups[groupId];
        require(g.active, "group not active");
        require(block.timestamp >= g.roundDeadline, "round not yet over");
        require(!_allPaid(groupId), "round already complete");

        for (uint256 i = 0; i < g.members.length; i++) {
            address m = g.members[i];
            if (!g.hasPaidThisRound[m]) {
                _adjustReliability(m, -3);
                emit MemberMissedPayment(groupId, m, g.currentRound);
            }
        }

        _releasePayout(groupId);
    }

    /// @dev Internal: pays out whatever has been collected this round to the member
    ///      whose turn it is, rewards those who paid on time, and advances the rotation.
    function _releasePayout(uint256 groupId) internal {
        Group storage g = groups[groupId];
        address recipient = g.members[g.payoutIndex];

        uint256 total = 0;
        for (uint256 i = 0; i < g.members.length; i++) {
            address m = g.members[i];
            if (g.hasPaidThisRound[m]) {
                total += g.pot[m];
                if (m != recipient) {
                    _adjustReliability(m, 2); // reward on-time payers
                }
                // reset for next round
                g.hasPaidThisRound[m] = false;
                g.pot[m] = 0;
            }
        }

        g.payoutIndex = (g.payoutIndex + 1) % g.members.length;
        g.currentRound += 1;
        g.roundDeadline = block.timestamp + g.roundLength;

        if (g.payoutIndex == 0) {
            g.active = false; // full cycle complete, everyone has received a payout once
        }

        (bool sent, ) = recipient.call{value: total}("");
        require(sent, "payout transfer failed");

        emit PayoutReleased(groupId, recipient, total, g.currentRound - 1);
    }

    function _adjustReliability(address member, int256 delta) internal {
        int256 newScore = reliabilityScore[member] + delta;
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;
        reliabilityScore[member] = newScore;
        emit ReliabilityUpdated(member, newScore);
    }

    function _allPaid(uint256 groupId) internal view returns (bool) {
        Group storage g = groups[groupId];
        for (uint256 i = 0; i < g.members.length; i++) {
            if (!g.hasPaidThisRound[g.members[i]]) return false;
        }
        return true;
    }

    function _isMember(uint256 groupId, address who) internal view returns (bool) {
        address[] storage m = groups[groupId].members;
        for (uint256 i = 0; i < m.length; i++) {
            if (m[i] == who) return true;
        }
        return false;
    }

    // ---- View helpers for the frontend ----

    function getGroupMembers(uint256 groupId) external view returns (address[] memory) {
        return groups[groupId].members;
    }

    function getGroupInfo(uint256 groupId) external view returns (
        uint256 contributionAmount,
        uint256 currentRound,
        uint256 payoutIndex,
        uint256 roundDeadline,
        bool active
    ) {
        Group storage g = groups[groupId];
        return (g.contributionAmount, g.currentRound, g.payoutIndex, g.roundDeadline, g.active);
    }

    function hasPaid(uint256 groupId, address member) external view returns (bool) {
        return groups[groupId].hasPaidThisRound[member];
    }
}
