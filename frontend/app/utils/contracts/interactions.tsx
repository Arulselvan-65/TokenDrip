//@ts-nocheck
import { toast } from "react-toastify";
import { decodeCustomError } from "../errors/errors";

export const createSchedule = async (owner, vestingContractInstance, _address, _totalDays, _totalTokens) => {
    try {
        await vestingContractInstance.connect(owner).createSchedule(_address, _totalDays, _totalTokens);
        toast.success("Schedule created successfully.");
        return true;
    } catch (e) {
        if (e.code === "CALL_EXCEPTION") {
            console.log("Raw error data:", e.data);
            const errorMessage = decodeCustomError(e.data);
            toast.error(errorMessage);
        } else if (e.code === "INSUFFICIENT_FUNDS") {
            toast.error("Insufficient funds for gas fees");
        } else if (e.code === "UNSUPPORTED_OPERATION") {
            toast.error("Contract runner does not support transactions. Ensure a signer is used.");
        } else {
            toast.error("Failed to create schedule: " + (e.message || e.toString()));
        }
    }
    return false;
};

export const claimTokens = async (address, vestingContractInstance) => {
    try {
        const currentTimestamp = Date.now();
        localStorage.setItem("lastTimestamp", currentTimestamp);
        await vestingContractInstance.connect(address).claimTokens();
        toast.success("Schedule created successfully.");
        return true;
    } catch (e) {
        if (e.code === "CALL_EXCEPTION") {
            console.log("Raw error data:", e.data);
            const errorMessage = decodeCustomError(e.data);
            toast.error(errorMessage);
        } else if (e.code === "INSUFFICIENT_FUNDS") {
            toast.error("Insufficient funds for gas fees");
        } else if (e.code === "UNSUPPORTED_OPERATION") {
            toast.error("Contract runner does not support transactions. Ensure a signer is used.");
        } else {
            toast.error("Failed to create schedule: " + (e.message || e.toString()));
        }
    }
    return false;
}