const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("===============================================================================");
    console.log("Deploying contracts with account:", deployer.address);
    console.log("===============================================================================");

    // Deploy TokenContract
    console.log("\n## Deploying TokenContract...");
    const TokenFactory = await ethers.getContractFactory("TokenContract");
    const tokenContract = await TokenFactory.deploy(deployer);
    await tokenContract.waitForDeployment();
    console.log("TokenContract deployed at:", tokenContract.target);

    // Deploy VestingContract
    console.log("\n## Deploying VestingContract...");
    const VestingFactory = await ethers.getContractFactory("VestingContract");
    const vestingContract = await VestingFactory.deploy(tokenContract.target);
    await vestingContract.waitForDeployment();
    console.log("VestingContract deployed at:", vestingContract.target);

    console.log("\nAll contracts deployed successfully!");
    console.log("-------------------------------------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
