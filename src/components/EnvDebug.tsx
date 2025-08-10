"use client";

export const EnvDebug = () => {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4 text-black">
      <h3 className="font-semibold mb-2">Variables d'environnement :</h3>
      <div className="space-y-1 text-sm">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono">{key}:</span>
            <span className={`font-mono ${value ? 'text-green-600' : 'text-red-600'}`}>
              {value ? `${value.substring(0, 20)}...` : 'undefined'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 