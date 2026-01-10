"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearGameSetup, loadGameSetup } from "@/lib/game-storage";
import { VoteGrid } from "./vote-grid";

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Phase = "running" | "paused" | "voting";

export function RoundScreen() {
  const router = useRouter();
  const setup = useMemo(() => loadGameSetup(), []);

  const players = setup?.players ?? [];
  const impostorIndices = setup?.impostorIndices ?? [];
  const initialSeconds = setup?.durationSec ?? 0;

  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState<Phase>("running");

  const [revealedMap, setRevealedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!setup || initialSeconds <= 0) {
      router.replace("/");
    }
  }, [router, setup, initialSeconds]);

  // ✅ countdown: transição pra votação acontece dentro do tick (callback do interval)
  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // chegou no fim -> entra na votação
          setRunning(false);
          setPhase("voting");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  const finished = remaining === 0;
  const isEnding = remaining > 0 && remaining <= 10;

  // pisca sincronizado com o segundo
  const blinkBg =
    running && phase === "running" && isEnding && !finished
      ? remaining % 2 === 0
      : false;

  const dangerMode = blinkBg;

  function handlePause() {
    if (finished) return;
    setRunning(false);
    setPhase("paused");
  }

  function handleResume() {
    if (finished) return;
    setPhase("running");
    setRunning(true);
  }

  function handleGoVote() {
    setRunning(false);
    setPhase("voting");
  }

  function handleRevealPlayer(index: number) {
    setRevealedMap((prev) => ({ ...prev, [index]: true }));
  }

  function isImpostor(index: number) {
    return impostorIndices.includes(index);
  }

  const hasVoted = Object.keys(revealedMap).length > 0;

  function handleRestart() {
    clearGameSetup();
    router.push("/");
  }

  if (!setup) return null;

  return (
    <>
      <div className="mx-auto w-full max-w-md px-4">
        {phase !== "voting" ? (
          <>
            <header className="mt-8">
              <h1 className="text-2xl font-semibold text-center">Rodada</h1>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Tempo definido: {formatSeconds(initialSeconds)}
              </p>
            </header>

            <div className="mt-6 pb-28">
              <Card
                className={`w-full shadow-sm ${blinkBg ? "bg-red-600" : ""}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-xl text-center ${
                      dangerMode ? "text-white" : ""
                    }`}
                  >
                    Cronômetro
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div
                    className={`text-center text-5xl font-bold ${
                      dangerMode ? "text-white" : ""
                    }`}
                  >
                    {formatSeconds(remaining)}
                  </div>

                  <p
                    className={`text-center text-sm ${
                      dangerMode ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    {finished
                      ? "Tempo acabou!"
                      : running
                      ? "Rodando..."
                      : "Pausado"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <header className="mt-8">
              <h1 className="text-2xl font-semibold text-center">
                Quem é o impostor?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Clique em um nome para revelar.
              </p>
            </header>

            <div className={`mt-6 ${hasVoted ? "pb-28" : "pb-10"}`}>
              <VoteGrid
                players={players}
                revealedMap={revealedMap}
                onReveal={handleRevealPlayer}
                isImpostor={isImpostor}
              />
            </div>
          </>
        )}
      </div>

      {phase !== "voting" ? (
        <div className="fixed bottom-0 left-0 right-0 bg-background">
          <div className="mx-auto w-full rounded-full max-w-md px-4 py-4">
            {phase === "running" ? (
              <Button
                type="button"
                className="w-full"
                onClick={handlePause}
                disabled={finished}
              >
                PAUSAR
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="flex-1"
                  variant="outline"
                  onClick={handleResume}
                >
                  RETOMAR
                </Button>
                <Button type="button" className="flex-1" onClick={handleGoVote}>
                  VOTAR
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : hasVoted ? (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="mx-auto w-full max-w-md px-4 py-4">
            <Button type="button" className="w-full" onClick={handleRestart}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              JOGAR NOVAMENTE
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
