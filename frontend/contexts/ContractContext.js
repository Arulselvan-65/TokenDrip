import { ethers } from "ethers";
import { useAccount } from "wagmi";

export const Contract = () => {
    const { address, isConnected } = useAccount();

    console.log(address);

}


