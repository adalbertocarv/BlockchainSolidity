const { ethers } = require("hardhat");
async function main() {
  console.log("Contrato inteligente implementado...");
  const Medical = await ethers.getContractFactory("MedicalRecord");
  const account = await ethers.getSigners();
  const medical = await Medical.connect(account[1]).deploy();
  const contractAddress = await medical.getAddress();
  console.log(`Medical está implementado no endereço ${contractAddress}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });