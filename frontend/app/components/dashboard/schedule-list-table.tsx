"use client"

import { RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";

interface Schedule {
  id: number;
  address: string;
  totalTokens: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface ScheduleProps {
  schedules: Schedule[];
  className?: string;
}

const ScheduleListTable = ({ schedules, className }: ScheduleProps) => {
  return (
    <Card className={className}>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-center py-4 px-4 font-medium text-gray-400">Schedule ID</th>
              <th className="text-center py-4 px-4 font-medium text-gray-400">Address</th>
              <th className="text-center py-4 px-4 font-medium text-gray-400">Total Tokens</th>
              <th className="text-center py-4 px-4 font-medium text-gray-400">Start Time</th>
              <th className="text-center py-4 px-4 font-medium text-gray-400">End Time</th>
              <th className="text-center py-4 px-4 font-medium text-gray-400">Status</th>
            </tr>
            </thead>
            <tbody>
            {schedules.map((schedule) => (
                <tr
                    key={schedule.id}
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <td className="py-4 px-4 text-center text-gray-300">#{schedule.id}</td>
                  <td className="py-4 px-4 text-center text-gray-300">
                    {schedule.address.slice(0, 6)}...{schedule.address.slice(-6)}
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-gray-300">
                    {schedule.totalTokens}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-300">{schedule.startTime}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{schedule.endTime}</td>
                  <td className="py-4 px-4 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-400 border border-violet-500/30">
            {schedule.status ? 'Active' : 'Inactive'}
          </span>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleListTable;