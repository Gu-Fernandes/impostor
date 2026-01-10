"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DurationCounter } from "./duration-counter";

type RoundDurationCardProps = {
  seconds: number;
  minSeconds: number;
  maxSeconds: number;
  stepSeconds: number;
  onChange: (seconds: number) => void;
};

export function RoundDurationCard({
  seconds,
  minSeconds,
  maxSeconds,
  stepSeconds,
  onChange,
}: RoundDurationCardProps) {
  return (
    <Card className="w-full pb-10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center">Duração da rodada</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">
          Quanto tempo deve durar a rodada?
        </p>

        <DurationCounter
          seconds={seconds}
          stepSeconds={stepSeconds}
          minSeconds={minSeconds}
          maxSeconds={maxSeconds}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}
