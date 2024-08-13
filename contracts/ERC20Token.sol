// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ERC20Token is ERC20, Ownable, ReentrancyGuard {
    constructor(uint256 initialSupply) ERC20("DummyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply* 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner nonReentrant{
        _mint(to, amount);
    }

    function burn(uint256 amount) public onlyOwner nonReentrant{
        _burn(msg.sender, amount);
    }
}
