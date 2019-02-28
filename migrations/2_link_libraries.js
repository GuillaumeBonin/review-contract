var StringUtils = artifacts.require('../library/StringUtils');
var ReviewSystem = artifacts.require('./ReviewSystem');

module.exports = function(deployer) {
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, ReviewSystem);
}
