"use client";

import { Card, CardContent } from "@/components/ui/card";

type VoteGridProps = {
  players: string[];
  revealedMap: Record<number, boolean>;
  onReveal: (index: number) => void;
  isImpostor: (index: number) => boolean;
};

export function VoteGrid({
  players,
  revealedMap,
  onReveal,
  isImpostor,
}: VoteGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {players.map((name, index) => {
        const revealed = Boolean(revealedMap[index]);
        const impostor = isImpostor(index);

        return (
          <button
            key={`${name}-${index}`}
            type="button"
            onClick={() => onReveal(index)}
            className="w-full text-center"
          >
            <Card className="w-full shadow-sm transition-colors hover:bg-muted/30">
              <CardContent className="p-4">
                <p className="font-semibold truncate">{name}</p>

                {revealed && (
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      impostor ? "text-destructive" : "text-emerald-600"
                    }`}
                  >
                    {impostor ? "IMPOSTOR" : "NÃO É IMPOSTOR"}
                  </p>
                )}
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
