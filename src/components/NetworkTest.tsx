"use client";

import { useState } from "react";

export const NetworkTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testNetworkConnectivity = async () => {
    setTestResults([]);
    
    try {
      // Test 1: Test de connectivité internet
      addResult("Test 1: Test de connectivité internet...");
      const response = await fetch("https://supabase.com");
      
      if (response.ok) {
        addResult("✅ Connectivité internet OK");
      } else {
        addResult(`❌ Erreur HTTP: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 2: Test API simple
      addResult("Test 2: Test d'API simple...");
      const testResponse = await fetch("/api/test-supabase", {
        method: "GET",
      });
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        addResult(`✅ API simple réussie: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ Erreur API simple: ${testResponse.status}`);
      }
    } catch (error) {
      addResult(`❌ Erreur API simple: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 3: Test Supabase côté serveur
      addResult("Test 3: Test Supabase côté serveur...");
      const testDbResponse = await fetch("/api/test-supabase-db", {
        method: "GET",
      });
      
      if (testDbResponse.ok) {
        const data = await testDbResponse.json();
        addResult(`✅ Supabase serveur: ${JSON.stringify(data)}`);
      } else {
        const errorData = await testDbResponse.json();
        addResult(`❌ Erreur Supabase serveur: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      addResult(`❌ Erreur Supabase serveur: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 4: Test de connectivité serveur
      addResult("Test 4: Test de connectivité serveur...");
      const testPublicResponse = await fetch("/api/test-supabase-public", {
        method: "GET",
      });
      
      if (testPublicResponse.ok) {
        const data = await testPublicResponse.json();
        addResult(`✅ Connectivité serveur: ${JSON.stringify(data)}`);
      } else {
        const errorData = await testPublicResponse.json();
        addResult(`❌ Erreur connectivité serveur: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      addResult(`❌ Erreur connectivité serveur: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 5: Test PostgreSQL direct
      addResult("Test 5: Test PostgreSQL direct...");
      const testPostgresResponse = await fetch("/api/test-postgres", {
        method: "GET",
      });
      
      if (testPostgresResponse.ok) {
        const data = await testPostgresResponse.json();
        addResult(`✅ PostgreSQL direct: ${JSON.stringify(data)}`);
      } else {
        const errorData = await testPostgresResponse.json();
        addResult(`❌ Erreur PostgreSQL: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      addResult(`❌ Erreur PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 6: Test PostgreSQL direct (sans pooler)
      addResult("Test 6: Test PostgreSQL direct (sans pooler)...");
      const testPostgresDirectResponse = await fetch("/api/test-postgres-direct", {
        method: "GET",
      });
      
      if (testPostgresDirectResponse.ok) {
        const data = await testPostgresDirectResponse.json();
        addResult(`✅ PostgreSQL direct (sans pooler): ${JSON.stringify(data)}`);
      } else {
        const errorData = await testPostgresDirectResponse.json();
        addResult(`❌ Erreur PostgreSQL direct: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      addResult(`❌ Erreur PostgreSQL direct: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    try {
      // Test 7: Test API REST Supabase
      addResult("Test 7: Test API REST Supabase...");
      const testSupabaseRestResponse = await fetch("/api/test-supabase-rest", {
        method: "GET",
      });
      
      if (testSupabaseRestResponse.ok) {
        const data = await testSupabaseRestResponse.json();
        addResult(`✅ API REST Supabase: ${JSON.stringify(data)}`);
      } else {
        const errorData = await testSupabaseRestResponse.json();
        addResult(`❌ Erreur API REST Supabase: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      addResult(`❌ Erreur API REST Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg mb-4 text-black">
      <h3 className="font-semibold mb-2">Test de connectivité réseau</h3>
      <button
        onClick={testNetworkConnectivity}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Tester la connectivité
      </button>
      
      <div className="bg-white p-2 rounded border max-h-32 overflow-y-auto">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}; 