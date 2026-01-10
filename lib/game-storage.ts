import { GameSetup } from "./game-setup";

const PLAYERS_KEY = "impostor-game:players";
const IMPOSTORS_KEY = "impostor-game:impostors";

export function savePlayers(players: string[]) {
  try {
    sessionStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  } catch {}
}

export function loadPlayers(): string[] {
  try {
    const raw = sessionStorage.getItem(PLAYERS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function saveImpostorCount(count: number) {
  try {
    sessionStorage.setItem(IMPOSTORS_KEY, String(count));
  } catch {}
}

export function loadImpostorCount(): number | null {
  try {
    const raw = sessionStorage.getItem(IMPOSTORS_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const ROUND_DURATION_KEY = "impostor-game:roundDurationSec";

export function saveRoundDurationSec(seconds: number) {
  try {
    sessionStorage.setItem(ROUND_DURATION_KEY, String(seconds));
  } catch {}
}

export function loadRoundDurationSec(): number | null {
  try {
    const raw = sessionStorage.getItem(ROUND_DURATION_KEY);
    if (!raw) return null;

    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const GAME_SETUP_KEY = "impostor-game:setup";

export function saveGameSetup(setup: GameSetup) {
  try {
    sessionStorage.setItem(GAME_SETUP_KEY, JSON.stringify(setup));
  } catch {}
}

export function loadGameSetup(): GameSetup | null {
  try {
    const raw = sessionStorage.getItem(GAME_SETUP_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GameSetup;
    if (
      !parsed ||
      !Array.isArray(parsed.players) ||
      !Array.isArray(parsed.impostorIndices)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearGameSetup() {
  try {
    sessionStorage.removeItem(GAME_SETUP_KEY);
  } catch {}
}
