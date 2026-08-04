const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const ChainSusu = await hre.ethers.getContractFactory("ChainSusu");
  const chainSusu = await ChainSusu.deploy();
  await chainSusu.waitForDeployment();

  const address = await chainSusu.getAddress();
  console.log("ChainSusu deployed to:", address);

  // Create the demo group the frontend expects (group #0), using Hardhat's
  // well-known local test accounts #0, #1, #2 so the frontend's hardcoded
  // demo private keys match up.
  const signers = await hre.ethers.getSigners();
  const demoMembers = [signers[0].address, signers[1].address, signers[2].address];
  const contributionAmount = hre.ethers.parseEther("0.01");
  const roundLength = 3600; // 1 hour rounds for the demo

  const createTx = await chainSusu.createGroup(demoMembers, contributionAmount, roundLength);
  await createTx.wait();
  console.log("Demo group #0 created with members:", demoMembers);

  // Write address + ABI where the frontend can read them.
  const artifact = await hre.artifacts.readArtifact("ChainSusu");
  const frontendConfig = {
    address,
    abi: artifact.abi,
  };
  fs.writeFileSync(
    path.join(__dirname, "..", "frontend", "contract-config.json"),
    JSON.stringify(frontendConfig, null, 2)
  );
  console.log("Wrote frontend/contract-config.json");

  // Also print the demo accounts so we know which private keys to use in the browser.
  console.log("\nDemo accounts (already funded on this local network):");
  for (let i = 0; i < 4; i++) {
    console.log(`  [${i}] ${signers[i].address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
