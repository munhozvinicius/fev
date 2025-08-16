
export const PARTNERS = ["Safe TI", "JLC Tech"] as const;
export type Partner = typeof PARTNERS[number];

export const CONSULTORS_BY_PARTNER: Record<Partner, string[]> = {
  "Safe TI": [
    "Carlos Judice",
    "Juliana Barbosa"
  ],
  "JLC Tech": [
    "Marina Mariane",
    "Junior",
    "Ana Paula",
    "João Lucas",
    "Juliana Carvalho",
    "Wanda"
  ]
};
