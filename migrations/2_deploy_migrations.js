const TodoList = artifacts.require("Project");

module.exports = function(deployer) {
  deployer.deploy(Project);
};