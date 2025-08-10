import { SupabaseTest } from "@/components/SupabaseTest";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { EnvDebug } from "@/components/EnvDebug";
import { NetworkTest } from "@/components/NetworkTest";

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
      <SupabaseTest />
      
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