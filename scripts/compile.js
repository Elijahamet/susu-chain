// Compiles ChainSusu.sol using the npm-installed solc package directly.
// (Hardhat's own compiler download is blocked in this sandbox network, so we
// compile manually and write artifacts in the exact format Hardhat expects.)
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const contractPath = path.join(__dirname, "..", "contracts", "ChainSusu.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: { "ChainSusu.sol": { content: source } },
  settings: {
    outputSelection: { "*": { "*": ["abi", "evm.bytecode", "evm.deployedBytecode"] } },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const fatal = output.errors.filter((e) => e.severity === "error");
  output.errors.forEach((e) => console.log(e.formattedMessage));
  if (fatal.length > 0) {
    console.error("Compilation failed.");
    process.exit(1);
  }
}

const contract = output.contracts["ChainSusu.sol"]["ChainSusu"];

const artifactDir = path.join(__dirname, "..", "artifacts", "contracts", "ChainSusu.sol");
fs.mkdirSync(artifactDir, { recursive: true });

const artifact = {
  _format: "hh-sol-artifact-1",
  contractName: "ChainSusu",
  sourceName: "contracts/ChainSusu.sol",
  abi: contract.abi,
  bytecode: "0x" + contract.evm.bytecode.object,
  deployedBytecode: "0x" + contract.evm.deployedBytecode.object,
  linkReferences: {},
  deployedLinkReferences: {},
};

fs.writeFileSync(
  path.join(artifactDir, "ChainSusu.json"),
  JSON.stringify(artifact, null, 2)
);

console.log("Compiled successfully -> artifacts/contracts/ChainSusu.sol/ChainSusu.json");
