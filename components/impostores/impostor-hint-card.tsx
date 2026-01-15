"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type Props = {
  enabled: boolean;
  onChange: (value: boolean) => void;
};

export function ImpostorHintCard({ enabled, onChange }: Props) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">
          Dar alguma dica ao impostor?
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Se ativado, o impostor verá uma dica relacionada à palavra.
        </p>

        <Switch checked={enabled} onCheckedChange={onChange} />
      </CardContent>
    </Card>
  );
}
