const { ethers } = require("hardhat");

async function main(){
  const pollContract = await ethers.getContractFactory("Polls");

  // deploy the contract
  const deployedPollContract = await pollContract.deploy();
  
  // wait for it to finish deployment
  await deployedPollContract.deployed();

  // print the address of the depoyed contract
  console.log("Your deployed contract is at: ", deployedPollContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });