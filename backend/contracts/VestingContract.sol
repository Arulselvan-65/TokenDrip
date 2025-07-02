// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VestingContract is Ownable {

    IERC20 public token;

    constructor(address tokenAddress) Ownable(msg.sender){
        token = IERC20(tokenAddress);
    }

    struct VestingSchedule {
        uint8 totalDays;
        uint totalTokens;
        uint startTime;
        uint claimed;
        bool isActive;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    event ScheduleCreated(address indexed to, uint time);
    event TokenClaimed(address indexed addr, uint amount);


    function createSchedule(address addr, uint8 _totalDays, uint _totalTokens) external onlyOwner {
        require(!vestingSchedules[addr].isActive, "Schedule Exists");
        require(addr != address(0), "Invalid Address");

        vestingSchedules[addr] = VestingSchedule({
            totalDays: _totalDays,
            totalTokens: _totalTokens,
            startTime: block.timestamp,
            claimed: 0,
            isActive: true
        });

        emit ScheduleCreated(addr, block.timestamp);
    }

    function claimTokens() external {
        require(vestingSchedules[msg.sender].isActive, "No active schedule");
        VestingSchedule storage vestingSchedule = vestingSchedules[msg.sender];

        uint claimable = calculateVestedAmount(msg.sender) - vestingSchedule.claimed;
        require(claimable > 0, "No tokens to claim");

        vestingSchedule.claimed += claimable;
        if(vestingSchedule.claimed == vestingSchedule.totalTokens){
            vestingSchedule.isActive = false;
        }
        require(token.transfer(msg.sender, claimable), "Token transfer failed");

        emit TokenClaimed(msg.sender, claimable);
    }

    function calculateVestedAmount(address _addr) internal view returns(uint){
        require(vestingSchedules[_addr].isActive, "No active schedule");
        VestingSchedule memory vestingSchedule = vestingSchedules[_addr];

        uint elapsedDays = (block.timestamp - vestingSchedule.startTime) / 1 days;
        if(elapsedDays >= vestingSchedule.totalDays){
            return vestingSchedule.totalTokens;
        }
        uint vestedAmount = (vestingSchedule.totalTokens * elapsedDays) / vestingSchedule.totalDays;

        return vestedAmount;
    }
}