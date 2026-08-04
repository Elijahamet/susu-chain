const hre = require("hardhat");

async function main() {
  const config = require("../frontend/contract-config.json");
  const chainSusu = await hre.ethers.getContractAt("ChainSusu", config.address);
  const signers = await hre.ethers.getSigners();
  const [alice, bob, carol] = signers;
  const groupId = 0;

  console.log("--- before ---");
  const infoBefore = await chainSusu.getGroupInfo(groupId);
  console.log("round:", infoBefore.currentRound.toString(), "payoutIndex:", infoBefore.payoutIndex.toString());

  const aliceBalanceBefore = await hre.ethers.provider.getBalance(alice.address);

  console.log("\nBob contributing...");
  await (await chainSusu.connect(bob).contribute(groupId, { value: hre.ethers.parseEther("0.01") })).wait();

  console.log("Carol contributing...");
  await (await chainSusu.connect(carol).contribute(groupId, { value: hre.ethers.parseEther("0.01") })).wait();

  console.log("Alice contributing (last one — should trigger auto payout)...");
  await (await chainSusu.connect(alice).contribute(groupId, { value: hre.ethers.parseEther("0.01") })).wait();

  console.log("\n--- after ---");
  const infoAfter = await chainSusu.getGroupInfo(groupId);
  console.log("round:", infoAfter.currentRound.toString(), "payoutIndex:", infoAfter.payoutIndex.toString());

  const aliceBalanceAfter = await hre.ethers.provider.getBalance(alice.address);
  const received = aliceBalanceAfter - aliceBalanceBefore;
  console.log("Alice's balance change (received payout minus her own contribution + gas):", hre.ethers.formatEther(received), "ETH");

  console.log("\nReliability scores:");
  for (const [name, addr] of [["Alice", alice.address], ["Bob", bob.address], ["Carol", carol.address]]) {
    const score = await chainSusu.reliabilityScore(addr);
    console.log(` ${name}: ${score.toString()}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
