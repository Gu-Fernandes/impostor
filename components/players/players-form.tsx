"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { playersSchema, type PlayersFormValues } from "@/schemas/player.schema";
import { PlayerRow } from "./player-row";
import { savePlayers } from "@/lib/game-storage";

const MIN_PLAYERS = 3;

export function PlayersForm() {
  const router = useRouter();

  const form = useForm<PlayersFormValues>({
    resolver: zodResolver(playersSchema),
    defaultValues: { players: [{ name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players",
  });

  const players = useWatch({ control: form.control, name: "players" }) ?? [];

  const filledPlayersCount = players.filter((p) => p?.name?.trim()).length;
  const canContinue = filledPlayersCount >= MIN_PLAYERS;

  const lastName = players[fields.length - 1]?.name?.trim() ?? "";
  const canAddPlayer = lastName.length > 0;

  function handleAddPlayer() {
    if (!canAddPlayer) return;
    append({ name: "" });
  }

  function onSubmit(values: PlayersFormValues) {
    const names = values.players.map((p) => p.name.trim()).filter(Boolean);

    savePlayers(names);
    router.push("/impostores");
  }

  return (
    <>
      {/* ✅ wrapper com padding horizontal */}
      <div className="mx-auto w-full max-w-md px-2">
        <Card className="mt-5 w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Quem vai jogar?
            </CardTitle>
          </CardHeader>

          <CardContent className="max-h-[60vh] overflow-y-auto">
            <Form {...form}>
              <form
                id="player-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {fields.map((item, index) => (
                  <PlayerRow
                    key={item.id}
                    control={form.control}
                    index={index}
                    isLast={index === fields.length - 1}
                    canRemove={fields.length > 1}
                    canAdd={canAddPlayer}
                    onAdd={handleAddPlayer}
                    onRemove={() => remove(index)}
                  />
                ))}

                <p className="text-sm font-semibold text-center text-muted-foreground">
                  Jogadores: {filledPlayersCount}
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* ✅ footer também alinhado com o mesmo max-w e padding */}
      <div className="fixed bottom-0 left-0 right-0 bg-background">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          {canContinue ? (
            <Button
              type="submit"
              form="player-form"
              className="w-full rounded-full"
            >
              CONTINUAR
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Adicione pelo menos 3 jogadores para continuar
            </p>
          )}
        </div>
      </div>
    </>
  );
}
