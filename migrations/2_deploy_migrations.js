var ClarityInCharity = artifacts.require("ClarityInCharity");
var Money = artifacts.require("Money");

module.exports = function (deployer) {
  deployer.deploy(ClarityInCharity);
  deployer.deploy(Money);
};