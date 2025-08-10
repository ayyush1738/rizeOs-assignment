// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PlatformFeeReceiver is ReentrancyGuard {
    address public owner;
    uint256 public platformFee = 0.001 ether;

    event FeePaid(address indexed payer, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event FeeUpdated(uint256 oldFee, uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function payPlatformFee() external payable {
        require(msg.value == platformFee, "Incorrect fee amount");
        emit FeePaid(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(owner, balance);
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee > 0, "Fee must be > 0");
        emit FeeUpdated(platformFee, newFee);
        platformFee = newFee;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    receive() external payable {
        emit FeePaid(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FeePaid(msg.sender, msg.value);
    }
}
