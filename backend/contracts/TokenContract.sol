// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenContract is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Lock", "HA") Ownable(initialOwner){}

    mapping(address => uint) public recordBook;

    function mint(address to, uint256 amount) public onlyOwner {
        recordBook[to] += amount;
        _mint(to, amount * (10**18));
    }

    function transfer(address to, uint256 value) public override virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

}
