// 「我们认识的天数」:从某个具体时刻(比如加上微信那一刻)累计到生日当天共 N 天;从那一刻起,欢喜开始累计
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { useContent, Rich, daysTogether } from '../content';
import CreatorCredit from './CreatorCredit';

export default function StageCounter({ onNext }: { onNext: () => void }) {
  const all = useContent(), c = all.counter;
  const target = daysTogether(all);
  const [shown, setShown] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {   // 数字从 0 滚到目标天数
    const t0 = performance.now(), dur = 2200; let raf = 0;
    const tick = (t: number) => { const u = Math.min(1, (t - t0) / dur); setShown(Math.round(target * (1 - Math.pow(1 - u, 3)))); if (u < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target]);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const ms = Math.max(0, now - new Date(c.start).getTime()), d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
  return <motion.section className="love-counter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: .7 }}>
    <div className="seven-days-glow seven-days-glow-one" /><div className="seven-days-glow seven-days-glow-two" />
    <motion.p className="love-counter-kicker" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><Heart fill="currentColor" /> <Rich text={c.kicker} /></motion.p>
    <motion.p className="love-counter-before" initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .5, duration: .9 }}><Rich text={c.before} />，<Rich text={c.middle} /></motion.p>
    <motion.div className="love-counter-num" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .9, duration: .8, ease: [0.16, 1, 0.3, 1] }}><b>{shown}</b><span><Rich text={c.unit} /></span></motion.div>
    {c.showTicker && <motion.p className="love-counter-ticker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }}>此刻已累计 {d} 天 {String(h).padStart(2, '0')} 时 {String(m).padStart(2, '0')} 分 {String(s).padStart(2, '0')} 秒</motion.p>}
    <motion.p className="love-counter-tail" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4, duration: .8 }}><Rich text={c.tail} /></motion.p>
    <motion.button className="seven-days-next" type="button" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.1 }} whileHover={{ y: -4 }} whileTap={{ scale: .97 }} onClick={() => { sound.playSparkle(); onNext(); }}><Rich text={c.button} /> <ArrowRight /></motion.button>
    <footer className="love-counter-credit"><CreatorCredit /></footer>
  </motion.section>;
}
