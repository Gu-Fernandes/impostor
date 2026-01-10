"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DurationCounterProps = {
  seconds: number;
  stepSeconds: number;
  minSeconds: number;
  maxSeconds: number;
  onChange: (seconds: number) => void;
};

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`; // 2:00, 2:30, 3:00...
}

export function DurationCounter({
  seconds,
  stepSeconds,
  minSeconds,
  maxSeconds,
  onChange,
}: DurationCounterProps) {
  const canDecrement = seconds - stepSeconds >= minSeconds;
  const canIncrement = seconds + stepSeconds <= maxSeconds;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(seconds - stepSeconds)}
        disabled={!canDecrement}
        className="h-10 w-10 rounded-full p-0"
        aria-label="Diminuir duração"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="min-w-20 text-center text-2xl font-semibold">
        {formatSeconds(seconds)}
      </div>

      <Button
        type="button"
        onClick={() => onChange(seconds + stepSeconds)}
        disabled={!canIncrement}
        className="h-10 w-10 rounded-full p-0"
        aria-label="Aumentar duração"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
