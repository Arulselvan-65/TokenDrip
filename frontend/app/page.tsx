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
  const [dashValues, setDashValues] = useState({
    balance: 0,
    activeScheduleCount: 0,
    claimed: 0
  })
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

          setDashValues({
            balance: totalSupply,
            activeScheduleCount: activeSchedules,
            claimed: (totalSupply - (contractBalance / 10n ** 18n))
          });

          setTokenContractInstance(token);
          setVestingContractInstance(vesting);
          setSigner(walletSigner);
        }
      }catch (e){
        console.log("error")
      }
    };
    init();
  }, [isConnected, connector]);


  const getValues = async () =>{
      setBalance(await getTotalSupply());
  }

  const activityData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 12 },
    { name: 'Sat', value: 9 },
    { name: 'Sun', value: 6 },
  ];

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
                  Number of new loans per day
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
                  {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mr-4">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">
                            New loan created #{i}
                          </h4>
                          <p className="text-xs text-gray-400">
                            2 minutes ago
                          </p>
                        </div>
                        <div className="ml-auto text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                          1.5 ETH
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