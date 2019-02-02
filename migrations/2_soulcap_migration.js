var Soulcap = artifacts.require("./Soulcapper.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Soulcap);
};
