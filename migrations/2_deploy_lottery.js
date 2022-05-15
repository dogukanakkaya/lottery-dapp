const Lottery = artifacts.require("Lottery");
const VRFCoordinatorV2Mock = artifacts.require('VRFCoordinatorV2Mock');
const MockV3Aggregator = artifacts.require('MockV3Aggregator');
const { VRF_SUBSCRIPTION_ID } = require('../config');

const deployMocks = (deployer) => {
  return Promise.all([
    deployer.deploy(
      VRFCoordinatorV2Mock,
      100000,
      100000
    ),
    deployer.deploy(
      MockV3Aggregator,
      18,
      207810000000
    )
  ]);
}

module.exports = async function (deployer) {
  let vrfCoordinatorAddress, vrfKeyHash, vrfSubscriptionId, priceFeedAddress;

  if (config.network === 'development') {
    // deploy mocks if network is development
    await deployMocks(deployer);

    vrfCoordinatorAddress = VRFCoordinatorV2Mock.address;
    vrfKeyHash = '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
    vrfSubscriptionId = 1;
    priceFeedAddress = MockV3Aggregator.address;
  } else {
    vrfCoordinatorAddress = '0x6168499c0cFfCaCD319c818142124B7A15E857ab';
    vrfKeyHash = '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
    vrfSubscriptionId = VRF_SUBSCRIPTION_ID;
    priceFeedAddress = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';
  }

  await deployer.deploy(
    Lottery,
    vrfCoordinatorAddress,
    vrfKeyHash,
    vrfSubscriptionId,
    priceFeedAddress
  );
};