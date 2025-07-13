// @ts-nocheck
import { ethers } from "ethers";

// Define custom error signatures and their selectors
const errorDefinitions = {
    InvalidAddress: {
        selector: ethers.id("InvalidAddress()").slice(0, 10), // 0x2a59bd7c
        args: [],
    },
    NoTokensToClaim: {
        selector: ethers.id("NoTokensToClaim()").slice(0, 10), // 0x5a3e3f0e
        args: [],
    },
    InvalidTotalDays: {
        selector: ethers.id("InvalidTotalDays()").slice(0, 10), // 0x7b1a8e80
        args: [],
    },
    NoActiveSchedule: {
        selector: ethers.id("NoActiveSchedule()").slice(0, 10), // 0x9f4c2a7b
        args: [],
    },
    ScheduleCompleted: {
        selector: ethers.id("ScheduleCompleted()").slice(0, 10), // 0x8e8f9a2d
        args: [],
    },
    InvalidTotalTokens: {
        selector: ethers.id("InvalidTotalTokens()").slice(0, 10), // 0x3c1e89b9
        args: [],
    },
    TokenTransferFailed: {
        selector: ethers.id("TokenTransferFailed()").slice(0, 10), // 0x1a7f3d8c
        args: [],
    },
    ActiveScheduleExists: {
        selector: ethers.id("ActiveScheduleExists()").slice(0, 10), // 0x6b4e1f9a
        args: [],
    },
    ScheduleAlreadyExists: {
        selector: ethers.id("ScheduleAlreadyExists(address)").slice(0, 10), // 0x1b4e0cd2
        args: ["_addr"],
    },
    ExceedsTotalSupply: {
        selector: ethers.id("ExceedsTotalSupply(uint256,uint256)").slice(0, 10), // 0x4e5d3e3f
        args: ["requested", "total"],
    },
};

// Utility function to decode error
export const decodeCustomError = (errorData: string | undefined): string => {
    if (!errorData || !errorData.startsWith("0x")) return "UnknownError: No valid error data";

    const errorSelector = errorData.slice(0, 10);
    const errorArgs = errorData.slice(10);

    const errorDef = Object.values(errorDefinitions).find((def) => def.selector === errorSelector);

    if (!errorDef) return "UnknownCustomError";

    const errorName = Object.keys(errorDefinitions).find(
        (key) => errorDefinitions[key].selector === errorSelector
    ) as string;

    let message = `Transaction reverted: ${errorName}`;

    if (errorDef.args.length > 0) {
        if (errorDef.args.includes("_addr")) {
            const addr = ethers.getAddress("0x" + errorArgs.slice(24)); // Last 20 bytes for address
            message += ` - Address: ${addr}`;
        } else if (errorDef.args.includes("requested") && errorDef.args.includes("total")) {
            const requested = ethers.toBigInt("0x" + errorArgs.slice(0, 64));
            const total = ethers.toBigInt("0x" + errorArgs.slice(64));
            message += ` - Requested: ${requested}, Total: ${total}`;
        }
    }

    return message;
};


export const customErrors = errorDefinitions;