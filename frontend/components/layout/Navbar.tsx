"use client"
import React from 'react';
import { ConnectButtonC } from '../ConnectButton';
import { Contract } from "@/contexts/ContractContext";
import {useAccount} from "wagmi";
import {ethers} from "ethers";

export const Navbar = () => {
  const { connector, address, isConnected } = useAccount();

  const handleClick = async function () {
    // @ts-ignore
    const provider = new ethers.BrowserProvider(await connector?.getProvider());

    console.log(await provider.listAccounts());

  }
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Token Drip
          </h1>
        </div>
        <div>
          <button onClick={handleClick}>
            click me
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ConnectButtonC />
          </div>
          <div className="block sm:hidden">
            <ConnectButtonC displayType="compact" />
          </div>
        </div>
      </div>
    </nav>
  );
};