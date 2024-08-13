#!/bin/sh

# Execute the Hardhat commands inside the 'hardhat' container
docker-compose exec hardhat sh -c "
  npx hardhat run scripts/deploy.js --network localhost &&
  exit
"
