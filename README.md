# hackathon

<!-- ABOUT THE PROJECT -->

## About The Project

This sample project implements a location-based and bank-backed mini exchange system on hardhat.

The project mainly consists of the contracts, the tests and the deployment scripts. It's also planned to locate a user interface and a backend system in it soon.

To run the project:

Please notice that you need to create your own .env file with your credentials and never share/post it.

To create .env file

```sh
touch .env
```

The .env file should look something like below

```sh
PRIVATE_KEY = <HERE_COMES_YOUR_PRIVATE_KEY>
RINKEBY_URL = <ALCHEMY_RINKEBY_URL>
ETHERSCAN_KEY = <ETHERSCAN_KEY>
```

To run the tests:

```sh
npx hardhat test
```

To compile contracts:

```sh
npx hardhat compile
```

To deploy the contracts to Rinkeby Testnet:

```sh
npx hardhat run deployments/deployContract.js --network rinkeby
```

To verify the contracts on Rinkeby Testnet:

```sh
hardhat verify — network <networkName> <contractAddress> <ConstructorArguments>
```

in this case

```sh
npx hardhat verify --network rinkeby <CONTRACT_ADDRESS> "hacko"
```

<p align="right">(<a href="#top">back to top</a>)</p>
