"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadGameSetup } from "@/lib/game-storage";

const FOOTER_SPACE = 96; // espaço aproximado do footer (px)

export function RevealScreen() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const setup = useMemo(() => loadGameSetup(), []);
  const players = setup?.players ?? [];

  useEffect(() => {
    if (!setup || players.length < 3) {
      router.replace("/");
    }
  }, [router, setup, players.length]);

  if (!setup) return null;

  const currentPlayer = players[index] ?? "";
  const isImpostor = setup.impostorIndices.includes(index);
  const isLast = index === players.length - 1;

  function handlePrimary() {
    if (!revealed) {
      setRevealed(true);
      return;
    }

    if (!isLast) {
      setIndex((prev) => prev + 1);
      setRevealed(false);
      return;
    }

    router.push("/rodada");
  }

  const primaryLabel = !revealed
    ? "VER PALAVRA"
    : isLast
    ? "COMEÇAR"
    : "PRÓXIMO JOGADOR";

  return (
    <>
      <div className="mx-auto w-full max-w-md px-4">
        {/* Área principal com altura de tela, descontando o footer */}
        <div
          className="flex flex-col"
          style={{ minHeight: `calc(100vh - ${FOOTER_SPACE}px)` }}
        >
          <header className="mt-8">
            <h1 className="text-2xl font-semibold text-center">
              Passe o celular
            </h1>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Jogador {index + 1} de {players.length}
            </p>
          </header>

          {/* Card centralizado */}
          <div className="flex flex-1 items-center justify-center py-6">
            <Card className="w-full shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  {currentPlayer}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {!revealed ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Clique em “Ver palavra” para ver seu papel.
                  </p>
                ) : (
                  <div className="rounded-md border p-4 text-center">
                    {isImpostor ? (
                      <p className="text-lg text-red-500 font-bold">
                        VOCÊ É O IMPOSTOR
                      </p>
                    ) : (
                      <p className="text-lg font-semibold">{setup.word}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          <Button type="button" className="w-full" onClick={handlePrimary}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
