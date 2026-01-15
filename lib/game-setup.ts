import { WORDS } from "@/constants/words";

export type GameSetup = {
  players: string[];
  impostorIndices: number[]; // índices dos jogadores impostores
  word: string;
  durationSec: number;
  createdAt: number;

  // ✅ novo (opcional pra não quebrar setups antigos no storage)
  impostorHintEnabled?: boolean;
  impostorHint?: string | null;
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

/**
 * ✅ Dica simples e relacionada (sem revelar demais):
 * - começa/termina com letra X
 * - tem N palavras
 * - tem N caracteres (sem espaços)
 * - tem/nao tem acento (quando tiver)
 */
function getWordHint(word: string) {
  const w = word.trim();
  if (!w) return null;

  const compact = w.replace(/\s+/g, "");
  const firstChar = compact[0] ?? w[0] ?? "";
  const lastChar = compact[compact.length - 1] ?? w[w.length - 1] ?? "";

  const options: Array<string | null> = [
    firstChar ? `Começa com "${firstChar.toUpperCase()}".` : null,
    lastChar ? `Termina com "${lastChar.toUpperCase()}".` : null,
    compact ? `Tem ${compact.length} letras (sem espaços).` : null,
  ].filter(Boolean);

  if (options.length === 0) return null;

  return options[randomInt(options.length)] as string;
}

export function createGameSetup(args: {
  players: string[];
  impostorCount: number;
  durationSec: number;

  impostorHintEnabled?: boolean;
}): GameSetup {
  const players = args.players.map((p) => p.trim()).filter(Boolean);

  const impostorCount = Math.max(
    1,
    Math.min(args.impostorCount, players.length)
  );

  const word = pickRandomWord();
  const impostorIndices = pickUniqueIndices(impostorCount, players.length);

  const impostorHintEnabled = Boolean(args.impostorHintEnabled);
  const impostorHint = impostorHintEnabled ? getWordHint(word) : null;

  return {
    players,
    impostorIndices,
    word,
    durationSec: args.durationSec,
    createdAt: Date.now(),
    impostorHintEnabled,
    impostorHint,
  };
}
