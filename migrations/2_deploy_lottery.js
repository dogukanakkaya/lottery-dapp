const Lottery = artifacts.require("Lottery");
const { VRF_SUBSCRIPTION_ID } = require('../config');

module.exports = function (deployer) {
  const vrfCoordinatorAddress = '0x6168499c0cFfCaCD319c818142124B7A15E857ab';
  const vrfKeyHash = '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
  const priceFeedAddress = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';

  deployer.deploy(
    Lottery,
    vrfCoordinatorAddress,
    vrfKeyHash,
    VRF_SUBSCRIPTION_ID,
    priceFeedAddress
  );
};
