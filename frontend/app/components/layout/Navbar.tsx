"use client"
import React from 'react';
import { ConnectButtonC } from '../ConnectButton';

export const Navbar = () => {


  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Token Drip
          </h1>
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