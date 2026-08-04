const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainSusu", function () {
  let chainSusu, owner, alice, bob, carol;
  const contributionAmount = ethers.parseEther("0.01");
  const roundLength = 3600; // 1 hour, for testing

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();
    const ChainSusu = await ethers.getContractFactory("ChainSusu");
    chainSusu = await ChainSusu.deploy();
  });

  it("creates a group and gives every member a neutral starting score", async function () {
    const members = [alice.address, bob.address, carol.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);

    expect(await chainSusu.reliabilityScore(alice.address)).to.equal(50);
    expect(await chainSusu.reliabilityScore(bob.address)).to.equal(50);
  });

  it("auto-releases payout the moment everyone has contributed", async function () {
    const members = [alice.address, bob.address, carol.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);

    const groupId = 0;
    const bobBalanceBefore = await ethers.provider.getBalance(bob.address);

    // First member in the rotation is alice, so bob (payoutIndex=0 is alice actually)
    // rotation order follows the members array: alice -> bob -> carol
    // so the FIRST payout goes to alice (members[0])
    await chainSusu.connect(alice).contribute(groupId, { value: contributionAmount });
    await chainSusu.connect(bob).contribute(groupId, { value: contributionAmount });

    // before carol pays, no payout yet
    let info = await chainSusu.getGroupInfo(groupId);
    expect(info.currentRound).to.equal(0);

    const aliceBalanceBefore = await ethers.provider.getBalance(alice.address);
    await chainSusu.connect(carol).contribute(groupId, { value: contributionAmount });

    // payout should have fired automatically to alice (members[0])
    const aliceBalanceAfter = await ethers.provider.getBalance(alice.address);
    expect(aliceBalanceAfter - aliceBalanceBefore).to.equal(contributionAmount * 3n);

    info = await chainSusu.getGroupInfo(groupId);
    expect(info.currentRound).to.equal(1);
    expect(info.payoutIndex).to.equal(1); // rotation moved to bob next
  });

  it("rewards members who pay on time with a higher reliability score", async function () {
    const members = [alice.address, bob.address, carol.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);
    const groupId = 0;

    await chainSusu.connect(alice).contribute(groupId, { value: contributionAmount });
    await chainSusu.connect(bob).contribute(groupId, { value: contributionAmount });
    await chainSusu.connect(carol).contribute(groupId, { value: contributionAmount });

    // bob and carol paid on time (alice is the recipient this round, not scored)
    expect(await chainSusu.reliabilityScore(bob.address)).to.equal(52);
    expect(await chainSusu.reliabilityScore(carol.address)).to.equal(52);
  });

  it("penalizes a member who misses the round deadline", async function () {
    const members = [alice.address, bob.address, carol.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);
    const groupId = 0;

    await chainSusu.connect(alice).contribute(groupId, { value: contributionAmount });
    await chainSusu.connect(bob).contribute(groupId, { value: contributionAmount });
    // carol never pays

    await ethers.provider.send("evm_increaseTime", [roundLength + 1]);
    await ethers.provider.send("evm_mine");

    await chainSusu.finalizeRound(groupId);

    expect(await chainSusu.reliabilityScore(carol.address)).to.equal(47); // 50 - 3
    expect(await chainSusu.reliabilityScore(bob.address)).to.equal(52);  // paid on time
  });

  it("prevents a non-member from contributing", async function () {
    const members = [alice.address, bob.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);

    await expect(
      chainSusu.connect(carol).contribute(0, { value: contributionAmount })
    ).to.be.revertedWith("not a member of this group");
  });

  it("prevents contributing the wrong amount", async function () {
    const members = [alice.address, bob.address];
    await chainSusu.createGroup(members, contributionAmount, roundLength);

    await expect(
      chainSusu.connect(alice).contribute(0, { value: ethers.parseEther("0.02") })
    ).to.be.revertedWith("incorrect contribution amount");
  });
});
