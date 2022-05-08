// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Lottery is Ownable {
    enum State {
        STARTED,
        CLOSED,
        FINDING_WINNER
    }

    State state = State.CLOSED;
    AggregatorV3Interface ethUsdPriceFeed;
    uint256 entranceFee = 1 * 10**18; // in usd with 18 decimals

    constructor() {
        ethUsdPriceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    function start() public {
        require(state == State.CLOSED, "Lottery is not closed yet!");
        state = State.STARTED;
    }

    function close() public {
        require(state == State.STARTED, "Lottery is not started yet!");
        state = State.CLOSED;
    }

    function getPrice() private view returns(uint256) {
        (,int256 price,,,) = ethUsdPriceFeed.latestRoundData();

        return uint256(price) * 10**10; // convert to 18 decimals
    }

    function findWinner() public view onlyOwner returns(string memory) {
        return "hi i am winner";
    }
}