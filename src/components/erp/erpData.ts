export type DailySale = { day: string; receita: number; ticket: number };
export type Category = { name: string; share: number; color: string };
export type Branch = {
  id: string;
  name: string;
  city: string;
  fatRealizado: number;
  fatMeta: number;
  ticket: number;
  pedidos: number;
  margem: number;
  deltaFat: number;
  deltaTicket: number;
  deltaPedidos: number;
  deltaMargem: number;
  dailySales: DailySale[];
  categories: Category[];
  estoque: { sku: string; nome: string; qtd: number; min: number; status: 'ok' | 'baixo' | 'critico' }[];
  financeiro: { receber: number; pagar: number; saldo: number; conciliado: number };
};

const days = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const d = i + 1;
    return d < 10 ? `0${d}/05` : `${d}/05`;
  });

const wave = (base: number, amp: number, len: number, peak = 0.85) =>
  days(len).map((day, i) => {
    const t = i / (len - 1);
    const trend = base * (1 + 0.18 * t);
    const cycle = Math.sin(t * Math.PI * 4) * amp * 0.45;
    const month_end_kick = i > len * peak ? base * 0.22 * ((i - len * peak) / (len * (1 - peak))) : 0;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * amp * 0.12;
    return { day, receita: Math.round(trend + cycle + month_end_kick + noise), ticket: Math.round(420 + Math.sin(i * 0.6) * 35 + t * 60) };
  });

