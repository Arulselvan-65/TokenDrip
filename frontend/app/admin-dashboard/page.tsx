"use client"

import React, { useState, useEffect } from 'react';
import { Activity, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TokenClaimingLanding() {
    const [dashValues, setDashValues] = useState({
        balance: 0,
        activeScheduleCount: 0,
        claimed: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        setDashValues({
            balance: 1250,
            activeScheduleCount: 8,
            claimed: 850
        });
        setIsLoading(false);
    }, []);

    const handleClaimTokens = () => {
        console.log('Claim tokens clicked');
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white">Loading...</p>
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

                        <div className="mb-5 sm:mb-12">
                            <button
                                onClick={handleClaimTokens}
                                className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center">
                                    CLAIM TOKENS
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {/* Total Tokens */}
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
                                    {dashValues.balance.toLocaleString()}
                                    <span className="text-xl text-violet-400 ml-2">HA</span>
                                </div>
                                <p className="text-gray-500 text-sm">Available for claiming</p>
                            </div>

                            {/* Active Schedules */}
                            <div className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-gray-800/50 hover:border-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="h-8 w-8 bg-fuchsia-600/20 rounded-lg flex items-center justify-center">
                                        <div className="h-3 w-3 bg-fuchsia-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Active Schedules</h3>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    {dashValues.activeScheduleCount}
                                </div>
                                <p className="text-gray-500 text-sm">Currently running</p>
                            </div>

                            {/* Total Tokens Claimed */}
                            <div className="group relative bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-gray-800/50 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-12 w-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="h-8 w-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                                        <div className="h-3 w-3 bg-cyan-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Tokens Claimed</h3>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    {dashValues.claimed.toLocaleString()}
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