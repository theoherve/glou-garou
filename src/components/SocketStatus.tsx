"use client";

import { useSocket } from '@/hooks/useSocket';

export const SocketStatus = () => {
  const { isConnected } = useSocket();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-[#333a45]/80 text-[#e0e0e0] border border-[#333a45] backdrop-blur-sm' 
          : 'bg-[#ff3333]/80 text-[#e0e0e0] border border-[#ff3333] backdrop-blur-sm'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-[#ff9933]' : 'bg-[#ff3333]'
        }`} />
        <span>
          {isConnected ? 'Connecté' : 'Déconnecté'}
        </span>
      </div>
    </div>
  );
}; 