export const BRANCHES: Branch[] = [
  {
    id: 'consolidado',
    name: 'Consolidado',
    city: 'Todas as filiais',
    fatRealizado: 1247330,
    fatMeta: 1100000,
    ticket: 487,
    pedidos: 2561,
    margem: 34,
    deltaFat: 12.4,
    deltaTicket: 3.1,
    deltaPedidos: 8.7,
    deltaMargem: 0.4,
    dailySales: wave(38000, 9000, 30),
    categories: [
      { name: 'Bebidas', share: 28, color: '#1B3A8A' },
      { name: 'Mercearia', share: 22, color: '#2A4FAE' },
      { name: 'Higiene', share: 15, color: '#C9A028' },
      { name: 'Frios & Laticínios', share: 14, color: '#E0BB3F' },
      { name: 'Hortifruti', share: 12, color: '#5C7CD6' },
      { name: 'Outros', share: 9, color: '#A8B5D9' },
    ],
    estoque: [
      { sku: 'BEB-104', nome: 'Cerveja IPA 600ml', qtd: 1248, min: 400, status: 'ok' },
      { sku: 'MER-022', nome: 'Arroz Tipo 1 5kg', qtd: 312, min: 350, status: 'baixo' },
      { sku: 'HIG-088', nome: 'Sabão líquido 1L', qtd: 76, min: 200, status: 'critico' },
      { sku: 'FRI-201', nome: 'Queijo mussarela kg', qtd: 184, min: 90, status: 'ok' },
      { sku: 'HOR-009', nome: 'Tomate caqui kg', qtd: 47, min: 80, status: 'baixo' },
      { sku: 'BEB-211', nome: 'Vinho tinto seco 750ml', qtd: 412, min: 100, status: 'ok' },
    ],
    financeiro: { receber: 487200, pagar: 312800, saldo: 894500, conciliado: 96 },
  },
  {
    id: 'itaim',
    name: 'Itaim Bibi',
    city: 'São Paulo · SP',
    fatRealizado: 412800,
    fatMeta: 360000,
    ticket: 542,
    pedidos: 762,
    margem: 38,
    deltaFat: 14.7,
    deltaTicket: 4.8,
    deltaPedidos: 9.5,
    deltaMargem: 0.9,
    dailySales: wave(13800, 3400, 30),
    categories: [
      { name: 'Bebidas Premium', share: 34, color: '#1B3A8A' },
      { name: 'Mercearia Fina', share: 24, color: '#2A4FAE' },
      { name: 'Hortifruti Orgânico', share: 16, color: '#C9A028' },
      { name: 'Frios Importados', share: 14, color: '#E0BB3F' },
      { name: 'Higiene', share: 7, color: '#5C7CD6' },
      { name: 'Outros', share: 5, color: '#A8B5D9' },
    ],
    estoque: [
      { sku: 'BEB-301', nome: 'Champagne Brut 750ml', qtd: 86, min: 30, status: 'ok' },
      { sku: 'FRI-401', nome: 'Parmesão Reggiano kg', qtd: 22, min: 40, status: 'baixo' },
      { sku: 'MER-507', nome: 'Azeite extravirgem 500ml', qtd: 142, min: 60, status: 'ok' },
      { sku: 'HOR-022', nome: 'Rúcula orgânica un', qtd: 18, min: 60, status: 'critico' },
    ],
    financeiro: { receber: 158400, pagar: 92300, saldo: 312700, conciliado: 99 },
  },
  {
    id: 'pinheiros',
    name: 'Pinheiros',
    city: 'São Paulo · SP',
    fatRealizado: 318900,
    fatMeta: 290000,
    ticket: 478,
    pedidos: 668,
    margem: 33,
    deltaFat: 9.9,
    deltaTicket: 2.4,
    deltaPedidos: 7.3,
    deltaMargem: -0.2,
    dailySales: wave(10600, 2700, 30),
    categories: [
      { name: 'Bebidas', share: 30, color: '#1B3A8A' },
      { name: 'Mercearia', share: 25, color: '#2A4FAE' },
      { name: 'Higiene', share: 16, color: '#C9A028' },
      { name: 'Frios', share: 13, color: '#E0BB3F' },
      { name: 'Hortifruti', share: 10, color: '#5C7CD6' },
      { name: 'Outros', share: 6, color: '#A8B5D9' },
    ],
    estoque: [
      { sku: 'BEB-104', nome: 'Cerveja IPA 600ml', qtd: 412, min: 150, status: 'ok' },
      { sku: 'MER-022', nome: 'Arroz Tipo 1 5kg', qtd: 88, min: 120, status: 'baixo' },
      { sku: 'HIG-088', nome: 'Sabão líquido 1L', qtd: 24, min: 60, status: 'critico' },
    ],
    financeiro: { receber: 124600, pagar: 81200, saldo: 218300, conciliado: 95 },
  },
  {
    id: 'vila-olimpia',
    name: 'Vila Olímpia',
    city: 'São Paulo · SP',
    fatRealizado: 289430,
    fatMeta: 260000,
    ticket: 461,
    pedidos: 628,
    margem: 32,
    deltaFat: 11.3,
    deltaTicket: 2.8,
    deltaPedidos: 8.4,
    deltaMargem: 0.6,
    dailySales: wave(9650, 2400, 30),
    categories: [
      { name: 'Bebidas', share: 27, color: '#1B3A8A' },
      { name: 'Mercearia', share: 22, color: '#2A4FAE' },
      { name: 'Higiene', share: 17, color: '#C9A028' },
      { name: 'Frios', share: 14, color: '#E0BB3F' },
      { name: 'Hortifruti', share: 12, color: '#5C7CD6' },
      { name: 'Outros', share: 8, color: '#A8B5D9' },
    ],
    estoque: [
      { sku: 'BEB-104', nome: 'Cerveja IPA 600ml', qtd: 392, min: 130, status: 'ok' },
      { sku: 'FRI-201', nome: 'Queijo mussarela kg', qtd: 64, min: 50, status: 'ok' },
      { sku: 'HOR-009', nome: 'Tomate caqui kg', qtd: 12, min: 30, status: 'critico' },
    ],
    financeiro: { receber: 109800, pagar: 73400, saldo: 187200, conciliado: 97 },
  },
  {
    id: 'consolacao',
    name: 'Consolação',
    city: 'São Paulo · SP',
    fatRealizado: 226200,
    fatMeta: 220000,
    ticket: 432,
    pedidos: 503,
    margem: 30,
    deltaFat: 4.2,
    deltaTicket: 1.7,
    deltaPedidos: 5.1,
    deltaMargem: -0.8,
    dailySales: wave(7540, 2000, 30),
    categories: [
      { name: 'Bebidas', share: 26, color: '#1B3A8A' },
      { name: 'Mercearia', share: 24, color: '#2A4FAE' },
      { name: 'Higiene', share: 18, color: '#C9A028' },
      { name: 'Frios', share: 14, color: '#E0BB3F' },
      { name: 'Hortifruti', share: 11, color: '#5C7CD6' },
      { name: 'Outros', share: 7, color: '#A8B5D9' },
    ],
    estoque: [
      { sku: 'BEB-211', nome: 'Vinho tinto seco 750ml', qtd: 178, min: 60, status: 'ok' },
      { sku: 'MER-507', nome: 'Azeite extravirgem 500ml', qtd: 38, min: 50, status: 'baixo' },
      { sku: 'HIG-088', nome: 'Sabão líquido 1L', qtd: 14, min: 50, status: 'critico' },
    ],
    financeiro: { receber: 94400, pagar: 65900, saldo: 176300, conciliado: 94 },
  },
];

export const SPARKLINE_FAT = [22, 26, 24, 28, 31, 29, 34, 36, 33, 38, 41, 39];
export const SPARKLINE_TICKET = [12, 14, 13, 15, 14, 16, 17, 16, 18, 17, 19, 18];
export const SPARKLINE_PEDIDOS = [18, 22, 20, 24, 23, 26, 28, 27, 29, 31, 30, 33];
export const SPARKLINE_MARGEM = [30, 31, 32, 31, 33, 32, 33, 34, 33, 34, 35, 34];

export function brl(v: number) {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function brlCompact(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return brl(v);
}
