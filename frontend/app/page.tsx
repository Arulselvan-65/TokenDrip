// @ts-nocheck
"use client"

import React, { useState, useEffect } from 'react';
import { Activity, DollarSign, ShieldCheck, ArrowRight, Box} from 'lucide-react';
import { claimTokens } from "@/app/utils/contracts/interactions";
import { useContractContext } from "@/app/contexts/ContractContext";
import { useAccount } from "wagmi";

export default function TokenClaimingLanding() {
  const [dashValues, setDashValues] = useState({
    totalTokens: 0,
    claimed: 0,
    remainingDays: 0
  });
  const { vestingContractInstance, signer, isLoading, provider} = useContractContext();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const getValues = async () => {
      if (isLoading || !vestingContractInstance) {
        return;
      }
      try {
        const schedule = await vestingContractInstance.getSchedule(address);
        const endTimestamp = Number(schedule[3]);
        const now = Math.floor(Date.now() / 1000);
        const differenceSeconds = Number(endTimestamp) - now;
        const remainingDays = Math.max(0, Math.ceil(differenceSeconds / (24 * 60 * 60)));
        setDashValues({
          totalTokens: Number(schedule[1]),
          claimed: Number(schedule[4]),
          remainingDays: remainingDays,
        });
        console.log(schedule, remainingDays);
      } catch (e) {
        console.log(e);
      }
    };
    getValues();
  }, [isLoading, vestingContractInstance, address]);

  useEffect(() => {
    const calculateTimeLeft = async () => {
      if (isLoading || !vestingContractInstance) {
        setTimeLeft(null);
        return;
      }

      const latestBlock = await provider.getBlockNumber();
      const startBlock = 23869354;
      const tokenClaimedFilter = vestingContractInstance.filters.TokenClaimed(vestingContractInstance.target, address);

      const tokenClaimedEvents = await vestingContractInstance.queryFilter(tokenClaimedFilter, startBlock, latestBlock);
      if (tokenClaimedEvents.length === 0) {
        setTimeLeft(null);
        return;
      }

      const latestClaimEvent = tokenClaimedEvents.sort((a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex)[0];
      const block = await provider.getBlock(latestClaimEvent.blockNumber);
      const lastClaimTimestamp = block.timestamp * 1000;

      const nextClaimTime = lastClaimTimestamp + 24 * 60 * 60 * 1000;
      const now = Date.now();
      const difference = nextClaimTime - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      const minutes = Math.floor((difference / (1000 * 60)) % 60).toString().padStart(2, "0");
      const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };
    calculateTimeLeft();
  }, [address, isLoading, vestingContractInstance, provider]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft) {
        const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds - 1;
        if (totalSeconds <= 0) {
          setTimeLeft(null);
        } else {
          const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
          const newMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
          const newSeconds = (totalSeconds % 60).toString().padStart(2, "0");
          setTimeLeft(`${newHours}:${newMinutes}:${newSeconds}`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClaimTokens = async () => {
    let res = await claimTokens(signer, vestingContractInstance, address);
    if(res) { window.location.reload(); }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="relative">
            <Box size={48} className="text-purple-500 animate-bounce" />
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Loading Data
            </h2>
            <p className="text-gray-400 max-w-sm">
              Fetching from the decentralized network...
            </p>
          </div>

          <div className="flex gap-2 mt-8">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="w-3 h-3 rounded-sm bg-purple-500/30 border border-purple-500/50"
                    style={{
                      animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`
                    }}
                />
            ))}
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gray-900 relative">
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 sm:mt-0">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 sm:mb-12">
                <h1 className="text-4xl mt-10 md:mt-10 md:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Unlock Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 animate-pulse">
                    Token Rewards
                  </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Seamlessly claim your vested tokens with our advanced distribution platform.
                </p>
              </div>

              <div className="mb-10 sm:mb-12 flex justify-center">
                {timeLeft ? (
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
                        <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl px-8 py-6 border-2 border-transparent bg-clip-padding">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl"></div>
                          <div className="absolute inset-[2px] bg-slate-900 rounded-2xl"></div>
                          <h2 className="relative text-center text-lg sm:text-xl font-semibold text-white z-10">
                            {`Claim tokens in ${timeLeft}`}
                          </h2>
                        </div>
                      </div>
                    </div>
                ) : (
                    <button
                        onClick={handleClaimTokens}
                        className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center">CLAIM TOKENS</span>
                    </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-gray-800/50 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="h-8 w-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                      <div className="h-3 w-3 bg-violet-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Total Tokens</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {dashValues.totalTokens}
                    <span className="text-xl text-violet-400 ml-2">HA</span>
                  </div>
                </div>

                <div className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-gray-800/50 hover:border-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="h-8 w-8 bg-fuchsia-600/20 rounded-lg flex items-center justify-center">
                      <div className="h-3 w-3 bg-fuchsia-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Tokens Claimed</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {dashValues.claimed}
                  </div>
                </div>

                <div className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-gray-800/50 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="h-8 w-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                      <div className="h-3 w-3 bg-cyan-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Remaining Days</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {dashValues.remainingDays}
                    <span className="text-xl text-cyan-400 ml-2">HA</span>
                  </div>
                  <p className="text-gray-500 text-sm">Successfully distributed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}