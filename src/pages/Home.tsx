import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring,
  useInView, useMotionValue, animate,
} from 'framer-motion';
import Lenis from 'lenis';
import {
  ArrowRight, BarChart3, Target, Zap, ShieldCheck,
  ChevronRight, Mail, MapPin, Building2, Network,
  Anchor, ChevronDown, Menu, X, TrendingUp,
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import axisConcept from '@/assets/axis-concept.png';
import methodologyImg from '@/assets/methodology.png';
import teamImg from '@/assets/team.png';

const NAVY = '#1B3A8A';
const GOLD = '#C9A028';
const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Lenis smooth scroll ─── */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf: number;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, []);
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, to, {
      duration: 2.2,
      ease: EASE_OUT,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('pt-BR') + suffix; },
    });
    return ctrl.stop;
  }, [inView, mv, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Navy section overlays — each pattern is unique per section ─── */

/** HERO: large square grid — blueprint/architectural */
function GridHero() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
      maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%)',
    }} />
  );
}

/** METHODOLOGY: diamond crosshatch (45° + -45° diagonals) */
function GridMethodology() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{
      backgroundImage: `
        linear-gradient(45deg, rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(-45deg, rgba(255,255,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '56px 56px',
      maskImage: 'radial-gradient(ellipse 100% 90% at 70% 50%, black 10%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse 100% 90% at 70% 50%, black 10%, transparent 80%)',
    }} />
  );
}

/** CASES: dot grid — data / precision feel */
function GridCases() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
      backgroundSize: '36px 36px',
      maskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 15%, transparent 85%)',
      WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 30% 50%, black 15%, transparent 85%)',
    }} />
  );
}

/** CONTACT FORM: tight horizontal scan-lines */
function GridFormCard() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl overflow-hidden" style={{
      backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: '100% 40px',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
    }} />
  );
}

/* ─── Gold line draw (animates width from 0 to full) ─── */
function GoldLine({ className = 'w-10' }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={`h-1 rounded-full shrink-0`}
      style={{ background: GOLD }}
      initial={{ width: 0, opacity: 0 }}
      animate={inView ? { width: className.replace('w-', '') === '10' ? 40 : 48, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    />
  );
}

/* ─── Animated heading reveal (fade+slide up) ─── */
function AnimatedHeading({
  children, className = '', delay = 0, style,
}: { children: string; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.h2
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.h2>
  );
}

/* ─── Generic scroll-reveal ─── */
const revealVariants = {
  fadeUp:    { hidden: { opacity: 0, y: 40 },    visible: (d = 0) => ({ opacity: 1, y: 0,    transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  fadeLeft:  { hidden: { opacity: 0, x: -48 },   visible: (d = 0) => ({ opacity: 1, x: 0,    transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  fadeRight: { hidden: { opacity: 0, x: 48 },    visible: (d = 0) => ({ opacity: 1, x: 0,    transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  scaleUp:   { hidden: { opacity: 0, scale: 0.9 }, visible: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.6,  delay: d * 0.1, ease: EASE } }) },
};

function Reveal({ children, variant = 'fadeUp', custom = 0, className = '' }: {
  children: React.ReactNode; variant?: keyof typeof revealVariants; custom?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} custom={custom} variants={revealVariants[variant]}
      initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Stagger container ─── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function StaggerGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Accordion ─── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-foreground/10 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-start justify-between text-left focus-visible:outline-none group gap-4">
        <span className="text-sm md:text-base font-bold group-hover:text-primary transition-colors duration-200 leading-snug pt-0.5">
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0 mt-0.5">
          <ChevronDown className="w-4 h-4" style={{ color: GOLD }} />
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
            <p className="text-foreground/60 leading-relaxed pb-5 text-sm">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ text, dark = false, delay = 0 }: { text: string; dark?: boolean; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}>
      <GoldLine />
      <span className={`uppercase tracking-widest font-bold text-xs ${dark ? 'text-white/50' : 'text-foreground/50'}`}>{text}</span>
    </motion.div>
  );
}

/* ─── Nav link with animated underline ─── */
function NavLink({ href, children, light }: { href: string; children: string; light: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} className={`relative text-sm font-semibold tracking-wide uppercase transition-colors duration-200 pb-0.5 ${light ? 'text-foreground/65 hover:text-primary' : 'text-white/75 hover:text-white'}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] rounded-full"
        style={{ background: GOLD }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </a>
  );
}

