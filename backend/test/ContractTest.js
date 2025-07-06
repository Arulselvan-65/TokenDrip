const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("TokenDrip", function () {
  let tokenContract;
  let vestingContract;
  let owner, addr1, addr2;
  const DECIMALS = 10n**18n;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const TokenContract = await ethers.getContractFactory("TokenContract");
    const VestingContract = await ethers.getContractFactory("VestingContract");
    tokenContract = await TokenContract.deploy(owner);
    vestingContract = await VestingContract.deploy(tokenContract.target);
  });

  describe("Deployment", function () {
    it("Should deploy the contracts", async function () {
      expect(await vestingContract.address).not.equal(null);
      expect(await tokenContract.address).not.equal(null);
    });
  });

  describe("Token Contract", function () {
    it("Should mint token", async function() {
        await tokenContract.connect(owner).mint(owner, 10n);
        expect(await tokenContract.balanceOf(owner)).to.equal(10n * DECIMALS);
    });

    it("Should return correct balance", async function(){
      await tokenContract.connect(owner).mint(addr1,10n);
      expect(await tokenContract.balanceOf(addr1)).to.equal(10n * DECIMALS);
    });

    it("Should transfer tokens to another account", async function() {
      await tokenContract.connect(owner).mint(owner, 10n);
      await tokenContract.connect(owner).transfer(addr1, 5n * DECIMALS);
      expect(await tokenContract.balanceOf(addr1)).to.equal(5n * DECIMALS);
    });
  });

  describe("Vesting Contract", function () {
     it("Should create a schedule", async function(){
        await tokenContract.connect(owner).mint(vestingContract.target, 20n);
        await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
        expect(await vestingContract.vestingSchedules(addr1)).to.not.equal(null);
     });

     it("Should set amount and days correctly", async function() {
       await tokenContract.connect(owner).mint(vestingContract.target, 20n);
       await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
       const result = await vestingContract.vestingSchedules(addr1);
       expect(await vestingContract.vestingSchedules(addr1)).to.not.equal(null);
       expect(result[0]).to.equal(10n);
       expect(result[1]).to.equal(10n * DECIMALS);
     });

     it("Should revert createSchedule when creating schedule with same address", async function() {
       await tokenContract.connect(owner).mint(vestingContract.target, 20n);
       await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
       await expect(vestingContract.createSchedule(addr1, 10, 20n * DECIMALS))
           .to.be.revertedWithCustomError(vestingContract, "ScheduleAlreadyExists")
           .withArgs(addr1);
     });

     it("Should revert createSchedule when creating schedule with zero address", async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 20n);
         await expect(vestingContract.createSchedule("0x0000000000000000000000000000000000000000", 10, 10n * DECIMALS))
             .to.be.revertedWithCustomError(vestingContract, "InvalidAddress");
     });

     it("Should revert createSchedule when total days zero", async function(){
        await tokenContract.connect(owner).mint(vestingContract.target, 20n);
        await expect(vestingContract.createSchedule(addr1, 0, 10n * DECIMALS))
            .to.be.revertedWithCustomError(vestingContract, "InvalidTotalDays");
     });

      it("Should revert createSchedule when total tokens zero", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await expect(vestingContract.createSchedule(addr1, 10, 0))
              .to.be.revertedWithCustomError(vestingContract, "InvalidTotalTokens");
      });

     it("Should revert createSchedule when requested balance is higher then available balance", async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await expect(vestingContract.createSchedule(addr2, 10, 20n * DECIMALS))
             .to.be.revertedWithCustomError(vestingContract, "ExceedsTotalSupply")
             .withArgs(20n * DECIMALS, 10n * DECIMALS);
     });

     it("Should emit ScheduleCreated when schedule created", async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         const block = await ethers.provider.getBlock("latest");
         await expect(vestingContract.createSchedule(addr1, 10, 10n * DECIMALS))
             .to.emit(vestingContract, "ScheduleCreated")
             .withArgs(addr1, BigInt(block.timestamp + 1));
     });

     it("Should claim tokens after creation",  async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await vestingContract.connect(addr1).claimTokens();
         await expect(await tokenContract.balanceOf(addr1)).to.equal(1n * DECIMALS);
     });

      it("Should emit TokenClaimed when tokens are claimed",  async function() {
          await tokenContract.connect(owner).mint(vestingContract.target, 10n);
          await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
          await expect(vestingContract.connect(addr1).claimTokens())
              .to.emit(vestingContract, "TokenClaimed").withArgs(addr1, 1n * DECIMALS);
      });

     it("Should revert claimTokens when claiming on a same day", async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await vestingContract.connect(addr1).claimTokens();
         await expect(vestingContract.connect(addr1).claimTokens())
             .to.be.revertedWithCustomError(vestingContract, "NoTokensToClaim");
     });

     it("Should claim tokens next day", async function(){
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await vestingContract.connect(addr1).claimTokens();
         await ethers.provider.send('evm_increaseTime', [1 * 24 * 60 * 60]);
         await ethers.provider.send('evm_mine');
         await expect(vestingContract.connect(addr1).claimTokens())
             .to.emit(vestingContract, "TokenClaimed").withArgs(addr1, 1n * DECIMALS);
     });

     it("Should claim the elapsed days tokens", async function() {
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await vestingContract.connect(addr1).claimTokens();
         await ethers.provider.send('evm_increaseTime', [5 * 24 * 60 * 60]);
         await ethers.provider.send('evm_mine');
         await expect(vestingContract.connect(addr1).claimTokens())
             .to.emit(vestingContract, "TokenClaimed").withArgs(addr1, 5n * DECIMALS);
     });

     it("Should revert claimTokens after all the tokens are claimed", async function(){
         await tokenContract.connect(owner).mint(vestingContract.target, 10n);
         await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
         await vestingContract.connect(addr1).claimTokens();
         await ethers.provider.send('evm_increaseTime', [9 * 24 * 60 * 60]);
         await ethers.provider.send('evm_mine');
         await expect(vestingContract.connect(addr1).claimTokens());
         await expect(vestingContract.connect(addr1).claimTokens())
             .to.be.revertedWithCustomError(vestingContract, "NoActiveSchedule");
     });

      it("Should revert claimTokens when claiming tokens after the scheduled days", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 10n);
          await vestingContract.createSchedule(addr1, 5, 10n * DECIMALS);
          await vestingContract.connect(addr1).claimTokens();
          await ethers.provider.send('evm_increaseTime', [12 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await expect(vestingContract.connect(addr1).claimTokens())
              .to.be.revertedWithCustomError(vestingContract, "ScheduleCompleted");
      });

      it("Owner should claim remaining tokens", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 5, 10n * DECIMALS);
          await ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await vestingContract.connect(addr1).claimTokens();
          await expect(vestingContract.connect(owner).claimRemainTokens())
              .to.emit(vestingContract, "RemainingTokensClaimed")
              .withArgs(10n * DECIMALS);
      });

      it("Should emit RemainingTokensClaimed after claiming remaining tokens", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 5, 10n * DECIMALS);
          await ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await vestingContract.connect(addr1).claimTokens();
          await expect(vestingContract.connect(owner).claimRemainTokens())
              .to.emit(vestingContract, "RemainingTokensClaimed")
              .withArgs(10n * DECIMALS);
      });

      it("Should revert claimRemainTokens for non-owner call", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 5, 20n * DECIMALS);
          await ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await vestingContract.connect(addr1).claimTokens();
          await expect(vestingContract.connect(addr1).claimRemainTokens()).to.be.reverted;
      });

      it("Should revert claimRemainTokens when no remaining tokens", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 5, 20n * DECIMALS);
          await ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await vestingContract.connect(addr1).claimTokens();
          await expect(vestingContract.connect(owner).claimRemainTokens())
              .to.be.revertedWithCustomError(vestingContract, "NoTokensToClaim");
      });

      it("Should revert claimRemainTokens with active schedule", async function(){
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 10, 20n * DECIMALS);
          await ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
          await ethers.provider.send('evm_mine');
          await vestingContract.connect(addr1).claimTokens();
          await expect(vestingContract.connect(owner).claimRemainTokens())
              .to.be.revertedWithCustomError(vestingContract, "ActiveScheduleExists");
      });

      it("Should allow owner to view all schedules", async function () {
          await tokenContract.connect(owner).mint(vestingContract.target, 20n);
          await vestingContract.createSchedule(addr1, 10, 10n * DECIMALS);
          await vestingContract.createSchedule(addr2, 5, 5n * DECIMALS);
          const schedules = await vestingContract.getAllSchedules();
          expect(schedules.length).to.equal(2);
          expect(schedules[0].totalTokens).to.equal(10n * DECIMALS);
      });

  });
});
