// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenContract is ERC20, ERC20Burnable, Ownable {
    constructor(address initialOwner) ERC20("Lock", "HA") Ownable(initialOwner){}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * (10**18));
    }
}
