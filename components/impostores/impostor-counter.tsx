"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImpostorCounterProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function ImpostorCounter({
  value,
  min,
  max,
  onChange,
}: ImpostorCounterProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrement}
        className="h-10 w-10 rounded-full p-0"
        aria-label="Diminuir impostores"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="min-w-12 text-center text-2xl font-semibold">{value}</div>

      <Button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={!canIncrement}
        className="h-10 w-10 rounded-full p-0"
        aria-label="Aumentar impostores"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
