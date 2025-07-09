// @ts-nocheck
"use client";

import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { tokenContractAddress, vestingContractAddress } from "./config";
import { tokenAbi }  from "../utils/contracts/abi/TokenContract";
import { abi } from "../utils/contracts/abi/VestingContract";

interface ContractContextType {
    signer: ethers.Signer | undefined;
    setSigner: ethers.Signer | undefined;
    tokenContractInstance: ethers.Contract | undefined;
    setTokenContractInstance: ethers.Contract | undefined;
    vestingContractInstance: ethers.Contract | undefined;
    setVestingContractInstance: ethers.Contract | undefined;
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractWrapper = ({ children }: { children: ReactNode }) => {
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [tokenContractInstance, setTokenContractInstance] = useState<ethers.Contract | undefined>(undefined);
    const [vestingContractInstance, setVestingContractInstance] = useState<ethers.Contract | undefined>(undefined);

    return (
        <ContractContext.Provider
            value={{
                signer,
                setSigner,
                tokenContractInstance,
                setTokenContractInstance,
                vestingContractInstance,
                setVestingContractInstance
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};
