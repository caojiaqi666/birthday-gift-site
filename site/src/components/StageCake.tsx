import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Sparkles, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';
import { CREATOR } from '../creator';

interface StageCakeProps {
  onNext: () => void;
}

const candlePositions = ['41.25%', '58.35%'];

function CandleEffect({ lit, left, delay }: { lit: boolean; left: string; delay: number }) {
  return (
    <div className="pointer-events-none absolute -top-[1.5%] z-30 h-[7%] w-[7.5%] -translate-x-1/2" style={{ left }}>
      {lit ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 8 }}
            animate={{
              opacity: [0.82, 1, 0.9, 1],
              scaleX: [0.82, 1.08, 0.88, 1],
              scaleY: [0.92, 1.12, 0.96, 1.07],
              rotate: [-4, 5, -3, 3],
              x: [-1, 1.5, -1.2, 0.5],
            }}
            transition={{ duration: 0.72 + delay, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-1/2 h-full w-[42%] -translate-x-1/2 origin-bottom rounded-[58%_42%_62%_38%/72%_72%_28%_28%] bg-[radial-gradient(ellipse_at_50%_74%,#fff9cf_0_20%,#ffd26a_21%_50%,#ff8a1f_66%,#dc2b10_100%)] shadow-[0_0_14px_5px_rgba(255,170,45,0.58),0_0_38px_12px_rgba(255,196,83,0.25)]"
          >
            <span className="absolute bottom-[8%] left-1/2 h-[38%] w-[28%] -translate-x-1/2 rounded-full bg-[#7dd7ff]/75 blur-[1px]" />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-0 left-1/2 h-full w-4 -translate-x-1/2">
            {[0, 1, 2].map((piece) => (
              <motion.span
                key={piece}
                initial={{ opacity: 0.55, x: 0, y: 8, scale: 0.45 }}
                animate={{ opacity: 0, x: piece % 2 ? 8 : -7, y: -48 - piece * 10, scale: 1.25 + piece * 0.2 }}
                transition={{ duration: 2.1, delay: piece * 0.28, repeat: Infinity, ease: 'easeOut' }}
                className="absolute bottom-0 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full bg-white/55 blur-[4px]"
              />
            ))}
          </motion.div>
        )}
    </div>
  );
}

export default function StageCake({ onNext }: StageCakeProps) {
  const c = useContent().cake;
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishText, setWishText] = useState('');
  const [wishMade, setWishMade] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBlowCandles = () => {
    if (!candlesLit || isBlowing) return;
    setIsBlowing(true);
    sound.playBlow();
    window.setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      const end = Date.now() + 2200;
      const colors = ['#fff2d2', '#d8a84e', '#e44b70', '#8b1732'];
      const frame = () => {
        confetti({ particleCount: 5, angle: 62, spread: 58, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 118, spread: 58, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 520);
  };

  const handleSaveWish = (event: React.FormEvent) => {
    event.preventDefault();
    const wish = wishText.trim();
    if (!wish || isSaving) return;
    setIsSaving(true);
    localStorage.setItem('birthday_surprise_secret_wish', JSON.stringify({ wish, savedAt: new Date().toISOString() }));

    sound.playSparkle();
    setWishMade(true);
    setIsSaving(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.64 } });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-20 h-screen w-screen overflow-hidden bg-[#680c20] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_44%,rgba(238,83,115,0.32),transparent_35%),radial-gradient(circle_at_84%_18%,rgba(255,198,170,0.14),transparent_28%),linear-gradient(118deg,#3d0712_0%,#86152d_52%,#4a0715_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(circle,#fff_0_1px,transparent_1.6px)] bg-[length:27px_27px]" />
      <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.28, 0.16] }} transition={{ duration: 7, repeat: Infinity }} className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-[#ef5075] blur-[110px]" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1540px] grid-cols-1 items-center px-5 py-16 sm:px-9 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12 lg:px-16 lg:py-12">
        <motion.button
          type="button"
          aria-label="吹灭生日蜡烛"
          onClick={handleBlowCandles}
          disabled={!candlesLit || isBlowing}
          initial={{ opacity: 0, scale: 0.8, x: -45 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
          whileHover={candlesLit ? { scale: 1.018 } : undefined}
          className="group relative mx-auto flex h-full max-h-[760px] w-full max-w-[760px] items-center justify-center disabled:cursor-default"
        >
          <div className="absolute bottom-[7%] left-1/2 h-[15%] w-[72%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-3xl" />
          <div className="relative aspect-[3/2] h-auto w-full max-w-[760px]">
            <img
              src={c.cakeImage}
              alt="插着两根蜡烛的奶油生日蛋糕"
              className="h-full w-full object-contain drop-shadow-[0_30px_42px_rgba(20,0,5,0.5)] transition-transform duration-700 ease-out group-hover:scale-[1.018]"
            />
            {candlePositions.map((left, index) => (
              <React.Fragment key={left}>
                <CandleEffect lit={candlesLit} left={left} delay={index * 0.09} />
              </React.Fragment>
            ))}
          </div>
        </motion.button>

        <motion.div key={candlesLit ? 'before-wish' : 'after-wish'} initial={{ opacity: 0, x: 42 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.18 }} className="z-20 mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
          {c.kicker && <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.55 }} className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#f4c9b3]"><Rich text={c.kicker} /></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.36, duration: 0.7 }} className="max-w-xl font-serif-luxury text-[clamp(2.6rem,5vw,5.6rem)] font-bold leading-[0.96] tracking-[-0.05em] text-white">
            <Rich text={c.title} />
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, duration: 0.6 }} className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/72 sm:text-base lg:mx-0">
            <Rich text={candlesLit ? c.candleHint : c.wishDone} />
          </motion.p>

          <AnimatePresence mode="wait">
            {candlesLit ? (
              <motion.button key="blow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }} onClick={handleBlowCandles} disabled={isBlowing} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fff2e7] px-7 py-3.5 text-sm font-bold text-[#711127] shadow-[0_14px_40px_rgba(20,0,5,0.28)] transition hover:bg-white disabled:opacity-70">
                <Wind className="h-4 w-4" />{isBlowing ? c.blowing : c.blow}
              </motion.button>
            ) : (
              <motion.form key="wish" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveWish} className="mt-7 max-w-lg">
                {!wishMade ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.14, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                    className="group/wish rounded-[1.65rem] border border-white/18 bg-black/20 p-2 shadow-[0_18px_55px_rgba(35,0,10,0.22)] backdrop-blur-md transition duration-500 focus-within:border-[#ffd6c2]/65 focus-within:bg-black/28 focus-within:shadow-[0_20px_70px_rgba(255,143,165,0.2)]"
                  >
                    <label htmlFor="birthday-wish" className="flex items-center gap-2 px-4 pb-2 pt-2 text-left text-xs font-medium tracking-[0.04em] text-[#ffd9c8]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <Rich text={c.wishPrompt} />
                    </label>
                    <div className="flex min-h-14 items-center rounded-[1.25rem] bg-white/[0.07] p-1.5 transition duration-500 group-focus-within/wish:bg-white/[0.1]">
                      <input id="birthday-wish" value={wishText} onChange={(event) => setWishText(event.target.value)} placeholder={c.wishPlaceholder} className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/42 sm:px-4" />
                      <motion.button whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }} disabled={isSaving} className="shrink-0 rounded-[1rem] bg-[#fff2e7] px-5 py-3 text-xs font-bold text-[#711127] shadow-[0_8px_24px_rgba(20,0,5,0.18)] transition hover:bg-white disabled:opacity-65">{isSaving ? c.saving : c.save}</motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-sm text-[#f8decf] lg:items-start">
                    <span className="flex items-center gap-2"><Check className="h-4 w-4" /><Rich text={c.saved} /></span>
                    <span className="text-xs text-white/48"><Rich text={c.savedNote} /></span>
                  </div>
                )}
                <motion.button type="button" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.55 }} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { sound.playSparkle(); onNext(); }} className="group/gift mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[1.15rem] border border-white/20 bg-gradient-to-r from-[#b91f48] via-[#d92e5d] to-[#b91f48] px-7 py-4 text-sm font-bold tracking-[0.02em] text-white shadow-[0_16px_42px_rgba(49,0,13,0.32)] transition hover:border-white/35 hover:shadow-[0_20px_55px_rgba(244,77,116,0.3)] sm:w-auto">
                  <Rich text={c.next} /><ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/gift:translate-x-1" />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/42">
        <Sparkles className="h-3 w-3" />模板作者 <a href={CREATOR.repository} target="_blank" rel="noreferrer">{CREATOR.name}</a>
      </div>
    </motion.section>
  );
}