/* ─── Contact form (controlled, posts to /api/contact) ─── */
type FormState = { name: string; email: string; role: string; revenue: string; message: string };
const INITIAL_FORM: FormState = { name: '', email: '', role: '', revenue: '', message: '' };

function ContactForm() {
  const [data, setData] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!data.name.trim() || !data.message.trim()) {
      setError('Preencha seu nome e o desafio atual.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setStatus('sending');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error('request failed');
      setStatus('sent');
      setData(INITIAL_FORM);
    } catch {
      setStatus('error');
      setError('Não foi possível enviar agora. Tente novamente em instantes.');
    }
  };

  const sending = status === 'sending';
  const sent = status === 'sent';

  return (
    <form
      className="relative rounded-2xl p-7 md:p-12 space-y-4 text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f4e 100%)` }}
      onSubmit={onSubmit}
      noValidate
    >
      <GridFormCard />
      <div className="relative z-10 space-y-4">
        <h3 className="text-lg md:text-xl font-display font-bold mb-1">Solicitar Diagnóstico</h3>

        <div>
          <label htmlFor="cf-name" className="block text-xs text-white/45 mb-1.5 uppercase tracking-widest font-bold">Nome Completo</label>
          <input id="cf-name" name="name" type="text" required autoComplete="name" placeholder="Ex: João Silva"
            value={data.name} onChange={update('name')}
            className="w-full bg-white/10 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder-white/25" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cf-email" className="block text-xs text-white/45 mb-1.5 uppercase tracking-widest font-bold">E-mail</label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="joao@empresa.com"
              value={data.email} onChange={update('email')}
              className="w-full bg-white/10 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder-white/25" />
          </div>
          <div>
            <label htmlFor="cf-role" className="block text-xs text-white/45 mb-1.5 uppercase tracking-widest font-bold">Cargo</label>
            <input id="cf-role" name="role" type="text" autoComplete="organization-title" placeholder="CEO / Diretor"
              value={data.role} onChange={update('role')}
              className="w-full bg-white/10 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder-white/25" />
          </div>
        </div>

        <div>
          <label htmlFor="cf-revenue" className="block text-xs text-white/45 mb-1.5 uppercase tracking-widest font-bold">Faturamento Anual</label>
          <select id="cf-revenue" name="revenue" value={data.revenue} onChange={update('revenue')}
            className="w-full bg-white/10 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/50 appearance-none cursor-pointer text-white/85">
            <option value="" className="bg-[#1B3A8A]">Selecione uma faixa</option>
            <option className="bg-[#1B3A8A]">R$ 5M – R$ 20M</option>
            <option className="bg-[#1B3A8A]">R$ 20M – R$ 50M</option>
            <option className="bg-[#1B3A8A]">Acima de R$ 50M</option>
          </select>
        </div>

        <div>
          <label htmlFor="cf-message" className="block text-xs text-white/45 mb-1.5 uppercase tracking-widest font-bold">Maior desafio hoje</label>
          <textarea id="cf-message" name="message" required rows={3} placeholder="Descreva brevemente..."
            value={data.message} onChange={update('message')}
            className="w-full bg-white/10 border border-white/15 rounded-xl p-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors resize-none placeholder-white/25" />
        </div>

        {error && (
          <p role="alert" className="text-sm" style={{ color: '#ffb4b4' }}>{error}</p>
        )}
        {sent && (
          <p role="status" className="text-sm" style={{ color: GOLD }}>
            Recebemos sua solicitação. Nossa equipe responderá em até 1 dia útil.
          </p>
        )}

        <motion.button type="submit"
          disabled={sending || sent}
          className="w-full font-bold py-4 rounded-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: GOLD, color: '#0d1f4e' }}
          whileHover={!sending && !sent ? { scale: 1.02, filter: 'brightness(1.08)' } : undefined}
          whileTap={!sending && !sent ? { scale: 0.97 } : undefined}>
          {sending ? 'Enviando…' : sent ? 'Enviado' : (<>Enviar Solicitação <ArrowRight className="w-4 h-4" /></>)}
        </motion.button>
      </div>
    </form>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function Home() {
  useLenis();

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

  const NAV_ITEMS = ['Expertise', 'Método', 'Resultados', 'FAQ', 'Contato'];
  const NAV_IDS   = ['services', 'method',  'cases',      'faq', 'contact'];

  const services = [
    { icon: <Anchor   className="w-5 h-5" style={{ color: GOLD }} />, title: 'Reestruturação Operacional', desc: 'Redesenhamos fluxos de trabalho para eliminar redundâncias e aumentar a margem de lucro.' },
    { icon: <Network  className="w-5 h-5" style={{ color: GOLD }} />, title: 'Otimização de Receita',       desc: 'Revisão de pricing, máquina de vendas e identificação de novos canais B2B.' },
    { icon: <Building2 className="w-5 h-5" style={{ color: GOLD }} />, title: 'Advisory M&A',              desc: 'Captação ou fusão com valuation maximizado e due diligence antecipada.' },
    { icon: <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />, title: 'Transformação Digital',     desc: 'Ferramentas e processos digitais que reduzem overhead sem disrupção do negócio.' },
  ];

  const steps = [
    { n: '01', title: 'Imersão & Auditoria',     desc: 'Mapeamento de DRE, fluxo de caixa, processos vitais e cultura organizacional.' },
    { n: '02', title: 'Desenho da Arquitetura',  desc: 'Plano tático com redesenho estrutural focado em eficiência e maximização de margem.' },
    { n: '03', title: 'Choque de Gestão',         desc: 'Implementação assistida in loco com seus gestores para garantir a mudança de rota.' },
    { n: '04', title: 'Tração & Escala',          desc: 'Monitoramento de KPIs, ajustes finos e consolidação da cultura de alta performance.' },
  ];

  const faqs = [
    { q: 'Qual é o tamanho mínimo de empresa que a Axis atende?',         a: 'Focamos em empresas com faturamento anual acima de R$ 20M que possuem operação validada mas encontram gargalos claros para escalar ou otimizar margem.' },
    { q: 'Quanto tempo dura um projeto típico de reestruturação?',         a: 'Nossos ciclos de projeto variam de 4 a 8 meses. O objetivo é criar processos autossuficientes e sair da operação assim que a máquina estiver rodando.' },
    { q: 'Vocês atuam na execução ou apenas entregam o planejamento?',     a: 'Atuamos na execução. Nossos consultores trabalham ombro a ombro com seus gestores para que a estratégia vire realidade no balanço.' },
    { q: 'Como é estruturada a precificação dos serviços?',                a: 'Fee fixo de setup somado a success fee atrelado às métricas de resultado. Se você não ganha, nós não ganhamos.' },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">

      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{ scaleX, background: `linear-gradient(90deg, ${NAVY}, ${GOLD})` }} />

      {/* ── NAVBAR ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,padding] duration-400 ease-out
          ${scrolled ? 'bg-white/96 backdrop-blur-lg shadow-[0_1px_20px_rgba(0,0,0,0.06)]' : ''}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className={`container mx-auto px-5 md:px-12 flex items-center justify-between transition-[padding] duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
          <motion.a href="#" className={`text-xl md:text-2xl font-display font-bold tracking-tighter uppercase transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}
            whileHover={{ scale: 1.03 }} transition={{ duration: 0.15 }}>
            Axis<span style={{ color: GOLD }}>.</span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((label, i) => (
              <NavLink key={label} href={`#${NAV_IDS[i]}`} light={scrolled}>{label}</NavLink>
            ))}
          </div>

          {/* CTA button desktop */}
          <motion.a href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200"
            style={{ background: GOLD, color: '#0d1f4e' }}
            whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
            whileTap={{ scale: 0.96 }}>
            Diagnóstico Grátis <ArrowRight className="w-3.5 h-3.5" />
          </motion.a>

          {/* Hamburger */}
          <motion.button
            className={`md:hidden p-1 rounded-lg transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}
            onClick={() => setMenuOpen(v => !v)}
            whileTap={{ scale: 0.9 }}>
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.span>
                : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6" /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="md:hidden overflow-hidden bg-white border-t border-foreground/8"
            >
              <motion.div className="px-5 py-5 space-y-1"
                initial="hidden" animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}>
                {NAV_ITEMS.map((label, i) => (
                  <motion.a key={label}
                    href={`#${NAV_IDS[i]}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-foreground/70 font-semibold text-sm uppercase tracking-wide hover:text-primary border-b border-foreground/6 last:border-0 transition-colors"
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                    {label}
                  </motion.a>
                ))}
                <motion.a href="#contact" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 mt-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide w-full"
                  style={{ background: GOLD, color: '#0d1f4e' }}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                  Diagnóstico Grátis <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══ 1. HERO ══ */}
      <section className="relative h-[110dvh] min-h-[650px] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0d1f4e 0%, ${NAVY} 55%, #0a1835 100%)` }}>
        <GridHero />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15 mix-blend-luminosity" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(13,31,78,0.55) 65%, #0d1f4e 100%)' }} />
          {/* Animated rings */}
          {[{ size: 700, pos: '-right-40', border: 2, dur: 80 }, { size: 460, pos: 'right-10', border: 1, dur: 55 }].map((r, i) => (
            <motion.div key={i}
              className={`absolute top-1/4 ${r.pos} rounded-full opacity-[0.07] pointer-events-none`}
              style={{ width: r.size, height: r.size, border: `${r.border}px solid ${GOLD}` }}
              animate={{ rotate: i === 0 ? 360 : -360 }}
              transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }} />
          ))}
        </motion.div>

        <div className="relative z-10 container mx-auto px-5 md:px-12 flex flex-col items-center text-center mt-16 md:mt-20">
          <motion.div
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 mb-8 rounded-full"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 font-semibold">Consultoria Estratégica</span>
          </motion.div>

          {/* Staggered headline */}
          <div className="w-full mb-6 md:mb-8 px-1">
            {['O EIXO DA SUA', 'PRÓXIMA ESCALA.'].map((line, li) => (
              <motion.div
                key={li}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + li * 0.15, ease: EASE }}
                className={`font-display font-bold tracking-tighter leading-[0.93] block
                  text-[2.1rem] sm:text-5xl md:text-7xl lg:text-[7.5rem]
                  ${li === 0 ? 'text-white' : ''}`}
                style={li === 1 ? {
                  backgroundImage: `linear-gradient(90deg, ${GOLD} 0%, #f0c84a 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : {}}>
                {line}
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-base md:text-xl text-white/60 font-light leading-relaxed mb-10 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}>
            Não entregamos relatórios genéricos. Estruturamos processos, otimizamos operações e destravamos receita para empresas que não têm tempo a perder.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.68 }}>
            <motion.a href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold tracking-wide rounded-xl text-sm uppercase"
              style={{ background: GOLD, color: '#0d1f4e' }}
              whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }} whileTap={{ scale: 0.96 }}>
              Agendar Diagnóstico <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a href="#cases"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold tracking-wide rounded-xl text-sm uppercase border-2 border-white/25 text-white"
              whileHover={{ borderColor: 'rgba(255,255,255,0.6)', scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              Ver Resultados
            </motion.a>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}>
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ══ 3. METRICS ══ */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-5 md:px-12">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              { raw: '100k', prefix: 'R$ ', label: 'Receita recuperada em média' },
              { to: 40,  suffix: '%',    label: 'Redução média de custos operacionais' },
              { to: 150, prefix: '+',    label: 'Operações reestruturadas no Brasil' },
              { to: 90,  suffix: ' dias', label: 'Tempo médio para ROI do projeto' },
            ].map((m, i) => (
              <motion.div key={i} variants={staggerChild}
                className="bg-white rounded-2xl p-5 md:p-7 text-center flex flex-col justify-between border border-foreground/6 shadow-sm h-full"
                whileHover={{ y: -4, boxShadow: '0 14px 40px rgba(27,58,138,0.11)' }} transition={{ duration: 0.22 }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 md:mb-3" style={{ color: NAVY }}>
                  {m.prefix ?? ''}{m.raw ? m.raw : <Counter to={m.to!} suffix={m.suffix ?? ''} />}
                </div>
                <span className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-widest font-semibold leading-relaxed">{m.label}</span>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ 4. PROBLEM ══ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-12">
          <div className="max-w-3xl mb-12 md:mb-16">
            <SectionLabel text="O Problema Real" />
            <AnimatedHeading className="text-3xl md:text-5xl uppercase font-display font-bold tracking-tighter mb-5 leading-[1.05]" style={{ color: NAVY }}>
                Consultoria e transparência são sinômino de resultados.
            </AnimatedHeading>
            <Reveal variant="fadeUp" custom={1}>
              <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
                Sabemos o porquê você hesita. O mercado está cheio de teóricos que apontam o problema e desaparecem na hora da execução.
              </p>
            </Reveal>
          </div>

          <StaggerGrid className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Zap className="w-5 h-5" style={{ color: GOLD }} />, title: 'Diagnóstico Clínico', desc: 'Analisamos números, processos e gargalos com precisão cirúrgica para encontrar onde o dinheiro está vazando.' },
              { icon: <Target className="w-5 h-5" style={{ color: GOLD }} />, title: 'Estratégia Aplicável', desc: 'Planos de ação que sua equipe executa amanhã. O que não é prático é descartado do framework sumariamente.' },
              { icon: <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />, title: 'Acompanhamento estratégico ', desc: 'Ficamos ao seu lado durante a implementação, ajustando a rota até os resultados estarem no balanço.' },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerChild}
                className="rounded-2xl border border-foreground/8 p-6 md:p-8 bg-muted h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 18px 48px rgba(27,58,138,0.09)', borderColor: `${NAVY}22` }}
                transition={{ duration: 0.22 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 shrink-0" style={{ background: `${GOLD}1a` }}>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-2.5" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-foreground/55 leading-relaxed text-sm flex-1">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ 5. METHODOLOGY — Navy ══ */}
      <section id="method" className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0d1f4e 0%, ${NAVY} 100%)` }}>
        <GridMethodology />
        <div className="relative z-10 container mx-auto px-5 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <Reveal variant="fadeLeft" className="relative h-[480px] md:h-[580px] hidden lg:block">
              <motion.div className="w-full h-full rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.015 }} transition={{ duration: 0.4 }}>
                <img src={methodologyImg} alt="Metodologia" className="w-full h-full object-cover opacity-50" />
              </motion.div>
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to right, transparent 50%, #0f2460 100%)' }} />
            </Reveal>

            <div>
              <SectionLabel text="O Método Axis" dark />
              <AnimatedHeading className="text-3xl md:text-5xl font-display font-bold mb-10 leading-tight text-white" delay={0.1}>
                PRECISÃO MILIMÉTRICA EM 4 ETAPAS.
              </AnimatedHeading>

              <StaggerGrid className="space-y-3">
                {steps.map((s, i) => (
                  <motion.div key={i} variants={staggerChild}
                    className="flex gap-4 p-4 md:p-5 rounded-xl border border-white/10 bg-white/[0.05] cursor-default"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.09)', borderColor: `${GOLD}55` }}
                    transition={{ duration: 0.2 }}>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0" style={{ background: GOLD, color: '#0d1f4e' }}>
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm md:text-base mb-0.5">{s.title}</h3>
                      <p className="text-white/50 text-xs md:text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </StaggerGrid>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. SERVICES ══ */}
      <section id="services" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-12">
          <SectionLabel text="Nossas Verticais" />
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <AnimatedHeading className="text-4xl md:text-6xl font-display font-bold leading-[0.95] mb-10" style={{ color: NAVY }}>
                ENGENHARIA DE NEGÓCIOS.
              </AnimatedHeading>
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s, i) => (
                  <motion.div key={i} variants={staggerChild}
                    className="rounded-2xl border border-foreground/8 p-5 md:p-6 bg-muted h-full flex flex-col cursor-pointer"
                    whileHover={{ y: -4, boxShadow: '0 14px 36px rgba(27,58,138,0.09)', borderColor: `${NAVY}28` }}
                    transition={{ duration: 0.2 }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ background: `${GOLD}1a` }}>
                      {s.icon}
                    </div>
                    <h3 className="font-bold mb-1.5 text-sm leading-snug" style={{ color: NAVY }}>{s.title}</h3>
                    <p className="text-foreground/55 text-xs leading-relaxed flex-1">{s.desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wide" style={{ color: GOLD }}>
                      Saiba mais <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </StaggerGrid>
            </div>
            <Reveal variant="fadeRight" className="relative h-[480px] md:h-[580px] hidden lg:block">
              <motion.div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.015 }} transition={{ duration: 0.35 }}>
                <img src={axisConcept} alt="Engenharia de Negócios" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-2xl" style={{ background: `linear-gradient(to top, ${NAVY}80, transparent 55%)` }} />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 7. CASES — Navy ══ */}
      <section id="cases" className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f4e 100%)` }}>
        <GridCases />
        <div className="relative z-10 container mx-auto px-5 md:px-12">
          <Reveal variant="fadeUp" className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-0.5 w-10 rounded-full" style={{ background: GOLD }} />
              <span className="uppercase tracking-widest font-bold text-xs" style={{ color: `${GOLD}cc` }}>Estudos de Caso</span>
              <div className="h-0.5 w-10 rounded-full" style={{ background: GOLD }} />
            </div>
            <AnimatedHeading className="text-3xl md:text-5xl font-display font-bold leading-tight text-white">
              RESULTADOS REAIS. NÚMEROS INQUESTIONÁVEIS.
            </AnimatedHeading>
          </Reveal>

          <StaggerGrid className="grid md:grid-cols-2 gap-4 md:gap-5">
            {[
              { sector: 'Indústria de Manufatura', title: 'Corte de R$ 150mil em despesas sem perda de capacidade.', desc: 'Reestruturação da cadeia de suprimentos e renegociação de contratos em 4 meses.', metric: '-42%', label: 'Custo de Operação' },
              { sector: 'SaaS B2B Enterprise',     title: 'Aumento de 215% no ARR reestruturando o comissionamento.', desc: 'Nova política de pricing e tiers enterprise que destravaram contas paradas.', metric: '+215%', label: 'Receita Anual (ARR)' },
            ].map((c, i) => (
              <motion.div key={i} variants={staggerChild}
                className="bg-white/[0.07] border border-white/10 rounded-2xl p-7 md:p-10 flex flex-col h-full"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.11)', borderColor: `${GOLD}50` }}
                transition={{ duration: 0.22 }}>
                <div className="flex-1">
                  <span className="text-xs font-bold tracking-widest uppercase mb-4 block" style={{ color: `${GOLD}bb` }}>{c.sector}</span>
                  <h3 className="text-xl md:text-3xl font-bold mb-4 leading-tight text-white">{c.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{c.desc}</p>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-6 mt-7">
                  <div>
                    <span className="block text-4xl md:text-5xl font-display font-bold mb-1" style={{ color: GOLD }}>{c.metric}</span>
                    <span className="text-xs uppercase tracking-widest font-bold text-white/40">{c.label}</span>
                  </div>
                  <BarChart3 className="w-8 h-8 text-white/15" />
                </div>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ 8. TEAM ══ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <SectionLabel text="O Time" />
              <AnimatedHeading className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight" style={{ color: NAVY }}>
                SENIORIDADE NA VEIA. NENHUM JÚNIOR NO SEU PROJETO.
              </AnimatedHeading>
              <Reveal variant="fadeLeft" custom={1}>
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed mb-4">
                  Diferente das grandes consultorias globais que vendem sócios e entregam trainees, a Axis opera exclusivamente com profissionais que já sentaram na cadeira de C-Level.
                </p>
                <p className="text-sm md:text-base text-foreground/55 leading-relaxed">
                  Quem planeja a sua estratégia é quem executa ao seu lado. Sem intermediários, sem perda de contexto.
                </p>
              </Reveal>
            </div>
            <Reveal variant="fadeRight" className="relative aspect-[4/3] w-full">
              <motion.div className="w-full h-full rounded-2xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.015 }} transition={{ duration: 0.35 }}>
                <img src={teamImg} alt="Liderança Axis" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-2xl" style={{ background: `linear-gradient(to top, ${NAVY}70, transparent 50%)` }} />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 9. FAQ ══ */}
      <section id="faq" className="py-20 md:py-28 bg-muted">
        <div className="container mx-auto px-5 md:px-12 max-w-2xl">
          <Reveal variant="fadeUp" className="text-center mb-10">
            <div className="flex justify-center mb-3">
              <GoldLine />
            </div>
            <AnimatedHeading className="text-3xl md:text-5xl font-display font-bold" style={{ color: NAVY }}>
              PERGUNTAS DIRETAS. RESPOSTAS CLARAS.
            </AnimatedHeading>
          </Reveal>
          <Reveal variant="fadeUp" custom={1}>
            <div className="bg-white rounded-2xl border border-foreground/8 shadow-sm px-5 md:px-7">
              {faqs.map((item, i) => (
                <Accordion key={i} title={item.q}>{item.a}</Accordion>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 10. CONTACT ══ */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-start">
            <Reveal variant="fadeLeft">
              <SectionLabel text="O Próximo Passo" />
              <AnimatedHeading className="text-4xl md:text-6xl font-display font-bold mb-7 leading-[0.92]" style={{ color: NAVY }}>
                É HORA DE MUDAR O EIXO.
              </AnimatedHeading>
              <p className="text-base md:text-lg text-foreground/60 mb-10 max-w-sm leading-relaxed">
                Agende uma sessão de diagnóstico de 30 minutos. Sem compromisso comercial.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-4 h-4 text-white" />, label: 'E-mail Direto',  value: 'board@axisconsulting.com.br' },
                  { icon: <MapPin className="w-4 h-4 text-white" />, label: 'Sede',          value: 'Av. Brigadeiro Faria Lima, 3477 · Itaim Bibi — SP' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: NAVY }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wide text-xs mb-0.5" style={{ color: NAVY }}>{item.label}</h4>
                      <p className="text-foreground/60 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="fadeRight">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 11. FOOTER ══ */}
      <footer className="py-10 md:py-12 border-t border-foreground/8 bg-muted">
        <div className="container mx-auto px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <div className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase mb-1" style={{ color: NAVY }}>
              Axis<span style={{ color: GOLD }}>.</span>
            </div>
            <p className="text-foreground/40 text-xs font-semibold uppercase tracking-widest">Estratégia & Execução</p>
          </div>
          <p className="text-foreground/35 text-xs font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} Axis Consulting. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
