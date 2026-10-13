import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';

interface StageStarrySkyProps {
  onRestart: () => void;
}

const reveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: (delay: number) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] as const } }),
};

const escapePositions = [
  { x: 0, y: 0 },
  { x: 90, y: -40 },
  { x: -110, y: 42 },
  { x: 115, y: 48 },
  { x: -95, y: -48 },
  { x: 25, y: 55 },
  { x: 105, y: -18 },
];

export default function StageStarrySky({ onRestart }: StageStarrySkyProps) {
  const c = useContent().starry;
  const [accepted, setAccepted] = useState(false);
  const [escapeIndex, setEscapeIndex] = useState(0);

  const moveNoButton = () => setEscapeIndex((current) => (current + 1) % escapePositions.length);

  const celebrateYes = () => {
    if (accepted) return;
    setAccepted(true);
    sound.playCelebrationFanfare();
    const end = Date.now() + 3200;
    const colors = ['#fff1e6', '#f7b7c7', '#e6396e', '#f7c76f'];
    const burst = () => {
      confetti({ particleCount: 7, angle: 58, spread: 70, startVelocity: 42, origin: { x: 0, y: 0.72 }, colors });
      confetti({ particleCount: 7, angle: 122, spread: 70, startVelocity: 42, origin: { x: 1, y: 0.72 }, colors });
      if (Date.now() < end) requestAnimationFrame(burst);
    };
    burst();
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.7 }} className="fixed inset-0 z-20 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#250813] px-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(190,39,77,0.5),transparent_43%),radial-gradient(circle_at_14%_12%,rgba(242,119,140,0.16),transparent_26%),linear-gradient(145deg,#19060e_0%,#520d23_50%,#1c060f_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,#fff_0_0.8px,transparent_1.2px)] bg-[length:31px_31px]" />
      {[0, 1, 2, 3].map((item) => (
        <motion.div
          key={item}
          animate={{ x: [0, item % 2 ? 42 : -36, 0], y: [0, -45 - item * 7, 0], scale: [0.85, 1.18, 0.85], opacity: [0.1, 0.24, 0.1] }}
          transition={{ duration: 7 + item, delay: item * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full border border-[#f7a9ba]/30 bg-[#dc315c]/10 blur-[1px]"
          style={{ width: 110 + item * 42, height: 110 + item * 42, left: `${8 + item * 25}%`, top: `${16 + (item % 2) * 52}%` }}
        />
      ))}

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        <motion.p custom={0.12} variants={reveal} initial="hidden" animate="visible" className="mb-6 text-sm font-semibold uppercase tracking-[0.34em] text-[#f1b9c5] sm:text-base"><Rich text={c.kicker} /></motion.p>

        <motion.h2 custom={0.5} variants={reveal} initial="hidden" animate="visible" className="mx-auto max-w-6xl whitespace-normal font-serif-luxury text-[clamp(2rem,4vw,4.6rem)] font-bold leading-tight tracking-[-0.045em] text-white lg:whitespace-nowrap">
          <Rich text={c.line1} />
        </motion.h2>
        <motion.p custom={0.9} variants={reveal} initial="hidden" animate="visible" className="mx-auto mt-2 max-w-6xl whitespace-normal font-serif-luxury text-[clamp(1.55rem,2.8vw,3.25rem)] leading-tight text-[#ffd7df] lg:whitespace-nowrap">
          <Rich text={c.line2} />
        </motion.p>

        <motion.p custom={1.35} variants={reveal} initial="hidden" animate="visible" className="mx-auto mt-7 max-w-4xl text-base leading-relaxed text-white/72 sm:text-xl">
          <Rich text={c.question} />
        </motion.p>

        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div key="choices" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: 1.8, duration: 0.6 }} className="relative mx-auto mt-7 h-32 w-full max-w-md">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} onClick={celebrateYes} className="absolute left-[19%] top-8 -translate-x-1/2 rounded-full bg-[#fff0e8] px-9 py-3.5 text-sm font-bold text-[#671027] shadow-[0_15px_45px_rgba(0,0,0,0.28)] transition hover:bg-white sm:text-base"><Rich text={c.yes} /></motion.button>
              <motion.button
                animate={escapePositions[escapeIndex]}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                onMouseEnter={moveNoButton}
                onFocus={moveNoButton}
                onPointerDown={(event) => { event.preventDefault(); moveNoButton(); }}
                onClick={(event) => { event.preventDefault(); moveNoButton(); }}
                className="absolute left-[67%] top-8 -translate-x-1/2 rounded-full border border-white/35 bg-white/10 px-9 py-3.5 text-sm font-bold text-white backdrop-blur-md sm:text-base"
              ><Rich text={c.no} /></motion.button>
            </motion.div>
          ) : (
            <motion.div key="accepted" initial={{ opacity: 0, y: 24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
              <motion.div initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4770] shadow-[0_0_42px_rgba(239,71,112,0.65)]"><Heart className="h-6 w-6 fill-white" /></motion.div>
              <p className="font-serif-luxury text-xl text-[#ffd7df] sm:text-2xl"><Rich text={c.accepted} /></p>
              <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.65 }} whileHover={{ scale: 1.045 }} whileTap={{ scale: 0.97 }} onClick={onRestart} className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#fff0e8] px-8 py-4 text-sm font-bold text-[#671027] shadow-[0_18px_55px_rgba(0,0,0,0.3)] transition hover:bg-white sm:text-base">
                <Rich text={c.button} /><ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30"><Rich text={c.footer} /></p>
    </motion.section>
  );
}
