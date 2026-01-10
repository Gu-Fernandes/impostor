import { z } from "zod";

export const playersSchema = z
  .object({
    players: z.array(
      z.object({
        name: z.string().trim(),
      })
    ),
  })
  .superRefine((val, ctx) => {
    const filledCount = val.players.filter((p) => p.name.length > 0).length;

    if (filledCount < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players"],
        message: "Adicione pelo menos 3 jogadores para continuar",
      });
    }
  });

export type PlayersFormValues = z.infer<typeof playersSchema>;
