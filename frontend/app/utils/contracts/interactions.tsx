//@ts-nocheck

import { toast } from "react-toastify";
import { decodeCustomError } from "@/utils/errors/errors";

export const createSchedule = async (owner, vestingContractInstance, _address, _totalDays, _totalTokens) => {
    try {
        console.log("Came");
        await vestingContractInstance.createSchedule(_address, _totalDays, _totalTokens);
        toast.success("Schedule created successfully.");
    } catch (e) {
        console.error("EEEEEEEEEEEEEEEEE" , e);
        toast.error("Failed to create schedule");
    }
};