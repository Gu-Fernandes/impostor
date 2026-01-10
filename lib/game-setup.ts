import { WORDS } from "@/constants/words";

export type GameSetup = {
  players: string[];
  impostorIndices: number[]; // índices dos jogadores impostores
  word: string;
  durationSec: number;
  createdAt: number;
};

function randomInt(maxExclusive: number) {
  if (maxExclusive <= 0) return 0;

  // crypto (melhor), fallback pro Math.random
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function pickRandomWord() {
  const idx = randomInt(WORDS.length);
  return WORDS[idx];
}

function pickUniqueIndices(count: number, maxExclusive: number) {
  const chosen = new Set<number>();
  while (chosen.size < count) {
    chosen.add(randomInt(maxExclusive));
  }
  return Array.from(chosen);
}

export function createGameSetup(args: {
  players: string[];
  impostorCount: number;
  durationSec: number;
}): GameSetup {
  const players = args.players.map((p) => p.trim()).filter(Boolean);

  const impostorCount = Math.max(
    1,
    Math.min(args.impostorCount, players.length)
  );
  const word = pickRandomWord();
  const impostorIndices = pickUniqueIndices(impostorCount, players.length);

  return {
    players,
    impostorIndices,
    word,
    durationSec: args.durationSec,
    createdAt: Date.now(),
  };
}
