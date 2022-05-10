const Lottery = artifacts.require("Lottery");
const { VRF_SUBSCRIPTION_ID } = require('../config');

module.exports = function (deployer) {
  deployer.deploy(Lottery, VRF_SUBSCRIPTION_ID);
};
