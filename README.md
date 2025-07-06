# TokenDrip - Decentralized Token Vesting Platform

## Overview
TokenDrip is a decentralized application (dApp) designed to manage token vesting schedules, allowing controlled token distribution over time. 
## Contracts
- **TokenContract**: A contract inheriting `ERC20`, and `Ownable`. It supports minting and transferring tokens.
- **VestingContract**: Manages vesting schedules, allowing the owner to create schedules with a specified number of days and total tokens. It includes features like token claiming, schedule tracking, and admin withdrawal of remaining tokens, with custom errors and events for robustness.

## Features
- Create vesting schedules with days and token amounts.
- Claim vested tokens daily based on elapsed time.
- Revert mechanisms for invalid actions (e.g., duplicate schedules, insufficient balance).
- Emit events for schedule creation and token claims.
- Admin functionality to view all schedules and claim remaining tokens.

## Tech Stack
- **Smart Contracts**: Solidity, OpenZeppelin, Hardhat.
- **Frontend**: Planned with Scaffold Alchemy (Next.js, TypeScript, Wagmi).
- **Testing**: Hardhat, Chai.
- **Deployment**: Polygon Amoy

## Contact
For questions or contributions, reach out via LinkedIn or the project repository.
