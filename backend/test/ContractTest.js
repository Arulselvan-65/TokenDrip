const {loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers, ignition } = require("hardhat");
const { expect } = require("chai");
const {extendConfig} = require("hardhat/config");


describe("TokenDrip", function () {
  let tokenContract;
  let vestingContract;
  let owner, addr1, addr2;
  const DECIMALS = 10n**18n

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
  });
});
