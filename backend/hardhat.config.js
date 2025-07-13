require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.27",

  networks: {
    // polygon_amoy: {
    //   url: `${process.env.CONNECTION_URL}`,
    //   accounts: [`${process.env.PRIVATE_KEY}`]
    // }
  }
};