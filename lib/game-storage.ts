import { GameSetup } from "./game-setup";

const PLAYERS_KEY = "impostor-game:players";
const IMPOSTORS_KEY = "impostor-game:impostors";

export function savePlayers(players: string[]): void {
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

export function saveImpostorCount(count: number): void {
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

export function saveRoundDurationSec(seconds: number): void {
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

export function saveGameSetup(setup: GameSetup): void {
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

export function clearGameSetup(): void {
  try {
    sessionStorage.removeItem(GAME_SETUP_KEY);
  } catch {}
}

const IMPOSTOR_HINT_ENABLED_KEY = "impostor-game:impostorHintEnabled";

export function loadImpostorHintEnabled(): boolean | null {
  try {
    const raw = localStorage.getItem(IMPOSTOR_HINT_ENABLED_KEY);
    if (raw === null) return null;

    return raw === "true";
  } catch {
    return null;
  }
}

export function saveImpostorHintEnabled(value: boolean): void {
  try {
    localStorage.setItem(IMPOSTOR_HINT_ENABLED_KEY, String(value));
  } catch {}
}
