// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable {
    enum State {
        STARTED,
        CLOSED,
        FINDING_WINNER
    }

    State state;

    function start() public {
        require(state == State.CLOSED, "Lottery is not closed yet!");
        state = State.STARTED;
    }

    function close() public {
        require(state == State.STARTED, "Lottery is not started yet!");
        state = State.CLOSED;
    }

    function findWinner() public view onlyOwner returns(string memory) {
        return "hi";
    }
}