import React, { useEffect, useState } from 'react';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring,
} from 'framer-motion';
import {
  ArrowRight, BarChart3, ShieldCheck,
  ChevronRight, Mail, MapPin, Building2, Network,
  Anchor, ChevronDown, Menu, X, TrendingUp,
  Boxes, Cpu, GitBranch, Layers, LineChart, Sparkles,
  MessageCircle,
} from 'lucide-react';
import { NAVY, NAVY_DEEP, GOLD, GOLD_LIGHT, EASE, VERSION } from '@/lib/tokens';
import {
  usePrefersReducedMotion, useLenis,
  Counter, Reveal, StaggerGrid, AnimatedHeading,
  staggerChild,
} from '@/components/primitives/MotionPrimitives';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { SectionCoord } from '@/components/primitives/SectionCoord';
import { HairlineRule } from '@/components/primitives/HairlineRule';
import { ErpMockup, ErpMiniLive } from '@/components/erp/ErpMockup';

function GridBlueprint({ density = 80, opacity = 0.055 }: { density?: number; opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${density}px ${density}px`,
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 25%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 25%, transparent 100%)',
      }}
    />
  );
}

function GridDots() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
        maskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 15%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 15%, transparent 85%)',
      }}
    />
  );
}

function GridLightDots() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(27,58,138,0.08) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 90%)',
      }}
    />
  );
}

function NavLink({ href, children, light }: { href: string; children: string; light: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      className={`relative text-[11px] font-mono font-medium tracking-[0.18em] uppercase transition-colors duration-200 pb-0.5 ${
        light ? 'text-foreground/65 hover:text-primary' : 'text-white/65 hover:text-white'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.span
        className="absolute left-0 bottom-0 h-[1.5px] rounded-full"
        style={{ background: GOLD }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </a>
  );
}

function Accordion({ index, q, a }: { index: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-rule last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex items-start gap-5 text-left focus-visible:outline-none group"
      >
        <MonoLabel className="text-foreground/35 pt-1 shrink-0 w-12">{index}</MonoLabel>
        <span className="flex-1 text-base md:text-lg font-display font-semibold tracking-tight group-hover:text-primary transition-colors leading-snug">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="shrink-0 mt-1.5 relative w-3.5 h-3.5"
        >
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full" style={{ background: GOLD }} />
          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full" style={{ background: GOLD }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-[68px] pr-8 pb-6">
              <p className="text-foreground/65 leading-relaxed text-sm md:text-base">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FormState = { name: string; email: string; role: string; message: string };
const INITIAL_FORM: FormState = { name: '', email: '', role: '', message: '' };

const WHATSAPP_NUMBER = '5515991025885';

function ContactForm() {
  const [data, setData] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const [error, setError] = useState('');

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!data.name.trim() || !data.message.trim()) {
      setError('Preencha seu nome e o desafio atual.');
      return;
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('Informe um e-mail válido (ou deixe em branco).');
      return;
    }
    const lines = [
      'Olá, Axis! Gostaria de solicitar um diagnóstico.',
      '',
      `Nome: ${data.name.trim()}`,
      data.email.trim() && `E-mail: ${data.email.trim()}`,
      data.role.trim() && `Cargo: ${data.role.trim()}`,
      '',
      'Maior desafio hoje:',
      data.message.trim(),
    ].filter(Boolean) as string[];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setStatus('sent');
  };

  const sent = status === 'sent';

  return (
    <form
      className="relative rounded-2xl p-7 md:p-10 space-y-4 text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}
      onSubmit={onSubmit}
      noValidate
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 32px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      />
      <div className="relative z-10 space-y-4">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight">Solicitar diagnóstico</h3>
          <MonoLabel className="text-white/35">Form-01</MonoLabel>
        </div>

        <div>
          <label htmlFor="cf-name" className="block font-mono text-[10px] text-white/45 mb-1.5 uppercase tracking-widest">Nome completo</label>
          <input
            id="cf-name" name="name" type="text" required autoComplete="name" placeholder="João Silva"
            value={data.name} onChange={update('name')}
            className="w-full bg-white/8 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/55 transition-colors placeholder-white/25"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cf-email" className="block font-mono text-[10px] text-white/45 mb-1.5 uppercase tracking-widest">E-mail (opcional)</label>
            <input
              id="cf-email" name="email" type="email" autoComplete="email" placeholder="joao@empresa.com"
              value={data.email} onChange={update('email')}
              className="w-full bg-white/8 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/55 transition-colors placeholder-white/25"
            />
          </div>
          <div>
            <label htmlFor="cf-role" className="block font-mono text-[10px] text-white/45 mb-1.5 uppercase tracking-widest">Cargo</label>
            <input
              id="cf-role" name="role" type="text" autoComplete="organization-title" placeholder="CEO / Diretor"
              value={data.role} onChange={update('role')}
              className="w-full bg-white/8 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/55 transition-colors placeholder-white/25"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cf-message" className="block font-mono text-[10px] text-white/45 mb-1.5 uppercase tracking-widest">Maior desafio hoje</label>
          <textarea
            id="cf-message" name="message" required rows={3} placeholder="Descreva brevemente..."
            value={data.message} onChange={update('message')}
            className="w-full bg-white/8 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/55 transition-colors resize-none placeholder-white/25"
          />
        </div>

        {error && <p role="alert" className="text-sm" style={{ color: '#ffb4b4' }}>{error}</p>}
        {sent && (
          <p role="status" className="text-sm" style={{ color: GOLD }}>
            Abrimos o WhatsApp em uma nova aba. Se não abriu, verifique o bloqueador de pop-ups.
          </p>
        )}

        <motion.button
          type="submit"
          className="w-full font-bold py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2 font-mono"
          style={{ background: GOLD, color: NAVY_DEEP }}
          whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
          whileTap={{ scale: 0.97 }}
        >
          <MessageCircle className="w-4 h-4" />
          Entrar em contato
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
}

export default function Home() {
  const reduced = usePrefersReducedMotion();
  useLenis(reduced);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const heroY = useTransform(scrollYProgress, [0, 0.4], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const NAV_ITEMS = ['Dual Axis', 'Método', 'ERP', 'Resultados', 'FAQ', 'Contato'];
  const NAV_IDS   = ['dual-axis', 'method', 'erp', 'cases', 'faq', 'contact'];

  const services = [
    { icon: <Anchor className="w-5 h-5" style={{ color: GOLD }} />, title: 'Reestruturação operacional', tag: 'OPS-01', desc: 'Redesenhamos fluxos para eliminar redundâncias e elevar margem.' },
    { icon: <Network className="w-5 h-5" style={{ color: GOLD }} />, title: 'Otimização de receita', tag: 'REV-02', desc: 'Pricing, máquina de vendas e canais B2B destravados.' },
    { icon: <Building2 className="w-5 h-5" style={{ color: GOLD }} />, title: 'Advisory M&A', tag: 'MAA-03', desc: 'Captação, fusão e valuation com due diligence antecipada.' },
    { icon: <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />, title: 'Transformação digital', tag: 'DTX-04', desc: 'Sistemas e processos digitais sem disrupção do dia a dia.' },
  ];

  const steps = [
    { n: '01', title: 'Imersão & Auditoria', deliverable: 'Mapa de DRE + diagnóstico', desc: 'Mapeamento de DRE, fluxo de caixa, processos vitais e cultura organizacional.' },
    { n: '02', title: 'Desenho da Arquitetura', deliverable: 'Plano tático 90 dias', desc: 'Plano com redesenho estrutural focado em eficiência e maximização de margem.' },
    { n: '03', title: 'Choque de Gestão', deliverable: 'ERP rodando + KPIs', desc: 'Implementação assistida in loco com seus gestores. Sistema entra no ar.' },
    { n: '04', title: 'Tração & Escala', deliverable: 'Cultura de performance', desc: 'Monitoramento de KPIs, ajustes finos e consolidação da máquina.' },
  ];

  const faqs = [
    { q: 'Minha empresa é pequena. A Axis atende mesmo?', a: 'Atendemos empresas que já têm operação rodando e sentem que perderam o controle do que acontece dentro dela. Tamanho importa menos do que a disposição de mudar — se você não sabe ao certo para onde o dinheiro está indo, já temos trabalho a fazer.' },
    { q: 'Preciso contratar o ERP ou a consultoria pode vir sozinha?', a: 'As duas opções existem. A consultoria pode vir sem o ERP, e o ERP pode ser implantado de forma independente. Mas a maioria dos nossos clientes opta pelo conjunto, porque é aí que a mudança realmente se sustenta: a estratégia não some quando o consultor sai.' },
    { q: 'Quanto tempo até eu começar a ver resultado?', a: 'Depende do ponto de partida, mas em geral as primeiras clarezas — onde está o gargalo, onde o dinheiro some, o que está fora do controle — aparecem nas primeiras semanas do diagnóstico. Resultado financeiro tangível costuma vir entre 60 e 120 dias de projeto.' },
    { q: 'Não tenho tempo para acompanhar um projeto de consultoria. E agora?', a: 'Entendemos — falta de tempo é exatamente o sintoma que mais ouvimos. Por isso nossa equipe trabalha junto com a sua, sem depender de você para cada decisão. O objetivo é tirar peso dos seus ombros, não adicionar reuniões.' },
    { q: 'Vocês entregam apresentação ou trabalham na operação mesmo?', a: 'Trabalhamos na operação. Nosso time entra junto com o seu para mapear, estruturar e implantar — e sai quando os processos estão rodando sozinhos. Não existe entrega de PowerPoint e tchau.' },
    { q: 'Como funciona o diagnóstico inicial?', a: 'É a primeira etapa de todo projeto. Mapeamos sua operação, finanças e rotina de gestão para identificar onde estão as perdas e os gargalos reais. A partir daí, apresentamos um plano com prioridades claras. Entre em contato e marcamos uma conversa sem compromisso.' },
  ];

  const industries = ['Indústria', 'Varejo', 'SaaS B2B', 'Distribuição', 'Saúde', 'Logística'];

  const cases = [
    {
      sector: 'Indústria de Manufatura', tag: 'CASE-01',
      title: 'Corte de R$ 150mil em despesas sem perda de capacidade.',
      desc: 'Reestruturação da cadeia de suprimentos e renegociação de contratos em 4 meses.',
      before: { label: 'Custo OP', value: 'R$ 1.2M / mês', width: '88%' },
      after: { label: 'Custo OP', value: 'R$ 720k / mês', width: '52%' },
      metric: '-42%', metricLabel: 'Custo de Operação',
      duration: '4 meses',
    },
    {
      sector: 'SaaS B2B Enterprise', tag: 'CASE-02',
      title: 'Aumento de 215% no ARR reestruturando o comissionamento.',
      desc: 'Nova política de pricing e tiers enterprise que destravaram contas paradas.',
      before: { label: 'ARR', value: 'R$ 4.8M', width: '32%' },
      after: { label: 'ARR', value: 'R$ 15.1M', width: '94%' },
      metric: '+215%', metricLabel: 'Receita Anual (ARR)',
      duration: '6 meses',
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{ scaleX, background: `linear-gradient(90deg, ${NAVY}, ${GOLD})` }}
      />

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,padding] duration-400 ease-out ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-[0_1px_20px_rgba(0,0,0,0.05)]' : ''
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={`container mx-auto px-5 md:px-10 flex items-center justify-between transition-[padding] duration-300 ${scrolled ? 'py-3' : 'py-4 md:py-5'}`}>
          <div className="flex items-baseline gap-3">
            <a href="#" className={`text-xl md:text-2xl font-display font-bold tracking-tighter uppercase transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}>
              Axis<span style={{ color: GOLD }}>.</span>
            </a>
            <MonoLabel className={scrolled ? 'text-foreground/35' : 'text-white/45'}>{VERSION}</MonoLabel>
          </div>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((label, i) => (
              <NavLink key={label} href={`#${NAV_IDS[i]}`} light={scrolled}>{label}</NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 font-mono"
              style={{ background: GOLD, color: NAVY_DEEP }}
              whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
              whileTap={{ scale: 0.96 }}
            >
              Diagnóstico <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>

          <motion.button
            className={`lg:hidden p-1 rounded-lg transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}
            onClick={() => setMenuOpen(v => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.span>
                : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6" /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="lg:hidden overflow-hidden bg-white border-t border-rule"
            >
              <motion.div
                className="px-5 py-5 space-y-1"
                initial="hidden" animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
              >
                {NAV_ITEMS.map((label, i) => (
                  <motion.a
                    key={label}
                    href={`#${NAV_IDS[i]}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-foreground/70 font-mono text-xs uppercase tracking-[0.18em] hover:text-primary border-b border-rule last:border-0 transition-colors"
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                    {label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 mt-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest font-mono"
                  style={{ background: GOLD, color: NAVY_DEEP }}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  Diagnóstico <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section
        className="relative min-h-[100dvh] flex items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
        style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, #0a1835 100%)` }}
      >
        <GridBlueprint />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          {!reduced && [{ size: 700, pos: '-right-40', border: 2, dur: 80 }, { size: 460, pos: 'right-10', border: 1, dur: 55 }].map((r, i) => (
            <motion.div
              key={i}
              className={`absolute top-1/3 ${r.pos} rounded-full opacity-[0.08] pointer-events-none`}
              style={{ width: r.size, height: r.size, border: `${r.border}px solid ${GOLD}`, willChange: 'transform' }}
              animate={{ rotate: i === 0 ? 360 : -360 }}
              transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 container mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                className="inline-flex items-center gap-2 border border-white/15 bg-white/8 backdrop-blur-sm px-3 py-1.5 mb-7 rounded-full"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 font-medium">
                  Consultoria estratégica + ERP proprietário
                </span>
              </motion.div>

              <h1 className="mb-7 md:mb-9 m-0">
                <span className="sr-only">Axis Consulting — Engenharia de Negócios com Sistema</span>
                {['ENGENHARIA', 'DE NEGÓCIOS', 'COM SISTEMA'].map((line, li) => (
                  <motion.span
                    key={li}
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + li * 0.13, ease: EASE }}
                    className="font-display font-bold tracking-[-0.04em] leading-[0.92] block"
                    style={{
                      fontSize: 'clamp(2.2rem, 7.5vw, 6.5rem)',
                      color: li === 2 ? 'transparent' : 'white',
                      backgroundImage: li === 2 ? `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)` : undefined,
                      WebkitBackgroundClip: li === 2 ? 'text' : undefined,
                      backgroundClip: li === 2 ? 'text' : undefined,
                    }}
                  >
                    {line}
                    {li === 2 && <span className="text-white">.</span>}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="text-base md:text-lg text-white/65 font-light leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
              >
                Consultoria estratégica + ERP proprietário. Não saímos quando o projeto acaba — <span className="text-white">deixamos o sistema rodando</span>.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.78 }}
              >
                <motion.a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-widest rounded-xl text-xs uppercase font-mono"
                  style={{ background: GOLD, color: NAVY_DEEP }}
                  whileHover={{ scale: 1.03, filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.96 }}
                >
                  Agendar diagnóstico <ArrowRight className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="#erp"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-widest rounded-xl text-xs uppercase border border-white/25 text-white font-mono"
                  whileHover={{ borderColor: 'rgba(255,255,255,0.6)', scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Ver ERP ao vivo
                </motion.a>
              </motion.div>

              <motion.div
                className="flex items-center gap-6 flex-wrap"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}
              >
                <div>
                  <MonoLabel className="text-white/35 block mb-1">Receita recuperada</MonoLabel>
                  <span className="font-display font-bold text-white text-2xl tabular-nums">
                    R$ <Counter to={1200} duration={2.4} />k
                  </span>
                </div>
                <span className="w-px h-10 bg-white/15" />
                <div>
                  <MonoLabel className="text-white/35 block mb-1">Operações</MonoLabel>
                  <span className="font-display font-bold text-white text-2xl tabular-nums">
                    +<Counter to={150} duration={2.4} />
                  </span>
                </div>
                <span className="w-px h-10 bg-white/15 hidden sm:block" />
                <div className="hidden sm:block">
                  <MonoLabel className="text-white/35 block mb-1">ROI médio</MonoLabel>
                  <span className="font-display font-bold text-white text-2xl tabular-nums">
                    <Counter to={90} duration={2.4} /> <span className="text-base text-white/65">dias</span>
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <ErpMiniLive />
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          animate={reduced ? undefined : { y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* TRUST BAR */}
      <section className="relative py-12 md:py-16 bg-white border-y border-rule">
        <div className="container mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
            <div className="flex items-center gap-5">
              <MonoLabel className="text-foreground/40">Indústrias atendidas</MonoLabel>
              <HairlineRule className="hidden md:block flex-1 max-w-12" />
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {industries.map((ind, i) => (
                <Reveal key={ind} variant="fadeUp" custom={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ background: GOLD }} />
                  <span className="font-display font-medium tracking-tight text-base md:text-lg" style={{ color: NAVY_DEEP }}>
                    {ind}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUAL AXIS */}
      <section id="dual-axis" className="relative py-20 md:py-28 bg-paper overflow-hidden">
        <GridLightDots />
        <div className="container mx-auto px-5 md:px-10 relative">
          <SectionCoord index="02" label="Dual Axis" right="Two axes · One OS" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
            <div className="lg:col-span-5">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.95]"
                style={{ color: NAVY_DEEP, fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              >
                A maioria entrega PowerPoint.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-7 lg:pt-3 flex flex-col lg:items-end lg:text-right">
              <Reveal variant="fadeUp" custom={1}>
                <p className="font-display font-medium text-2xl md:text-3xl leading-snug tracking-tight" style={{ color: NAVY_DEEP }}>
                  Nós deixamos um <span className="font-bold" style={{ color: NAVY }}>sistema rodando</span>.
                </p>
                <p className="mt-5 text-foreground/65 leading-relaxed text-base md:text-lg max-w-xl lg:ml-auto">
                  O Axis combina dois eixos que normalmente vivem separados: o consultor que enxerga o problema, e o software que executa a solução. É a única forma de garantir que a estratégia não fique no slide.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal variant="fadeUp" custom={2}>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-stretch">
              <div className="relative bg-white rounded-2xl border border-rule p-7 md:p-9 hover:border-[#1B3A8A]/30 transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: NAVY }} />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: NAVY }} />
                    <MonoLabel style={{ color: NAVY }}>Eixo A · Consultoria</MonoLabel>
                  </div>
                  <MonoLabel className="text-foreground/35">Humano</MonoLabel>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-5" style={{ color: NAVY_DEEP }}>
                  Diagnóstico, estratégia e choque de gestão.
                </h3>
                <ul className="space-y-2.5 mb-6">
                  {['Auditoria de DRE e fluxo de caixa', 'Plano tático de 90 dias', 'Reestruturação operacional in loco', 'Choque de gestão e cultura'].map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
                      {it}
                    </li>
                  ))}
                </ul>
                <HairlineRule className="my-5" />
                <div className="flex items-center justify-between">
                  <MonoLabel className="text-foreground/40">Entregável</MonoLabel>
                  <span className="text-sm font-display font-semibold" style={{ color: NAVY_DEEP }}>
                    Empresa redesenhada
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center px-2">
                <motion.svg
                  width="64" height="64" viewBox="0 0 64 64"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: 360 }}
                  viewport={{ once: false }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="32" cy="32" r="14" fill="none" stroke={GOLD} strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="22" fill="none" stroke={NAVY} strokeWidth="1" strokeDasharray="3 5" />
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <line
                      key={deg}
                      x1="32" y1="32"
                      x2={32 + Math.cos((deg * Math.PI) / 180) * 14}
                      y2={32 + Math.sin((deg * Math.PI) / 180) * 14}
                      stroke={NAVY} strokeWidth="1" opacity="0.45"
                    />
                  ))}
                  <circle cx="32" cy="32" r="3" fill={GOLD} />
                </motion.svg>
                <MonoLabel className="text-foreground/40 mt-3">Axis</MonoLabel>
              </div>

              <div className="md:hidden flex items-center justify-center py-2">
                <span className="font-mono text-foreground/35 text-xl">↕</span>
              </div>

              <div className="relative bg-white rounded-2xl border border-rule p-7 md:p-9 hover:border-[#C9A028]/40 transition-colors duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: GOLD }} />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" style={{ color: GOLD }} />
                    <MonoLabel style={{ color: GOLD }}>Eixo B · Axis ERP</MonoLabel>
                  </div>
                  <MonoLabel className="text-foreground/35">Software</MonoLabel>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-5" style={{ color: NAVY_DEEP }}>
                  Operação, métricas e controle multi-filial.
                </h3>
                <ul className="space-y-2.5 mb-6">
                  {['Vendas, estoque e financeiro num só fluxo', 'Métricas em tempo real, sem planilha', 'Multi-filial nativo com comparativos', 'Conciliação bancária automática'].map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
                      {it}
                    </li>
                  ))}
                </ul>
                <HairlineRule className="my-5" />
                <div className="flex items-center justify-between">
                  <MonoLabel className="text-foreground/40">Entregável</MonoLabel>
                  <span className="text-sm font-display font-semibold" style={{ color: NAVY_DEEP }}>
                    Sistema rodando
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fadeUp" custom={3} className="mt-12 text-center">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8" style={{ background: GOLD }} />
              <p className="font-display font-medium text-lg md:text-xl tracking-tight" style={{ color: NAVY_DEEP }}>
                O único consultor que vem com infraestrutura.
              </p>
              <span className="h-px w-8" style={{ background: GOLD }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* METRICS editorial */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-10">
          <SectionCoord index="03" label="Numbers" right="04 indicators" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
            {[
              { raw: 'R$ 1.2M', label: 'Receita recuperada média por cliente' },
              { to: 40, suffix: '%', label: 'Redução média de custos operacionais' },
              { to: 150, prefix: '+', label: 'Operações reestruturadas no Brasil' },
              { to: 90, suffix: ' dias', label: 'Tempo médio para ROI do projeto' },
            ].map((m, i) => (
              <Reveal key={i} variant="fadeUp" custom={i} className="relative">
                <MonoLabel className="text-foreground/35 mb-3 block">0{i + 1} / 04</MonoLabel>
                <div className="font-display font-bold tracking-[-0.04em] leading-none mb-3 tabular-nums" style={{ color: NAVY_DEEP, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                  {m.raw ? m.raw : <Counter to={m.to!} prefix={m.prefix ?? ''} suffix={m.suffix ?? ''} />}
                </div>
                <HairlineRule className="mb-3" />
                <p className="text-sm text-foreground/55 leading-relaxed max-w-[18ch]">
                  {m.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="method" className="relative py-20 md:py-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)` }}>
        <GridDots />
        <div className="relative z-10 container mx-auto px-5 md:px-10">
          <SectionCoord index="04" label="Method" right="04 stages" dark />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
            <div className="lg:col-span-5">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-white"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              >
                Precisão milimétrica em 4 etapas.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-7 lg:pt-3">
              <Reveal variant="fadeUp" custom={1}>
                <p className="text-white/55 leading-relaxed text-base md:text-lg">
                  Cada etapa entrega um artefato concreto. Você sabe o que sai, quando sai e qual o impacto antes do próximo passo.
                </p>
              </Reveal>
            </div>
          </div>

          <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                className="relative bg-[#0d1f4e] p-7 md:p-8 hover:bg-[#102450] transition-colors duration-300 cursor-default"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-bold text-3xl tabular-nums" style={{ color: GOLD }}>
                    {s.n}
                  </span>
                  <MonoLabel className="text-white/30">Stage</MonoLabel>
                </div>
                <h3 className="font-display font-bold text-white text-lg md:text-xl mb-2 tracking-tight leading-tight">
                  {s.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{s.desc}</p>
                <HairlineRule dark className="mb-3" />
                <div className="flex items-center gap-2">
                  <GitBranch className="w-3 h-3" style={{ color: GOLD }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/65">
                    {s.deliverable}
                  </span>
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* SERVICES editorial list */}
      <section className="py-20 md:py-28 bg-paper">
        <div className="container mx-auto px-5 md:px-10">
          <SectionCoord index="05" label="Verticals" right="04 areas" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
            <div className="lg:col-span-5">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.95]"
                style={{ color: NAVY_DEEP, fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              >
                Engenharia de negócios.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-7 lg:pt-3">
              <Reveal variant="fadeUp" custom={1}>
                <p className="text-foreground/65 leading-relaxed text-base md:text-lg max-w-xl">
                  Quatro frentes de atuação que cobrem o ciclo completo: do diagnóstico financeiro à execução técnica.
                </p>
              </Reveal>
            </div>
          </div>

          <StaggerGrid className="bg-white border border-rule rounded-2xl overflow-hidden">
            {services.map((s, i) => (
              <motion.a
                key={i}
                href="#contact"
                variants={staggerChild}
                className="group relative grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_300px_1fr_auto] gap-4 md:gap-8 px-6 md:px-9 py-7 md:py-8 border-b border-rule last:border-0 hover:bg-paper transition-colors items-center"
              >
                <MonoLabel className="text-foreground/35">{s.tag}</MonoLabel>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}1a` }}>
                    {s.icon}
                  </div>
                  <h3 className="font-display font-bold tracking-tight text-base md:text-lg" style={{ color: NAVY_DEEP }}>
                    {s.title}
                  </h3>
                </div>
                <p className="hidden md:block text-foreground/55 text-sm leading-relaxed">
                  {s.desc}
                </p>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: GOLD }} />
                <p className="md:hidden text-foreground/55 text-sm leading-relaxed col-span-3 -mt-2">
                  {s.desc}
                </p>
              </motion.a>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ERP SHOWCASE */}
      <section id="erp" className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-5 md:px-10 relative">
          <SectionCoord index="06" label="Axis ERP · Live demo" right="Tecnologia proprietária" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 mb-10 md:mb-12 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4" style={{ color: GOLD }} />
                <MonoLabel style={{ color: GOLD }}>Em produção · v2.6</MonoLabel>
              </div>
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.92]"
                style={{ color: NAVY_DEEP, fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
              >
                A infraestrutura por trás da sua próxima escala.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-5">
              <Reveal variant="fadeUp" custom={1}>
                <p className="text-foreground/65 leading-relaxed text-base md:text-lg">
                  O Axis ERP centraliza vendas, estoque, financeiro e métricas multi-filial em uma única plataforma. Abaixo, a interface real do produto — interaja com as abas e troque entre filiais.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal variant="fadeUp" custom={2}>
            <ErpMockup />
          </Reveal>

          <Reveal variant="fadeUp" custom={3}>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[
                { icon: <LineChart className="w-4 h-4" style={{ color: GOLD }} />, title: 'Métricas em tempo real', desc: 'Faturamento, ticket médio, comparativo entre filiais — sem planilha.' },
                { icon: <Boxes className="w-4 h-4" style={{ color: GOLD }} />, title: 'Operacional integrado', desc: 'Vendas, estoque, compras e logística no mesmo fluxo.' },
                { icon: <ShieldCheck className="w-4 h-4" style={{ color: GOLD }} />, title: 'Financeiro no controle', desc: 'Contas, conciliação bancária, projeção de saldo.' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-paper border border-rule">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${GOLD}1a` }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: NAVY_DEEP }}>{f.title}</h4>
                    <p className="text-foreground/55 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="fadeUp" custom={4} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-widest rounded-xl text-xs uppercase font-mono"
              style={{ background: NAVY_DEEP, color: 'white' }}
              whileHover={{ scale: 1.03, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.97 }}
            >
              Solicitar demo guiada <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-widest rounded-xl text-xs uppercase border-2 font-mono"
              style={{ borderColor: `${NAVY}33`, color: NAVY_DEEP }}
              whileHover={{ borderColor: NAVY, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Falar com especialista
            </motion.a>
          </Reveal>

          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-foreground/35">
            Imagem ilustrativa · Dados sintéticos
          </p>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="relative py-20 md:py-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
        <GridDots />
        <div className="relative z-10 container mx-auto px-5 md:px-10">
          <SectionCoord index="07" label="Field results" right="Verificáveis sob NDA" dark />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
            <div className="lg:col-span-7">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.92] text-white"
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}
              >
                Resultados reais.<br />Números inquestionáveis.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-5 lg:pt-3">
              <Reveal variant="fadeUp" custom={1}>
                <p className="text-white/55 leading-relaxed text-base md:text-lg">
                  Cada projeto entregue carrega métrica antes/depois auditada. Aqui, dois recortes representativos do portfólio.
                </p>
              </Reveal>
            </div>
          </div>

          <StaggerGrid className="grid md:grid-cols-2 gap-4 md:gap-5">
            {cases.map((c, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                className="relative bg-white/[0.06] border border-white/10 rounded-2xl p-7 md:p-9 flex flex-col h-full hover:bg-white/[0.09] hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <MonoLabel style={{ color: `${GOLD}cc` }}>{c.tag} · {c.sector}</MonoLabel>
                  <MonoLabel className="text-white/35">{c.duration}</MonoLabel>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold mb-3 leading-tight text-white tracking-tight">
                  {c.title}
                </h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-7">{c.desc}</p>

                <div className="space-y-4 mb-7">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <MonoLabel className="text-white/35">Antes — {c.before.label}</MonoLabel>
                      <span className="font-mono text-xs text-white/45">{c.before.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-white/20"
                        initial={{ width: 0 }}
                        whileInView={{ width: c.before.width }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.9, ease: EASE }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <MonoLabel style={{ color: GOLD }}>Depois — {c.after.label}</MonoLabel>
                      <span className="font-mono text-xs text-white">{c.after.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: GOLD }}
                        initial={{ width: 0 }}
                        whileInView={{ width: c.after.width }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <span className="block text-4xl md:text-5xl font-display font-bold mb-1 tabular-nums" style={{ color: GOLD }}>
                      {c.metric}
                    </span>
                    <MonoLabel className="text-white/40">{c.metricLabel}</MonoLabel>
                  </div>
                  <BarChart3 className="w-7 h-7 text-white/15" />
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-paper">
        <div className="container mx-auto px-5 md:px-10">
          <SectionCoord index="08" label="Frequently asked" right={`${faqs.length} questions`} />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.95] lg:sticky lg:top-28"
                style={{ color: NAVY_DEEP, fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              >
                Perguntas diretas.<br />Respostas claras.
              </AnimatedHeading>
            </div>
            <div className="lg:col-span-7">
              <Reveal variant="fadeUp" custom={1}>
                <div className="bg-white rounded-2xl border border-rule px-6 md:px-8">
                  {faqs.map((item, i) => (
                    <Accordion key={i} index={`Q-${String(i + 1).padStart(2, '0')}`} q={item.q} a={item.a} />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-10">
          <SectionCoord index="09" label="Get in touch" right="Resposta em 24h úteis" />

          <div className="grid lg:grid-cols-12 gap-10 md:gap-14 items-start">
            <Reveal variant="fadeLeft" className="lg:col-span-5">
              <AnimatedHeading
                className="font-display font-bold tracking-[-0.03em] leading-[0.92] mb-7"
                style={{ color: NAVY_DEEP, fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
              >
                É hora de mudar o eixo.
              </AnimatedHeading>
              <p className="text-foreground/65 mb-10 max-w-sm leading-relaxed text-base md:text-lg">
                Agende uma sessão de diagnóstico de 30 minutos. Sem compromisso comercial.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: <Mail className="w-4 h-4 text-white" />, label: 'E-mail Direto', value: 'axis.contato@outlook.com' },
                  { icon: <MapPin className="w-4 h-4 text-white" />, label: 'Sede', value: 'Av. Eng. Carlos Reinaldo Mendes, 3026 - Lote Gleba D1, Alto da Boa Vista, Sorocaba - SP.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: NAVY }}>
                      {item.icon}
                    </div>
                    <div>
                      <MonoLabel className="text-foreground/40 block mb-0.5">{item.label}</MonoLabel>
                      <p className="text-foreground/75 text-sm md:text-base">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="fadeRight" className="lg:col-span-7">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 md:py-14 border-t border-rule bg-paper">
        <div className="container mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl md:text-3xl font-display font-bold tracking-tighter uppercase" style={{ color: NAVY_DEEP }}>
                  Axis<span style={{ color: GOLD }}>.</span>
                </span>
                <MonoLabel className="text-foreground/35">{VERSION}</MonoLabel>
              </div>
              <MonoLabel className="text-foreground/45">Engenharia de negócios · ERP · Estratégia</MonoLabel>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <MonoLabel className="text-foreground/45">© {new Date().getFullYear()} Axis Consulting</MonoLabel>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
