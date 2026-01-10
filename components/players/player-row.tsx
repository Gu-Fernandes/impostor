"use client";

import { Plus, X } from "lucide-react";
import type { Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { PlayersFormValues } from "@/schemas/player.schema";

type PlayerRowProps = {
  control: Control<PlayersFormValues>;
  index: number;
  isLast: boolean;
  canRemove: boolean;
  canAdd: boolean;
  onAdd: () => void;
  onRemove: () => void;
};

export function PlayerRow({
  control,
  index,
  isLast,
  canRemove,
  canAdd,
  onAdd,
  onRemove,
}: PlayerRowProps) {
  return (
    <div className="flex gap-2">
      <FormField
        control={control}
        name={`players.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                {...field}
                placeholder="Nome do jogador"
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isLast ? (
        <Button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          className="h-10 w-10 rounded-full p-0"
          aria-label="Adicionar jogador"
        >
          <Plus className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={!canRemove}
          className="h-10 w-10 rounded-full p-0"
          aria-label="Remover jogador"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
