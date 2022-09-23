const { ethers } = require("hardhat")

const main = async () => {
    const initialName = "hacko";

    const[deployer] = await ethers.getSigners();
    console.log(`Address deploying the contract --> ${deployer.address}`);

    const contractFactory = await ethers.getContractFactory("Contract");
    const contract = await contractFactory.deploy(initialName);

    console.log(`Contract address --> ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });