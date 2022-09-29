const { ethers } = require("hardhat")
const denv = require('dotenv').config();
const fs = require("fs");
const os = require("os");

const main = async () => {
    const initialName = "hacko";

    const[deployer] = await ethers.getSigners();
    console.log(`Address deploying the contract --> ${deployer.address}`);

    const contractFactory = await ethers.getContractFactory("Contract");
    const contract = await contractFactory.deploy(initialName);

    console.log(`Contract address --> ${contract.address}`);


    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp('CONTRACT_ADDRESS'));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${'CONTRACT_ADDRESS'}=${contract.address}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
    //
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });