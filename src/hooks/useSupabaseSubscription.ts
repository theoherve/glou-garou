"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Game, Player } from "@/types/game";

interface UseSupabaseSubscriptionOptions {
  table: "games" | "players" | "game_actions";
  filter?: {
    column: string;
    value: string | number;
  };
}

export const useSupabaseSubscription = <T>(
  options: UseSupabaseSubscriptionOptions,
  onDataChange?: (data: T[]) => void
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from(options.table).select("*");

    if (options.filter) {
      query = query.eq(options.filter.column, options.filter.value);
    }

    // Charger les données initiales
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { data: initialData, error: initialError } = await query;

        if (initialError) {
          setError(initialError.message);
        } else {
          setData(initialData || []);
          onDataChange?.(initialData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel(`${options.table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: options.table,
          filter: options.filter
            ? `${options.filter.column}=eq.${options.filter.value}`
            : undefined,
        },
        (payload) => {
          console.log(`${options.table} change:`, payload);

          if (payload.eventType === "INSERT") {
            setData((prev) => {
              const newData = [...prev, payload.new as T];
              onDataChange?.(newData);
              return newData;
            });
          } else if (payload.eventType === "UPDATE") {
            setData((prev) => {
              const newData = prev.map((item: any) =>
                item.id === payload.new.id ? payload.new : item
              );
              onDataChange?.(newData);
              return newData;
            });
          } else if (payload.eventType === "DELETE") {
            setData((prev) => {
              const newData = prev.filter(
                (item: any) => item.id !== payload.old.id
              );
              onDataChange?.(newData);
              return newData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [
    options.table,
    options.filter?.column,
    options.filter?.value,
    onDataChange,
  ]);

  return { data, loading, error };
};

// Hook spécialisé pour les jeux
export const useGameSubscription = (roomCode: string) => {
  return useSupabaseSubscription<Game>(
    { table: "games", filter: { column: "room_code", value: roomCode } },
    (games) => {
      if (games.length > 0) {
        // Convertir le format de la base de données vers le format de l'application
        const game = games[0];
        // Ici vous pouvez dispatcher une action pour mettre à jour le store
        console.log("Game updated:", game);
      }
    }
  );
};

// Hook spécialisé pour les joueurs d'un jeu
export const usePlayersSubscription = (gameId: string) => {
  return useSupabaseSubscription<Player>(
    { table: "players", filter: { column: "game_id", value: gameId } },
    (players) => {
      // Ici vous pouvez dispatcher une action pour mettre à jour le store
      console.log("Players updated:", players);
    }
  );
};
