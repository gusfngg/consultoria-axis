const NAVY = '#1B3A8A';
const GOLD = '#C9A028';

export default function NotFound() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-6 text-white"
      style={{ background: `linear-gradient(135deg, #0d1f4e 0%, ${NAVY} 100%)` }}
    >
      <div className="max-w-md text-center">
        <div className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase mb-6">
          Axis<span style={{ color: GOLD }}>.</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-4" style={{ color: GOLD }}>
          404
        </h1>
        <p className="text-white/70 mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold tracking-wide rounded-xl text-sm uppercase"
          style={{ background: GOLD, color: '#0d1f4e' }}
        >
          Voltar ao início
        </a>
      </div>
    </main>
  );
}
