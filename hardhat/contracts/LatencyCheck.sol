// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract LatencyCheck {


    event ContractCalled(address indexed caller, uint256 timestamp);

    event UpdatedMessages(string oldStr, string newStr);
    
    constructor() {
        emit ContractCalled(msg.sender, block.timestamp);
    }

    function checkLatency() public {
        emit ContractCalled(msg.sender, block.timestamp);
    }
}

