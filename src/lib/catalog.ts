
export type CatalogItem = {
  pilar: "Móvel" | "Fixa Básica" | "Voz Avançada" | "Dados Avançados" | "Combo Dados+Voz";
  tipo: string;
  produto: string;
  prazo?: string;
  preco: number;
};
export const MOVEL: CatalogItem[] = [
  { pilar: "Móvel", tipo: "Planos", produto: "1 GB", preco: 24.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "3 GB", preco: 29.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "6 GB", preco: 39.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "15 GB", preco: 54.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "20 GB", preco: 59.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "30 GB", preco: 69.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "40 GB", preco: 79.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "50 GB", preco: 89.99 },
  { pilar: "Móvel", tipo: "Planos", produto: "100 GB", preco: 99.99 },
];
export const FIXA_BASICA: CatalogItem[] = [
  { pilar: "Fixa Básica", tipo: "1P", produto: "400 MEGA", preco: 79.99 },
  { pilar: "Fixa Básica", tipo: "1P", produto: "500 MEGA", preco: 89.99 },
  { pilar: "Fixa Básica", tipo: "1P", produto: "600 MEGA", preco: 94.99 },
  { pilar: "Fixa Básica", tipo: "1P", produto: "700 MEGA", preco: 99.99 },
  { pilar: "Fixa Básica", tipo: "1P", produto: "1 GIGA", preco: 299.99 },
  { pilar: "Fixa Básica", tipo: "2P", produto: "400 MEGA", preco: 109.99 },
  { pilar: "Fixa Básica", tipo: "2P", produto: "500 MEGA", preco: 119.99 },
  { pilar: "Fixa Básica", tipo: "2P", produto: "600 MEGA", preco: 124.99 },
  { pilar: "Fixa Básica", tipo: "2P", produto: "700 MEGA", preco: 129.99 },
  { pilar: "Fixa Básica", tipo: "2P", produto: "1 GIGA", preco: 329.99 },
];
export const VOZ_SIP: CatalogItem[] = [
  { pilar: "Voz Avançada", tipo: "SIP", produto: "10 canais", preco: 450.00 },
  { pilar: "Voz Avançada", tipo: "SIP", produto: "15 canais", preco: 645.00 },
  { pilar: "Voz Avançada", tipo: "SIP", produto: "30 canais", preco: 1200.00 },
  { pilar: "Voz Avançada", tipo: "SIP", produto: "60 canais", preco: 2159.00 },
  { pilar: "Voz Avançada", tipo: "SIP", produto: "90 canais", preco: 3229.00 },
];
export const VOZ_VVN_24: CatalogItem[] = [
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 24m", produto: "1 a 4 licenças", prazo: "24 meses", preco: 55.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 24m", produto: "5 a 8 licenças", prazo: "24 meses", preco: 50.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 24m", produto: "9 a 20 licenças", prazo: "24 meses", preco: 45.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 24m", produto: "21 a 30 licenças", prazo: "24 meses", preco: 40.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 24m", produto: "31+ licenças", prazo: "24 meses", preco: 35.00 },
];
export const VOZ_VVN_36: CatalogItem[] = [
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 36m", produto: "1 a 4 licenças", prazo: "36 meses", preco: 50.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 36m", produto: "5 a 8 licenças", prazo: "36 meses", preco: 45.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 36m", produto: "9 a 20 licenças", prazo: "36 meses", preco: 40.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 36m", produto: "21 a 30 licenças", prazo: "36 meses", preco: 35.00 },
  { pilar: "Voz Avançada", tipo: "Vivo Voz Negócios 36m", produto: "31+ licenças", prazo: "36 meses", preco: 30.00 },
];
export const VOZ_0800_ILIMITADO: CatalogItem[] = [
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "4 chamadas simultâneas", preco: 479.00 },
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "6 chamadas simultâneas", preco: 699.00 },
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "10 chamadas simultâneas", preco: 909.00 },
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "15 chamadas simultâneas", preco: 1349.00 },
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "30 chamadas simultâneas", preco: 2399.00 },
  { pilar: "Voz Avançada", tipo: "0800 Ilimitado", produto: "60 chamadas simultâneas", preco: 4719.00 },
];
export const DADOS_LINK_SOLO: CatalogItem[] = [
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "50 MEGA", preco: 500.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "100 MEGA", preco: 800.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "200 MEGA", preco: 1000.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "300 MEGA", preco: 1300.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "400 MEGA", preco: 1500.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "500 MEGA", preco: 1900.00 },
  { pilar: "Dados Avançados", tipo: "Link Solo", produto: "700 MEGA", preco: 2200.00 },
];
export const COMBO: CatalogItem[] = [
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "30 Mbps", preco: 820.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "100 Mbps", preco: 1120.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "200 Mbps", preco: 1320.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "300 Mbps", preco: 1620.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "400 Mbps", preco: 1820.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "500 Mbps", preco: 2220.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "700 Mbps", preco: 2520.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 10", produto: "900 Mbps", preco: 3020.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "30/50 Mbps", preco: 920.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "100 Mbps", preco: 1220.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "200 Mbps", preco: 1420.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "300 Mbps", preco: 1720.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "400 Mbps", preco: 1920.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "500 Mbps", preco: 2320.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "700 Mbps", preco: 2620.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 15", produto: "900 Mbps", preco: 3120.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "30/50 Mbps", preco: 1290.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "100 Mbps", preco: 1590.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "200 Mbps", preco: 1790.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "300 Mbps", preco: 2090.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "400 Mbps", preco: 2290.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "500 Mbps", preco: 2690.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "700 Mbps", preco: 2990.00 },
  { pilar: "Combo Dados+Voz", tipo: "Vivo 30", produto: "900 Mbps", preco: 3490.00 }
];
