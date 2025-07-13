"use client"

import React, { useState } from 'react';
import { ConnectButtonC } from '../ConnectButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';

export const Navbar = () => {

   const [userAddress, setUserAddress] = useState("");
   const [totalDays, setTotalDays] = useState("");
   const [totalTokens, setTotalTokens] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createSchedule = async () => {

  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Token Drip
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                    onClick={createSchedule}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-md font-medium bg-emerald-900/20 text-emerald-400 border border-emerald-800 gap-2"
                >
                  <span className="truncate">Create</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle>Create Schedule</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">User Address</label>
                      <input
                          type="text"
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none"
                          placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Total Days</label>
                      <input
                          type="text"
                          value={totalDays}
                          onChange={(e) => setTotalDays(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none"
                          placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Total Tokens</label>
                      <input
                          type="text"
                          value={totalTokens}
                          onChange={(e) => setTotalTokens(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none"
                          placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <button
                     // onClick={handlePayment}
                      className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     // disabled={!paymentAmount}
                  >
                    Create
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="hidden sm:block">
            <ConnectButtonC/>
          </div>
          <div className="block sm:hidden">
            <ConnectButtonC displayType="compact"/>
          </div>
        </div>
      </div>
    </nav>
  );
};