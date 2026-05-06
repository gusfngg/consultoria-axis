import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  ArrowDownRight, ArrowUpRight, Boxes, ChevronDown,
  CircleDollarSign, LineChart as LineChartIcon, Package,
} from 'lucide-react';
import { BRANCHES, brl, brlCompact, type Branch } from './erpData';
import { GOLD, NAVY, NAVY_DEEP, EASE } from '@/lib/tokens';
import { Counter } from '@/components/primitives/MotionPrimitives';

type TabKey = 'metricas' | 'vendas' | 'estoque' | 'financeiro';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'metricas', label: 'Métricas', icon: <LineChartIcon className="w-3.5 h-3.5" /> },
  { key: 'vendas', label: 'Vendas', icon: <CircleDollarSign className="w-3.5 h-3.5" /> },
  { key: 'estoque', label: 'Estoque', icon: <Boxes className="w-3.5 h-3.5" /> },
  { key: 'financeiro', label: 'Financeiro', icon: <Package className="w-3.5 h-3.5" /> },
];

function Sparkline({ data, color = GOLD, className = '' }: { data: number[]; color?: string; className?: string }) {
  const series = data.map((v, i) => ({ i, v }));
  const id = `sl-${color.replace('#', '')}`;
  return (
    <div className={`h-7 w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area dataKey="v" type="monotone" stroke={color} strokeWidth={1.5} fill={`url(#${id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium ${
        positive ? 'text-emerald-600' : 'text-rose-600'
      }`}
    >
      {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {positive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}

function KpiCard({
  label, value, format, delta, sparkline, sparkColor, prefix,
}: {
  label: string;
  value: number;
  format: 'BRL' | 'INT' | 'PCT';
  delta: number;
  sparkline: number[];
  sparkColor: string;
  prefix?: string;
}) {
  const formatter = (v: number) => {
    if (format === 'BRL') return brl(v).replace('R$', '').trim();
    if (format === 'PCT') return `${Math.round(v)}%`;
    return Math.round(v).toLocaleString('pt-BR');
  };
  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-foreground/8 rounded-xl">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono uppercase tracking-widest text-[9px] text-foreground/45 leading-tight">
          {label}
        </span>
        <Delta value={delta} />
      </div>
      <div className="flex items-baseline gap-1 font-display tracking-tight" style={{ color: NAVY_DEEP }}>
        {prefix && <span className="text-xs font-mono font-medium text-foreground/45">{prefix}</span>}
        <span className="text-xl md:text-2xl font-bold tabular-nums">
          <Counter to={value} duration={1.4} format={formatter} />
        </span>
      </div>
      <Sparkline data={sparkline} color={sparkColor} />
    </div>
  );
}

function ChartTooltip({ active, payload, label, suffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur border border-foreground/10 px-3 py-2 rounded-lg shadow-lg text-xs">
      <div className="font-mono uppercase tracking-widest text-[9px] text-foreground/45 mb-0.5">{label}</div>
      <div className="font-bold tabular-nums" style={{ color: NAVY_DEEP }}>
        {typeof payload[0].value === 'number' && payload[0].value > 1000
          ? brlCompact(payload[0].value)
          : payload[0].value}
        {suffix}
      </div>
    </div>
  );
}

function MetricasPanel({ branch }: { branch: Branch }) {
  return (
    <motion.div
      key={branch.id + '-m'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Faturamento" value={branch.fatRealizado} format="BRL" delta={branch.deltaFat} sparkline={[22,26,24,28,31,29,34,36,33,38,41,39]} sparkColor={NAVY} prefix="R$" />
        <KpiCard label="Ticket Médio" value={branch.ticket} format="BRL" delta={branch.deltaTicket} sparkline={[12,14,13,15,14,16,17,16,18,17,19,18]} sparkColor={GOLD} prefix="R$" />
        <KpiCard label="Pedidos" value={branch.pedidos} format="INT" delta={branch.deltaPedidos} sparkline={[18,22,20,24,23,26,28,27,29,31,30,33]} sparkColor={NAVY} />
        <KpiCard label="Margem" value={branch.margem} format="PCT" delta={branch.deltaMargem} sparkline={[30,31,32,31,33,32,33,34,33,34,35,34]} sparkColor={GOLD} />
      </div>

      <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45">
              Receita — últimos 30 dias
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ color: NAVY_DEEP }}>
              {brlCompact(branch.fatRealizado)} <span className="text-foreground/40 font-normal">de meta {brlCompact(branch.fatMeta)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: NAVY }} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/55">Receita</span>
          </div>
        </div>
        <div className="h-44 md:h-52 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={branch.dailySales}>
              <defs>
                <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NAVY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: NAVY, strokeOpacity: 0.15, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="receita" stroke={NAVY} strokeWidth={2} fill="url(#receita)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
          <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45 mb-3">
            Categorias — share %
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={branch.categories} dataKey="share" innerRadius={32} outerRadius={52} paddingAngle={2} stroke="white" strokeWidth={2}>
                    {branch.categories.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-1.5 text-xs">
              {branch.categories.slice(0, 5).map((c) => (
                <li key={c.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-foreground/70">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-mono tabular-nums font-medium" style={{ color: NAVY_DEEP }}>
                    {c.share}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
          <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45 mb-3">
            Filiais — realizado vs meta
          </div>
          <ul className="space-y-2.5">
            {BRANCHES.filter((b) => b.id !== 'consolidado').map((b) => {
              const pct = Math.round((b.fatRealizado / b.fatMeta) * 100);
              const reached = pct >= 100;
              return (
                <li key={b.id}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-foreground/75 font-medium">{b.name}</span>
                    <span className="font-mono tabular-nums text-foreground/55">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: reached ? GOLD : NAVY }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.9, ease: EASE }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function VendasPanel({ branch }: { branch: Branch }) {
  return (
    <motion.div
      key={branch.id + '-v'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
        <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45 mb-3">
          Vendas diárias · receita por dia
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branch.dailySales}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(27,58,138,0.06)' }} />
              <Bar dataKey="receita" fill={NAVY} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
          <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45 mb-3">
            Ticket médio · evolução
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={branch.dailySales}>
                <defs>
                  <linearGradient id="ticket-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<ChartTooltip suffix=" ticket" />} cursor={false} />
                <Area type="monotone" dataKey="ticket" stroke={GOLD} strokeWidth={2} fill="url(#ticket-g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-foreground/8 mt-3">
            <span className="font-mono uppercase tracking-widest text-[10px] text-foreground/45">Hoje</span>
            <span className="font-display font-bold tabular-nums" style={{ color: NAVY_DEEP }}>
              {brl(branch.ticket)}
            </span>
          </div>
        </div>
        <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
          <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45 mb-3">
            Mix por categoria
          </div>
          <ul className="space-y-2.5">
            {branch.categories.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-foreground/75 font-medium">{c.name}</span>
                  <span className="font-mono tabular-nums text-foreground/55">{c.share}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: c.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${c.share * 2.5}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function EstoquePanel({ branch }: { branch: Branch }) {
  const counts = {
    ok: branch.estoque.filter((e) => e.status === 'ok').length,
    baixo: branch.estoque.filter((e) => e.status === 'baixo').length,
    critico: branch.estoque.filter((e) => e.status === 'critico').length,
  };
  return (
    <motion.div
      key={branch.id + '-e'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[10px] text-emerald-700/70">Em estoque</div>
          <div className="text-2xl font-display font-bold text-emerald-700 tabular-nums mt-1">{counts.ok}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[10px] text-amber-700/70">Estoque baixo</div>
          <div className="text-2xl font-display font-bold text-amber-700 tabular-nums mt-1">{counts.baixo}</div>
        </div>
        <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[10px] text-rose-700/70">Crítico</div>
          <div className="text-2xl font-display font-bold text-rose-700 tabular-nums mt-1">{counts.critico}</div>
        </div>
      </div>
      <div className="bg-white border border-foreground/8 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-foreground/8 flex items-center justify-between">
          <span className="font-mono uppercase tracking-widest text-[10px] text-foreground/45">SKUs monitorados</span>
          <span className="font-mono uppercase tracking-widest text-[10px] text-foreground/35">{branch.estoque.length} itens</span>
        </div>
        <div className="divide-y divide-foreground/6">
          {branch.estoque.map((item) => {
            const ratio = item.qtd / item.min;
            const statusColor =
              item.status === 'critico' ? 'text-rose-600 bg-rose-50' :
              item.status === 'baixo' ? 'text-amber-700 bg-amber-50' :
              'text-emerald-700 bg-emerald-50';
            const barColor =
              item.status === 'critico' ? '#e11d48' :
              item.status === 'baixo' ? '#d97706' :
              '#059669';
            return (
              <div key={item.sku + item.nome} className="px-4 py-3 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 w-16 shrink-0">{item.sku}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: NAVY_DEEP }}>{item.nome}</div>
                  <div className="h-1 rounded-full bg-foreground/[0.06] mt-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(ratio * 50, 100)}%` }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono tabular-nums text-sm font-medium" style={{ color: NAVY_DEEP }}>
                    {item.qtd.toLocaleString('pt-BR')}
                  </div>
                  <div className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest ${statusColor}`}>
                    {item.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function FinanceiroPanel({ branch }: { branch: Branch }) {
  const f = branch.financeiro;
  const lineData = branch.dailySales.map((d, i) => ({
    day: d.day,
    saldo: Math.round(f.saldo * 0.7 + i * (f.saldo * 0.012) + Math.sin(i * 0.7) * f.saldo * 0.04),
  }));
  return (
    <motion.div
      key={branch.id + '-f'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-foreground/8 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[9px] text-foreground/45">A receber</div>
          <div className="text-lg md:text-xl font-display font-bold mt-1 tabular-nums" style={{ color: NAVY_DEEP }}>
            {brlCompact(f.receber)}
          </div>
        </div>
        <div className="bg-white border border-foreground/8 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[9px] text-foreground/45">A pagar</div>
          <div className="text-lg md:text-xl font-display font-bold mt-1 tabular-nums" style={{ color: NAVY_DEEP }}>
            {brlCompact(f.pagar)}
          </div>
        </div>
        <div className="bg-white border border-foreground/8 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[9px] text-foreground/45">Saldo em caixa</div>
          <div className="text-lg md:text-xl font-display font-bold mt-1 tabular-nums" style={{ color: NAVY_DEEP }}>
            {brlCompact(f.saldo)}
          </div>
        </div>
        <div className="bg-white border border-foreground/8 rounded-xl p-4">
          <div className="font-mono uppercase tracking-widest text-[9px] text-foreground/45">Conciliado</div>
          <div className="text-lg md:text-xl font-display font-bold mt-1 tabular-nums flex items-baseline gap-1" style={{ color: NAVY_DEEP }}>
            {f.conciliado}<span className="text-sm">%</span>
          </div>
        </div>
      </div>
      <div className="bg-white border border-foreground/8 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono uppercase tracking-widest text-[10px] text-foreground/45">
            Saldo · projeção mensal
          </div>
          <span className="font-mono uppercase tracking-widest text-[10px] text-emerald-700">Saudável</span>
        </div>
        <div className="h-40 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="saldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#7a8499' }} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#059669', strokeOpacity: 0.2 }} />
              <Area type="monotone" dataKey="saldo" stroke="#059669" strokeWidth={2} fill="url(#saldo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export function ErpMockup() {
  const [tab, setTab] = useState<TabKey>('metricas');
  const [branchId, setBranchId] = useState<string>('consolidado');
  const [branchOpen, setBranchOpen] = useState(false);
  const branch = useMemo(() => BRANCHES.find((b) => b.id === branchId)!, [branchId]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setBranchOpen(false);
    };
    if (branchOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [branchOpen]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-[#fafbfd]"
      style={{ boxShadow: '0 30px 80px -20px rgba(27,58,138,0.25)' }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-foreground/8 bg-white">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 min-w-0 h-6 rounded-md bg-foreground/[0.04] flex items-center px-3 gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-mono text-[10px] text-foreground/55 truncate">app.axiserp.com.br/dashboard</span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/45">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          live
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-b border-foreground/8 bg-white">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`relative flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md text-[11px] md:text-xs font-medium uppercase tracking-widest font-mono whitespace-nowrap transition-colors ${
                  active ? 'text-white' : 'text-foreground/50 hover:text-foreground/80'
                }`}
                style={active ? { background: NAVY_DEEP } : undefined}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            onClick={() => setBranchOpen((v) => !v)}
            className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-md border border-foreground/10 bg-white hover:border-foreground/25 transition-colors text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="font-medium" style={{ color: NAVY_DEEP }}>{branch.name}</span>
            <ChevronDown className={`w-3 h-3 text-foreground/45 transition-transform ${branchOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {branchOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-foreground/10 rounded-lg shadow-xl overflow-hidden z-20"
              >
                {BRANCHES.map((b) => {
                  const sel = b.id === branchId;
                  return (
                    <li key={b.id}>
                      <button
                        onClick={() => {
                          setBranchId(b.id);
                          setBranchOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between gap-3 hover:bg-foreground/[0.03] transition-colors ${sel ? 'bg-foreground/[0.02]' : ''}`}
                      >
                        <div>
                          <div className="text-xs font-medium" style={{ color: NAVY_DEEP }}>{b.name}</div>
                          <div className="font-mono text-[9px] uppercase tracking-widest text-foreground/40">{b.city}</div>
                        </div>
                        {sel && <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <AnimatePresence mode="wait">
          {tab === 'metricas' && <MetricasPanel branch={branch} />}
          {tab === 'vendas' && <VendasPanel branch={branch} />}
          {tab === 'estoque' && <EstoquePanel branch={branch} />}
          {tab === 'financeiro' && <FinanceiroPanel branch={branch} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ErpMiniLive() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const data = [22, 26, 24, 28, 31, 29, 34, 36, 33, 38, 41, 39].map((v, i) => ({ i, v }));
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
      className="relative w-full max-w-[360px] rounded-2xl overflow-hidden bg-white/[0.06] backdrop-blur-md border border-white/15"
      style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5)' }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
          <span className="font-mono uppercase tracking-widest text-[10px] text-white/70">Axis ERP · Live</span>
        </div>
        <span className="font-mono text-[10px] text-white/40">v2.6</span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="font-mono uppercase tracking-widest text-[9px] text-white/45">Faturamento hoje</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-display text-2xl font-bold text-white tabular-nums">
              <Counter to={1247330} duration={2} format={(v) => brlCompact(v)} />
            </span>
            <span className="font-mono text-[11px] text-emerald-400">+12.4%</span>
          </div>
        </div>
        <div className="h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={GOLD} strokeWidth={1.8} fill="url(#hero-spark)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
          <div>
            <div className="font-mono uppercase tracking-widest text-[8px] text-white/40">Filiais</div>
            <div className="font-display text-sm font-bold text-white tabular-nums mt-0.5">5</div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest text-[8px] text-white/40">Pedidos</div>
            <div className="font-display text-sm font-bold text-white tabular-nums mt-0.5">2.561</div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest text-[8px] text-white/40">Margem</div>
            <div className="font-display text-sm font-bold text-white tabular-nums mt-0.5">34%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
