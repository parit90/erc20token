# ERC20 Token Project

This project demonstrates the creation of an ERC20 token using Solidity, integration with a NestJS backend, and the deployment and testing of the application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm**: Version 6 or higher
- **Hardhat**: Development environment for Ethereum
- **Docker**: To run the application in containers
- **npm install -g npx**: if npx is not installed 
- **Make**: automation for running and compiling app 

## Getting Started


## Method 1 - Using Docker

### a. Clone the Repository

```bash
git clone https://github.com/parit90/erc20token.git
cd erc20token
```
### b. use docker commands to run container 
```bash
1. docker-compose build --no-cache
2. docker-compose up
# ideally after this step there should be two container up and running i.e. {hardhat, api}
# if there is any error like `HardhatError: HH12: Trying to use a non-local installation of Hardhat, which is not supported.`
# do: 
      docker-compose down  
      docker-compose up

3. chmod +x deploy.sh
4. ./deploy.sh



Alternatively, you can run individual steps as needed:
make build
make up
make chmod
make deploy

or 
make all
```

### c. to run the test
```bash
 docker-compose exec api sh
 npx hardhat test
```


## Method 2 - Running locally

### a. Clone the Repository

```bash
git clone https://github.com/parit90/erc20token.git
cd erc20token
```

### b. Install the dependency and start the hardhat node locally
```bash
npm install

npx hardhat compile

npx hardhat node
```

### c. deploy the contract which is compiled in step 2 to local hardhat node
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### d. run the server 
```bash
npm run start:dev
```

### For Tesing smart-contract on locale running node
```bash
npx hardhat test
```

### adjust the .env variables according to your key, by default it will run on given private key and contract address
### you can get the private key from hardhat console and token address from step:c deployment
```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
TOKEN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Postman Collection

For easier testing, you can use the provided Postman collection.

1. Download the [Postman Collection](./marketnode.postman_collection.json).
2. Import it into your Postman application.
3. Start testing the API endpoints directly from Postman.