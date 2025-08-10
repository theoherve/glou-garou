'use client';

import dynamic from 'next/dynamic';
import { SupabaseTest } from "@/components/SupabaseTest";
import { SimpleSupabaseTest } from "@/components/SimpleSupabaseTest";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { EnvDebug } from "@/components/EnvDebug";
import { NetworkTest } from "@/components/NetworkTest";

// Dynamically import RealtimeTest to prevent build issues
const RealtimeTest = dynamic(() => import('@/components/RealtimeTest'), {
  ssr: false,
  loading: () => <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">Chargement du test Realtime...</div>
});

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Test Supabase Realtime</h1>
        <p className="text-gray-600 mb-4">
          Cette page permet de tester la configuration Supabase et les fonctionnalités Realtime.
        </p>
        <div className="flex items-center gap-2 mb-4 ">
          <span className="text-sm">Statut:</span>
          <SupabaseStatus />
        </div>
        <EnvDebug />
      </div>
      
      <NetworkTest />
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Test Simple</h2>
        <SimpleSupabaseTest />
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Test Complet</h2>
        <SupabaseTest />
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Test Realtime</h2>
        <RealtimeTest />
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions :</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Assurez-vous d'avoir exécuté le script SQL dans Supabase</li>
          <li>2. Vérifiez que Realtime est activé pour les tables</li>
          <li>3. Testez la création d'un jeu</li>
          <li>4. Testez les canaux Realtime</li>
        </ol>
      </div>
    </div>
  );
} 