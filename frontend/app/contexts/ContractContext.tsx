// @ts-nocheck
"use client";

import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { tokenContractAddress, vestingContractAddress } from "./config";
import { tokenAbi } from "../utils/contracts/abi/TokenContract";
import { abi } from "../utils/contracts/abi/VestingContract";

interface ContractContextType {
    signer: ethers.Signer | undefined;
    provider: ethers.Provider | undefined;
    tokenContractInstance: ethers.Contract | undefined;
    vestingContractInstance: ethers.Contract | undefined;
    isLoading: boolean;
    setTriggerUpdate: boolean;
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractWrapper = ({ children }: { children: ReactNode }) => {
    const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
    const [provider, setProvider] = useState<ethers.Provider | undefined>(undefined);
    const [tokenContractInstance, setTokenContractInstance] = useState<ethers.Contract | undefined>(undefined);
    const [vestingContractInstance, setVestingContractInstance] = useState<ethers.Contract | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const { connector, isConnected } = useAccount();

    useEffect(() => {
        const initContract = async () => {
            if (!isConnected) {
                setIsLoading(false);
                const toastId = 'connect-wallet';
                if (!toast.isActive(toastId)) {
                    toast.error("Please connect your wallet to proceed", {
                        toastId: toastId,
                        autoClose: 1000,
                    });
                }
                return;
            }
            setIsLoading(true);
            try {
                if (isConnected && connector) {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const walletSigner = await provider.getSigner();
                    const token = new ethers.Contract(tokenContractAddress, tokenAbi, walletSigner);
                    const vesting = new ethers.Contract(vestingContractAddress, abi, walletSigner);

                    setTokenContractInstance(token);
                    setVestingContractInstance(vesting);
                    setSigner(walletSigner);
                    setProvider(provider);
                }
            } catch (e) {
                console.error("Error initializing contracts:", e);
                toast.error("Failed to initialize contracts");
            } finally {
                setIsLoading(false);
            }
        };

        initContract();
    }, [isConnected, connector, triggerUpdate]);

    return (
        <ContractContext.Provider
            value={{
                signer,
                provider,
                tokenContractInstance,
                vestingContractInstance,
                isLoading,
                setTriggerUpdate
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