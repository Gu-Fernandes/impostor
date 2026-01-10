"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImpostorCounter } from "./impostor-counter";

type ImpostorsCardProps = {
  playersCount: number;
  impostors: number;
  minImpostors: number;
  maxImpostors: number;
  onChangeImpostors: (value: number) => void;
};

export function ImpostorsCard({
  playersCount,
  impostors,
  minImpostors,
  maxImpostors,
  onChangeImpostors,
}: ImpostorsCardProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center">Impostores</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">
          Jogadores na rodada:{" "}
          <span className="font-semibold">{playersCount}</span>
        </p>

        <p className="text-sm text-muted-foreground text-center">
          Quantos jogadores serão impostores nesta rodada?
        </p>

        <ImpostorCounter
          value={impostors}
          min={minImpostors}
          max={maxImpostors}
          onChange={onChangeImpostors}
        />
      </CardContent>
    </Card>
  );
}
