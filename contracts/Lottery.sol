// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Lottery is Ownable, VRFConsumerBaseV2 {
    struct Player {
        string username;
        address payable _address;
    }
    enum State {
        STARTED,
        CLOSED,
        WINNER_CALCULATING
    }


    // VRF
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 vrfSubscriptionId;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 vrfKeyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 vrfCallbackGasLimit = 100000;
    uint16 vrfRequestConfirmations = 3;
    uint32 vrfNumWords = 1;
    uint256 vrfRequestId;

    Player[] public players;
    Player public winner;
    State state = State.CLOSED;
    AggregatorV3Interface ethUsdPriceFeed;
    uint256 entranceFee = 1 * 10**18; // in usd with 18 decimals

    constructor(uint64 _vrfSubscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        vrfSubscriptionId = _vrfSubscriptionId;

        ethUsdPriceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    function start() public {
        require(state == State.CLOSED, "Lottery is not closed yet!");

        state = State.STARTED;
    }

    function enter(string memory _username) public payable {
        require(state == State.STARTED, "Lottery is not started yet!");
        require(msg.value >= getEntranceFee(), "You don't have enough funds!");

        players.push(Player(_username, payable(msg.sender)));
    }

    function calculateWinner() public onlyOwner {
        require(state == State.STARTED, "Lottery is not started yet!");

        state = State.WINNER_CALCULATING;
        requestRandomWords();
    }

    function close() private {
        state = State.CLOSED;
        delete players;
    }

    function getState() public view returns(State) {
        return state;
    }

    function getPrice() private view returns(uint256) {
        (,int256 price,,,) = ethUsdPriceFeed.latestRoundData();

        return uint256(price) * 10**10; // convert to 18 decimals
    }

    function getEntranceFee() private view returns(uint256) {
        return (entranceFee * 10**18) / getPrice();
    }

    function requestRandomWords() private {
        // Will revert if subscription is not set and funded.
        vrfRequestId = COORDINATOR.requestRandomWords(
            vrfKeyHash,
            vrfSubscriptionId,
            vrfRequestConfirmations,
            vrfCallbackGasLimit,
            vrfNumWords
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        require(state == State.WINNER_CALCULATING);

        uint256 randomNumber = randomWords[0];

        require(randomNumber > 0);

        winner = players[randomNumber % players.length];
        winner._address.transfer(address(this).balance);

        close();
    }
}