// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Activity, DollarSign, ShieldCheck, Box } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import StatsCard from "@/app/components/dashboard/stats-card";
import ActivityChart from "@/app/components/dashboard/activity-chart";
import ScheduleListTable from "@/app/components/dashboard/schedule-list-table";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useContractContext } from "@/app/contexts/ContractContext";
import { toast } from "react-toastify";
import { Schedule, ActivityDataItem } from "@/app/components/types/interfaces";

export default function DashboardPage() {
    const DECIMALS = 10n ** 18n;
    const [dashValues, setDashValues] = useState({
        balance: 0,
        activeScheduleCount: 0,
        claimed: 0,
    });
    const [activityData, setActivityData] = useState<ActivityDataItem[]>([]);
    const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
    const [latestEvents, setLatestEvents] = useState([]);
    const { isConnected } = useAccount();
    const { tokenContractInstance, vestingContractInstance, owner, signer, provider, isLoading } = useContractContext();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isConnected || isLoading || !tokenContractInstance || !vestingContractInstance || !signer) {
                return;
            }
            try {
                const [totalSupply, contractBalance, activeSchedules] = await Promise.all([
                    tokenContractInstance.recordBook(vestingContractInstance.target),
                    tokenContractInstance.balanceOf(vestingContractInstance.target),
                    vestingContractInstance.activeSchedules(),
                ]);

                setDashValues({
                    balance: totalSupply,
                    activeScheduleCount: activeSchedules,
                    claimed: totalSupply - (contractBalance / DECIMALS),
                });

                fetchLatestFourEvents(vestingContractInstance, provider);
                fetchSchedules(vestingContractInstance, provider);
            } catch (e) {
                console.error("Error fetching dashboard data:", e);
                toast.error("Failed to fetch dashboard data. Check contract address or network.");
            }
        };

        fetchDashboardData();
    }, [isConnected, isLoading, tokenContractInstance, vestingContractInstance, signer]);

    async function fetchLatestFourEvents(vestingContract: ethers.Contract, provider: ethers.BrowserProvider) {
        try {
            const latestBlock = await provider.getBlockNumber();
            const startBlock = 23869354;

            const scheduleCreatedFilter = vestingContract.filters.ScheduleCreated(vestingContract.address);
            const tokenClaimedFilter = vestingContract.filters.TokenClaimed(vestingContract.address);
            const remainingTokensClaimedFilter = vestingContract.filters.RemainingTokensClaimed(vestingContract.address);

            const [scheduleCreatedEvents, tokenClaimedEvents, remainingTokensClaimedEvents] = await Promise.all([
                vestingContract.queryFilter(scheduleCreatedFilter, startBlock, latestBlock),
                vestingContract.queryFilter(tokenClaimedFilter, startBlock, latestBlock),
                vestingContract.queryFilter(remainingTokensClaimedFilter, startBlock, latestBlock),
            ]);

            const allEvents = [
                ...scheduleCreatedEvents.map((e) => ({ type: "ScheduleCreated", ...e })),
                ...tokenClaimedEvents.map((e) => ({ type: "TokenClaimed", ...e })),
                ...remainingTokensClaimedEvents.map((e) => ({ type: "RemainingTokensClaimed", ...e })),
            ].sort((a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex);

            const latestFourEvents = allEvents.slice(0, 4);
            setLatestEvents(latestFourEvents);

            const activityData = [
                { name: "Sun", value: 0 },
                { name: "Mon", value: 0 },
                { name: "Tue", value: 0 },
                { name: "Wed", value: 0 },
                { name: "Thu", value: 0 },
                { name: "Fri", value: 0 },
                { name: "Sat", value: 0 },
            ];

            tokenClaimedEvents.forEach((event) => {
                const eventTime = new Date(Number(event.args?.time) * 1000);
                const eventDay = eventTime.toLocaleString("en-IN", { weekday: "short" });
                const dayIndex = activityData.findIndex((day) => day.name === eventDay);
                if (dayIndex !== -1) {
                    activityData[dayIndex].value += Number(event.args?.amount / DECIMALS || 0);
                }
            });
            setActivityData(activityData);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to fetch events");
        }
    }

    async function fetchSchedules(vestingContract: ethers.Contract, provider: ethers.BrowserProvider) {
        try {
            let scheduleList: Schedule[] = [];
            const schedulesCount = await vestingContract.scheduleCount();
            for (let i = 0; i < schedulesCount; i++) {
                let addr = await vestingContract.scheduleIds(i);
                let scheduleDetails = await vestingContract.getSchedule(addr);
                let totalTokens = Number(scheduleDetails[1]);
                let startTime = new Date(Number(scheduleDetails[2]) * 1000).toLocaleDateString("en-IN");
                let endTime = new Date(Number(scheduleDetails[3]) * 1000).toLocaleDateString("en-IN");
                let status = scheduleDetails[5];

                let schedule: Schedule = {
                    id: i,
                    address: addr,
                    totalTokens: totalTokens,
                    startTime: startTime,
                    endTime: endTime,
                    status: status,
                };
                scheduleList.push(schedule);
            }
            setScheduleList(scheduleList);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Failed to fetch schedules");
        }
    }

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
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-radial from-violet-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-radial from-blue-600/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow delay-500"></div>
            </div>

            <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Tokens"
                        value={`${dashValues.balance} HA`}
                        icon={DollarSign}
                        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300"
                    />
                    <StatsCard
                        title="Active Schedules"
                        value={`${dashValues.activeScheduleCount}`}
                        icon={Activity}
                        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300"
                    />
                    <StatsCard
                        title="Total Tokens Claimed"
                        value={`${dashValues.claimed} HA`}
                        icon={ShieldCheck}
                        className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Weekly Activity</CardTitle>
                            <CardDescription className="text-gray-400">
                                Number of tokens claimed per day
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ActivityChart data={activityData} />
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription className="text-gray-400">
                                Latest transactions and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {latestEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/30"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mr-4">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="w-44">
                                            <h4 className="text-sm font-medium text-white">
                                                {event.type === "ScheduleCreated"
                                                    ? "New Schedule Created"
                                                    : event.type === "TokenClaimed"
                                                        ? "Token Claimed"
                                                        : "Remaining Tokens Claimed"}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                {new Date(
                                                    Number(event.args?.time || event.args?.[2] || 0) * 1000
                                                ).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}{" "}
                                                on{" "}
                                                {new Date(
                                                    Number(event.args?.time || event.args?.[2] || 0) * 1000
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                        <div className="flex-1 text-xs ml-4 text-gray-400">
                                            #{event.args?.to || event.args?.addr || "N/A"}
                                        </div>
                                        <div className="flex-1 text-right text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                                            {event.type === "TokenClaimed"
                                                ? `${event.args?.amount / DECIMALS || 0} Tokens`
                                                : event.type === "RemainingTokensClaimed"
                                                    ? `${event.args?.amount / DECIMALS || 0} Tokens`
                                                    : "N/A"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300 mb-16">
                    <CardHeader>
                        <CardTitle>Schedules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScheduleListTable schedules={scheduleList} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


