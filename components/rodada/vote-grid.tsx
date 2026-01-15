"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type VoteGridProps = {
  players: string[];
  revealedMap: Record<number, boolean>;
  onReveal: (index: number) => void;
  isImpostor: (index: number) => boolean;
};

export function VoteGrid({
  players,
  revealedMap,
  onReveal,
  isImpostor,
}: VoteGridProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const activeName = useMemo(() => {
    if (activeIndex === null) return "";
    return players[activeIndex] ?? "";
  }, [activeIndex, players]);

  const activeIsImpostor = useMemo(() => {
    if (activeIndex === null) return false;
    return isImpostor(activeIndex);
  }, [activeIndex, isImpostor]);

  function handlePick(index: number) {
    if (revealedMap[index]) return;

    setActiveIndex(index);
    setOpen(true);
    setEntered(false);
    setShowResult(false);
  }

  useEffect(() => {
    if (!open) return;

    const raf = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex === null) return;

    const t = window.setTimeout(() => {
      setShowResult(true);

      if (!revealedMap[activeIndex]) onReveal(activeIndex);
    }, 700);

    return () => window.clearTimeout(t);
  }, [open, activeIndex, onReveal, revealedMap]);

  function handleOpenChange(next: boolean) {
    if (!next && !showResult) return;

    setOpen(next);

    if (!next) {
      setActiveIndex(null);
      setEntered(false);
      setShowResult(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {players.map((name, index) => {
          const revealed = Boolean(revealedMap[index]);

          return (
            <button
              key={`${name}-${index}`}
              type="button"
              onClick={() => handlePick(index)}
              disabled={revealed}
              className={`w-full text-center ${
                revealed ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Card className="w-full shadow-sm transition-colors hover:bg-muted/30">
                <CardContent className="p-4 flex flex-col justify-between min-h-[72px]">
                  <p className="font-semibold truncate">{name}</p>

                  <p
                    className={`mt-1 text-xs font-semibold min-h-[16px] ${
                      revealed ? "text-muted-foreground" : "invisible"
                    }`}
                  >
                    Revelado
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-transparent shadow-none p-0 max-w-sm">
          {/* ✅ A11y: required by Radix */}
          <DialogTitle className="sr-only">Resultado da votação</DialogTitle>
          <DialogDescription className="sr-only">
            Mostra se o jogador selecionado é o impostor ou não.
          </DialogDescription>

          <div
            className={[
              "transform-gpu transition-all duration-700 ease-out",
              entered
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-360 scale-95",
            ].join(" ")}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center space-y-3">
                {!showResult ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Revelando...
                    </p>
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold truncate">
                      {activeName}
                    </p>

                    <p
                      className={`text-sm font-semibold ${
                        activeIsImpostor
                          ? "text-destructive"
                          : "text-emerald-500"
                      }`}
                    >
                      {activeIsImpostor ? "É O IMPOSTOR" : "NÃO É IMPOSTOR"}
                    </p>

                    <Button
                      type="button"
                      className="w-full mt-2"
                      onClick={() => handleOpenChange(false)}
                    >
                      OK
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
