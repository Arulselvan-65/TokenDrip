import { useState, useCallback } from "react";
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { hardhat } from "wagmi/chains";
import { wagmiConfig } from "./contract";

const erc721Abi = [
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    type: "function",
  },
];

interface CreateLoanParams {
  nftContractAddress: `0x${string}`;
  tokenId: string;
  loanAmount: bigint;
}

export const useCreateLoan = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const waitForTransaction = useWaitForTransactionReceipt; // Alias for clarity
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);

  const createLoan = useCallback(
    async ({ nftContractAddress, tokenId, loanAmount }: CreateLoanParams) => {
      if (!address) throw new Error("Wallet not connected");

      setIsPending(true);
      setIsError(false);
      setHash(undefined);
      setIsSuccess(false);

      try {
        // Validate inputs
        if (!nftContractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
          throw new Error("Invalid NFT contract address format");
        }
        const formattedTokenId = BigInt(tokenId);
        if (formattedTokenId < 0) {
          throw new Error("Invalid tokenId: must be a positive integer");
        }
        if (loanAmount <= 0) {
          throw new Error("Loan amount must be greater than zero");
        }

        // Step 1: Approve the LendingContract
        console.log("Approving LendingContract to manage NFT...");
        const approvalTxHash = await writeContractAsync({
          address: nftContractAddress,
          abi: erc721Abi,
          functionName: "approve",
          args: [wagmiConfig.address, formattedTokenId],
          chainId: hardhat.id,
        });
        console.log("Approval transaction submitted with hash:", approvalTxHash);

        // Step 2: Wait for approval confirmation
        const approvalReceipt = await waitForTransaction({ hash: approvalTxHash });
        if (!approvalReceipt.isSuccess) {
          throw new Error("Approval transaction failed");
        }
        console.log("Approval confirmed.");

        // Step 3: Create the loan
        console.log("Creating loan...");
        const loanTxHash = await writeContractAsync({
          address: wagmiConfig.address,
          abi: wagmiConfig.abi,
          functionName: "createLoan",
          args: [nftContractAddress, formattedTokenId, loanAmount],
          chainId: hardhat.id,
        });
        console.log("Loan creation transaction submitted with hash:", loanTxHash);

        // Step 4: Wait for loan creation confirmation
        const loanReceipt = await waitForTransaction({ hash: loanTxHash });
        if (!loanReceipt.isSuccess) {
          throw new Error("Loan creation transaction failed");
        }

        setHash(loanTxHash);
        setIsSuccess(true);
        console.log("Loan created successfully.");
      } catch (e: any) {
        console.error("Error creating loan:", e);
        setIsError(true);
        if (e.message?.includes("user rejected")) {
          throw new Error("Transaction rejected by user");
        } else if (e.message?.includes("insufficient funds")) {
          throw new Error("Insufficient funds for transaction");
        } else if (e.code === -32603) {
          throw new Error(
            "Contract interaction failed. Check NFT ownership, approval, loan amount, or contract state."
          );
        }
        throw new Error(`Unexpected error: ${e.message || e}`);
      } finally {
        setIsPending(false);
      }
    },
    [address, writeContractAsync, waitForTransaction] // Updated dependencies
  );

  return {
    createLoan,
    isPending,
    isError,
    isSuccess,
    hash,
  };
};