// @ts-nocheck
"use client"

import {useState, useEffect, useContext} from 'react';
import { Activity, DollarSign, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card';
import StatsCard from '@/app/components/dashboard/stats-card';
import ActivityChart from '@/app/components/dashboard/activity-chart';
import LoanTable from '@/app/components/dashboard/loan-table';
import {getTotalSupply} from "@/app/utils/contracts/interactions";
import {ethers} from "ethers";
import {useAccount} from "wagmi";
import {ContractContext} from "@/app/contexts/ContractContext";
import { tokenContractAddress, vestingContractAddress } from "./contexts/config";
import { tokenAbi }  from "./utils/contracts/abi/TokenContract";
import { abi } from "./utils/contracts/abi/VestingContract";
import { toast } from "react-toastify";


export default function DashboardPage() {
  const DECIMALS = 10n ** 18n;
  const [dashValues, setDashValues] = useState({
    balance: 0,
    activeScheduleCount: 0,
    claimed: 0
  })
  const [activityData, setActivityData] = useState([
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 }
  ]);

  const [latestEvents, setLatestEvents] = useState([]);
  const { address, connector, isConnected, isConnecting} = useAccount();
  const { setTokenContractInstance, setVestingContractInstance, setSigner } = useContext(ContractContext);

  useEffect(() => {
    const init = async () => {
      if(!isConnected){
        toast.error("Connect Wallet to continue");
      }
      try {
        if (isConnected && connector.name) {
          const provider = new ethers.BrowserProvider(await connector?.getProvider());
          const walletSigner = await provider.getSigner();
          const token = new ethers.Contract(tokenContractAddress, tokenAbi, walletSigner);
          const vesting = new ethers.Contract(vestingContractAddress, abi, walletSigner);

          const [totalSupply, contractBalance, activeSchedules] = await Promise.all([
            token.recordBook(vesting.target),
            token.balanceOf(vesting.target),
            vesting.activeSchedules()
          ]);

          console.log(contractBalance)
          setDashValues({
            balance: totalSupply,
            activeScheduleCount: activeSchedules,
            claimed: (totalSupply - (contractBalance / 10n ** 18n))
          });

          setTokenContractInstance(token);
          setVestingContractInstance(vesting);
          setSigner(walletSigner);
          fetchLatestFourEvents(vesting, provider);
        }
      }catch (e){
        console.log("error")
      }
    };
    init();
  }, [isConnected, connector]);

  async function fetchLatestFourEvents(vestingContract, provider) {
    try {
      const latestBlock = await provider.getBlockNumber();
      const startBlock = 0;

      const scheduleCreatedFilter = vestingContract.filters.ScheduleCreated(vestingContract.address);
      const tokenClaimedFilter = vestingContract.filters.TokenClaimed(vestingContract.address);
      const remainingTokensClaimedFilter = vestingContract.filters.RemainingTokensClaimed(vestingContract.address);

      const [scheduleCreatedEvents, tokenClaimedEvents, remainingTokensClaimedEvents] = await Promise.all([
        vestingContract.queryFilter(scheduleCreatedFilter, startBlock, latestBlock),
        vestingContract.queryFilter(tokenClaimedFilter, startBlock, latestBlock),
        vestingContract.queryFilter(remainingTokensClaimedFilter, startBlock, latestBlock)
      ]);

      const allEvents = [
        ...scheduleCreatedEvents.map(e => ({ type: 'ScheduleCreated', ...e })),
        ...tokenClaimedEvents.map(e => ({ type: 'TokenClaimed', ...e })),
        ...remainingTokensClaimedEvents.map(e => ({ type: 'RemainingTokensClaimed', ...e }))
      ].sort((a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex);

      const latestFourEvents = allEvents.slice(0, 4);
      setLatestEvents(latestFourEvents);

      // Token Claimed record
      const activityData = [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 0 }
      ];

      tokenClaimedEvents.forEach(event => {
        const eventTime = new Date(Number(event.args?.time) * 1000);
        const eventDay = eventTime.toLocaleString('en-IN', { weekday: 'short' });
        const dayIndex = activityData.findIndex(day => day.name === eventDay);
        if (dayIndex !== -1) {
          activityData[dayIndex].value += Number(event.args?.amount/DECIMALS || 0);
        }
      });
      setActivityData(activityData);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  const getValues = async () =>{
      setBalance(await getTotalSupply());
  }

  const mockLoans = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    borrower: '0x1234...5678',
    collection: 'Bored Apes',
    amount: '2.5 ETH',
    interest: '5.2%',
    status: 'Active'
  }));

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

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
                <CardTitle >
                  Weekly Activity
                </CardTitle>
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
                <CardTitle>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Latest transactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {latestEvents.map((event, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mr-4">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-44">
                          <h4 className="text-sm font-medium text-white">
                            {event.type === 'ScheduleCreated' ? 'New Schedule Created' :
                                event.type === 'TokenClaimed' ? 'Token Claimed' : 'Remaining Tokens Claimed'}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {new Date(Number(event.args?.time || event.args?.[2] || 0) * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} on {new Date(Number(event.args?.time || event.args?.[2] || 0) * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-1 text-xs ml-4 text-gray-400">
                          #{event.args?.to || event.args?.addr || 'N/A'}
                        </div>
                        <div className="flex-1 text-right text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                          {event.type === 'TokenClaimed' ? `${event.args?.amount/DECIMALS || 0} Tokens` :
                              event.type === 'RemainingTokensClaimed' ? `${event.args?.amount/DECIMALS || 0} Tokens` : 'N/A'}
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 transition-all duration-300 mb-16">
            <CardHeader>
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                Active Loans
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your current loan positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoanTable loans={mockLoans} onRefresh={handleRefresh} />
            </CardContent>
          </Card>

        </div>
      </div>
  );
}