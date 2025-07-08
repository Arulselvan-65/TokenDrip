//@ts-nocheck
import { ethers } from "ethers";
import { tokenContractAddress, vestingContractAddress } from "@/app/contexts/config";
import { tokenAbi } from "@/app/utils/contracts/abi/TokenContract";
import { abi } from "@/app/utils/contracts/abi/VestingContract";

export const getTotalSupply = async (tokenContractInstance: ethers.Contract, vestingContractInstance: ethers.Contract) => {
    try {
        const [totalSupply] = await tokenContractInstance.totalSupply();

        const value = totalSupply/10n**18n


        return value;
    } catch (error) {
        console.error("Error fetching total supply:", error);
        throw error;
    }
};