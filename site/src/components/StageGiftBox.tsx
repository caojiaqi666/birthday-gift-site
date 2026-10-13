import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';

interface StageGiftBoxProps { onNext: () => void }

export default function StageGiftBox({ onNext }: StageGiftBoxProps) {
  const c = useContent().giftbox;
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGift = () => {
    if (isOpening) return;
    sound.playUnwrap();
    setIsOpening(true);
    confetti({ particleCount: 90, spread: 74, startVelocity: 28, origin: { y: 0.54 }, colors: ['#f7d7cc', '#ef4775', '#9f1738', '#f3bd9c'] });
    window.setTimeout(onNext, 850);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.65 }} className="relative mx-auto flex min-h-[76vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/55 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.96),rgba(255,239,243,0.84)_48%,rgba(252,211,221,0.74))] px-5 py-16 text-center shadow-[0_30px_90px_rgba(103,20,47,0.16)] sm:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle,#b5254e_0_1px,transparent_1.4px)] bg-[length:34px_34px]" />
      <motion.div animate={{ scale: [1, 1.14, 1], opacity: [0.16, 0.26, 0.16] }} transition={{ duration: 6, repeat: Infinity }} className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ef7091] blur-[110px]" />

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div animate={isOpening ? { opacity: 0, scale: 1.08, y: -24 } : { opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}>
              <motion.h2 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.65 }} className="mx-auto max-w-4xl font-serif-luxury text-[clamp(2rem,4vw,3.65rem)] font-bold leading-none tracking-[-0.045em] text-[#3d1824] sm:whitespace-nowrap"><Rich text={c.title} /></motion.h2>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.55 }} className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#79515e] sm:whitespace-nowrap sm:text-base"><Rich text={c.sub} /></motion.p>

              <motion.button type="button" onClick={handleOpenGift} disabled={isOpening} initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }} transition={{ opacity: { delay: 0.45, duration: 0.5 }, scale: { delay: 0.45, duration: 0.55 }, y: { delay: 1, duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }} whileHover={{ scale: 1.06, rotate: -1.5 }} whileTap={{ scale: 0.96 }} className="group relative mx-auto mt-10 block h-56 w-60 cursor-pointer disabled:cursor-default" aria-label="打开神秘礼物">
                <div className="absolute inset-5 rounded-[2rem] bg-[#bd3155]/30 blur-2xl transition duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-1/2 h-36 w-52 -translate-x-1/2 overflow-hidden rounded-b-[1.4rem] rounded-t-md border border-white/45 bg-gradient-to-br from-[#c72550] via-[#ec3f70] to-[#9d1539] shadow-[0_25px_45px_rgba(70,8,29,0.3)]">
                  <div className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-gradient-to-r from-[#e9b175] via-[#ffe0a4] to-[#dca15f]" />
                  <div className="absolute inset-x-0 top-12 h-8 bg-gradient-to-b from-[#f4c887] to-[#dca15f]" />
                </div>
                <motion.div animate={isOpening ? { y: -74, rotate: -8, opacity: 0.25 } : { y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }} className="absolute left-1/2 top-7 h-14 w-60 -translate-x-1/2 rounded-[1.15rem] border border-white/55 bg-gradient-to-r from-[#ad1c43] via-[#f24978] to-[#ad1c43] shadow-[0_14px_26px_rgba(76,8,31,0.25)]"><div className="absolute inset-y-0 left-1/2 w-9 -translate-x-1/2 bg-gradient-to-r from-[#e9b175] via-[#ffe0a4] to-[#dca15f]" /></motion.div>
                <div className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#fff3ed] p-3 text-[#c62350] shadow-lg transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110"><Gift className="h-7 w-7" /></div>
                <span className="absolute -bottom-10 left-1/2 w-max -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-[#9d2849]"><Rich text={c.tap} /></span>
              </motion.button>
        </motion.div>
      </div>
      <Sparkles className="pointer-events-none absolute bottom-10 right-10 h-5 w-5 text-[#c44969]/45" />
    </motion.section>
  );
}
