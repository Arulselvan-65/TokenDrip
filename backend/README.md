# Token Drip

In this project two contracts are used:
- TokenContract
- VestingContract

## Token Contract
This contract is used for ERC20 Tokens related operations such as mint, burn etc...

    Methods:
        - mint() -> For minting tokens
        - transfer() -> For transferring tokens

## Vesting Contract
This contract is used for managing the overall operations of the application such as schedule creation, tracking and management.

    Struct:
        - VestingSchedule -> Structure of a schedule

    Mappings:
        - vestingSchedules -> For mapping address with schedule.
        - scheduleIds -> For mapping schedule IDs to addresses

    Methods:
        - createSchedule() -> For creating new schedules.
        - claimTokens() -> For claming tokens.
        - calculateVestedAmount() -> For calculating vested amount of a address.
        - claimRemainTokens() -> Only owner callable method for claming the remaining tokens after schedules.
        - getAllSchedules() -> Returns list of schedules. 
        - getSchedule() -> Returns schedule of a given address.

These are the contracts used in this project for token and schedule management. 