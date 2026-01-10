"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  loadImpostorCount,
  loadPlayers,
  loadRoundDurationSec,
  saveGameSetup,
} from "@/lib/game-storage";

import { RoundDurationCard } from "./round-duration-card";
import { ImpostorsCard } from "./impostors-card";
import { createGameSetup } from "@/lib/game-setup";

const MIN_PLAYERS = 3;

// duração
const DEFAULT_DURATION_SEC = 120; // 2:00
const DURATION_STEP_SEC = 30;
const MIN_DURATION_SEC = 30; // 0:30
const MAX_DURATION_SEC = 15 * 60; // 15:00

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function ImpostoresScreen() {
  const router = useRouter();

  // carrega 1x (sem useEffect)
  const [players] = useState(() => loadPlayers());
  const playersCount = players.length;

  const maxImpostors = useMemo(() => {
    return Math.max(1, Math.floor(playersCount / 3));
  }, [playersCount]);

  const [impostors, setImpostors] = useState(() => {
    const saved = loadImpostorCount() ?? 1;
    const max = Math.max(1, Math.floor(playersCount / 3));
    return clamp(saved, 1, max);
  });

  const [roundDurationSec, setRoundDurationSec] = useState(() => {
    const saved = loadRoundDurationSec() ?? DEFAULT_DURATION_SEC;
    return clamp(saved, MIN_DURATION_SEC, MAX_DURATION_SEC);
  });

  // effect só para redirect (sem setState)
  useEffect(() => {
    if (playersCount < MIN_PLAYERS) {
      router.replace("/");
    }
  }, [router, playersCount]);

  // ✅ valor derivado/clampado (sem useEffect)
  const safeImpostors = clamp(impostors, 1, maxImpostors);

  function handleChangeImpostors(value: number) {
    setImpostors(clamp(value, 1, maxImpostors));
  }

  function handleChangeDuration(value: number) {
    setRoundDurationSec(clamp(value, MIN_DURATION_SEC, MAX_DURATION_SEC));
  }

  function handleContinue() {
    const setup = createGameSetup({
      players,
      impostorCount: safeImpostors,
      durationSec: clamp(roundDurationSec, MIN_DURATION_SEC, MAX_DURATION_SEC),
    });

    saveGameSetup(setup);
    router.push("/revelar");
  }

  return (
    <>
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mt-8">
          <h1 className="text-2xl font-semibold text-center">
            Configurações do jogo
          </h1>
        </header>

        <div className="mt-6 space-y-4 pb-28">
          <ImpostorsCard
            playersCount={playersCount}
            impostors={safeImpostors}
            minImpostors={1}
            maxImpostors={maxImpostors}
            onChangeImpostors={handleChangeImpostors}
          />

          <RoundDurationCard
            seconds={roundDurationSec}
            minSeconds={MIN_DURATION_SEC}
            maxSeconds={MAX_DURATION_SEC}
            stepSeconds={DURATION_STEP_SEC}
            onChange={handleChangeDuration}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="mx-auto w-full max-w-md px-4 py-4">
          <Button
            type="button"
            className="w-full rounded-full"
            onClick={handleContinue}
            disabled={playersCount < MIN_PLAYERS}
          >
            JOGAR
          </Button>
        </div>
      </div>
    </>
  );
}
