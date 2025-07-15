// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract VestingContract is Ownable {

    IERC20 public token;
    uint public activeSchedules;
    uint public scheduleCount;
    uint constant ONE_TOKEN = 10e18;

    constructor(address tokenAddress) Ownable(msg.sender){
        token = IERC20(tokenAddress);
    }

    struct VestingSchedule {
        uint8 totalDays;
        uint totalTokens;
        uint startTime;
        uint endTime;
        uint claimed;
        bool isActive;
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(uint => address) public scheduleIds;

    event ScheduleCreated(address indexed from, address indexed to, uint time);
    event TokenClaimed(address indexed from, address indexed addr, uint amount, uint time);
    event RemainingTokensClaimed(address indexed from, uint amount, uint time);

    error InvalidAddress();
    error NoTokensToClaim();
    error InvalidTotalDays();
    error NoActiveSchedule();
    error ScheduleCompleted();
    error InvalidTotalTokens();
    error TokenTransferFailed();
    error ActiveScheduleExists();
    error ScheduleAlreadyExists(address _addr);
    error ExceedsTotalSupply(uint256 requested, uint256 total);

    function createSchedule(address addr, uint8 _totalDays, uint _totalTokens) external onlyOwner {
        require(addr != address(0), InvalidAddress());
        require(!vestingSchedules[addr].isActive, ScheduleAlreadyExists(addr));
        require(_totalDays > 0, InvalidTotalDays());
        require(_totalTokens > 0, InvalidTotalTokens());
        require(token.balanceOf(address(this)) >= _totalTokens, ExceedsTotalSupply(_totalTokens, token.balanceOf(address(this))));

        vestingSchedules[addr] = VestingSchedule({
            totalDays: _totalDays,
            totalTokens: _totalTokens,
            startTime: block.timestamp,
            endTime: block.timestamp + (_totalDays * 1 days),
            claimed: 0,
            isActive: true
        });
        scheduleIds[scheduleCount++] = addr;
        activeSchedules++;

        emit ScheduleCreated(address(this),addr, block.timestamp);
    }

    function claimTokens(uint16 claimable) external {
        VestingSchedule storage vestingSchedule = vestingSchedules[msg.sender];
        require(vestingSchedule.isActive, NoActiveSchedule());
        require(vestingSchedule.endTime >= block.timestamp, ScheduleCompleted());

        require(claimable > 0, NoTokensToClaim());
        unchecked { vestingSchedule.claimed += claimable; }
        if(vestingSchedule.claimed == vestingSchedule.totalTokens){
            activeSchedules--;
            vestingSchedule.isActive = false;
        }
        token.safeTransfer(msg.sender, claimable * ONE_TOKEN);

        emit TokenClaimed(msg.sender, claimable * ONE_TOKEN, block.timestamp);
    }

//    function calculateVestedAmount(address _addr) internal view returns(uint){
//        require(vestingSchedules[_addr].isActive, NoActiveSchedule());
//        VestingSchedule memory vestingSchedule = vestingSchedules[_addr];
//        uint elapsedDays = (block.timestamp - vestingSchedule.startTime) / 1 days;
//        if(elapsedDays >= vestingSchedule.totalDays){
//            return vestingSchedule.totalTokens;
//        }
//        uint vestedAmount = (vestingSchedule.totalTokens * (elapsedDays + 1)) / vestingSchedule.totalDays;
//
//        return vestedAmount > vestingSchedule.totalTokens ? vestingSchedule.totalTokens : vestedAmount;
//    }

    function claimRemainTokens() external onlyOwner {
        require(token.balanceOf(address(this)) > 0, NoTokensToClaim());
        require(activeSchedules == 0, ActiveScheduleExists());
        uint remainingBalance = token.balanceOf(address(this));
        require(token.transfer(msg.sender, remainingBalance  * (10**18)), TokenTransferFailed());
        emit RemainingTokensClaimed(address(this), remainingBalance  * (10**18), block.timestamp);
    }

    function getAllSchedules() external view onlyOwner returns (VestingSchedule[] memory) {
        VestingSchedule[] memory schedules = new VestingSchedule[](scheduleCount);
        for (uint i = 0; i < scheduleCount; i++) {
            schedules[i] = vestingSchedules[scheduleIds[i]];
        }
        return schedules;
    }

    function getSchedule(address addr) external view returns (VestingSchedule memory) {
        require(vestingSchedules[addr].isActive, NoActiveSchedule());
        return vestingSchedules[addr];
    }
}