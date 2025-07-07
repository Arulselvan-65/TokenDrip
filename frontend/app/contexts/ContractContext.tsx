"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface ContractContextType {
    signer: ethers.Signer | undefined;
    setSigner: React.Dispatch<React.SetStateAction<ethers.Signer | undefined>>;
    tokenContractAddress: string | undefined;
    setTokenContractAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    vestingContractAddress: string | undefined;
    setVestingContractAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractWrapper = ({ children }: { children: ReactNode }) => {
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [tokenContractAddress, setTokenContractAddress] = useState<string | undefined>(undefined);
    const [vestingContractAddress, setVestingContractAddress] = useState<string | undefined>(undefined);

    return (
        <ContractContext.Provider
            value={{
                signer,
                setSigner,
                tokenContractAddress,
                setTokenContractAddress,
                vestingContractAddress,
                setVestingContractAddress,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};

export const useContractContext = () => {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error("useContractContext must be used within a ContractWrapper");
    }
    return context;
};