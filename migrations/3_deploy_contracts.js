var ReviewSystem = artifacts.require('./ReviewSystem');

module.exports = function(deployer) {
  deployer.deploy(ReviewSystem);
}
