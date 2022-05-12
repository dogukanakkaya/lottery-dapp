const Lottery = artifacts.require("Lottery");
const VRFCoordinatorV2Mock = artifacts.require('VRFCoordinatorV2Mock');
const { VRF_SUBSCRIPTION_ID } = require('../config');

module.exports = function (deployer) {
  let vrfCoordinatorAddress, vrfKeyHash, vrfSubscriptionId, priceFeedAddress;

  if (config.network === 'development') {
    vrfCoordinatorAddress = VRFCoordinatorV2Mock.address;
    vrfKeyHash = '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
    vrfSubscriptionId = 1;
    priceFeedAddress = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';
  } else {
    vrfCoordinatorAddress = '0x6168499c0cFfCaCD319c818142124B7A15E857ab';
    vrfKeyHash = '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
    vrfSubscriptionId = VRF_SUBSCRIPTION_ID;
    priceFeedAddress = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';
  }

  deployer.deploy(
    VRFCoordinatorV2Mock,
    10000000,
    10000000
  );

  deployer.deploy(
    Lottery,
    vrfCoordinatorAddress,
    vrfKeyHash,
    vrfSubscriptionId,
    priceFeedAddress
  );
};