import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';
import CreatorCredit from './CreatorCredit';

interface StageLetterProps { onNext: () => void; }

export default function StageLetter({ onNext }: StageLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const c = useContent().letter;
  const shortLetter = c.lines;
  // 客户 10-13:手机上信纸往右飞出了屏幕、字被截;信封也显得小。
  // 窄屏改成「信纸居中铺开、信封在下方原尺寸托着」,并按信的长短自动缩字,保证整封信都看得见。
  const narrow = typeof window !== 'undefined' && window.innerWidth < 700;
  const drop = narrow ? Math.min(170, window.innerHeight * .2) : 0; // 打开后信封往下沉,从信纸底下露出来
  const copyRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = copyRef.current; if (!isOpen || !el) return;
    let size = narrow ? 13.5 : 15;
    el.style.setProperty('--letter-fs', size + 'px');
    while (el.scrollHeight > el.clientHeight + 1 && size > 9) { size -= .5; el.style.setProperty('--letter-fs', size + 'px'); }
  }, [isOpen, narrow, shortLetter]);

  const openLetter = () => {
    if (isOpen) return;
    sound.playLetterOpen();
    setIsOpen(true);
    window.setTimeout(() => confetti({ particleCount: 54, spread: 74, startVelocity: 27, gravity: .64, scalar: .72, origin: { x: .5, y: .58 }, colors: ['#fff8ed', '#f4c8b5', '#e74d70', '#a40d34'] }), 520);
  };

  return <motion.section className={`paper-letter ${isOpen ? 'is-open' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: .65 }}>
    <div className="paper-letter-light" />
    <div className="letter-rose-field" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
    <motion.div className="paper-envelope-scene" initial={{ opacity: 0, y: 55, rotate: -2 }} animate={{ opacity: 1, y: isOpen ? drop : 0, rotate: 0 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}>
      <button className="paper-envelope" type="button" onClick={openLetter} aria-label="打开情书">
        <span className="paper-envelope-back" />
        <motion.span className="paper-envelope-flap" animate={{ rotateX: isOpen ? 178 : 0, zIndex: isOpen ? 1 : 6 }} transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }} />
        <span className="paper-heart heart-one"><Heart fill="currentColor" /></span>
        <span className="paper-heart heart-two"><Heart fill="currentColor" /></span>
        <span className="paper-heart heart-three"><Heart fill="currentColor" /></span>
        <span className="paper-heart heart-four"><Heart fill="currentColor" /></span>
        <span className="paper-heart heart-five"><Heart fill="currentColor" /></span>
        <span className="paper-envelope-left" /><span className="paper-envelope-right" /><span className="paper-envelope-front" />
        <motion.span className="paper-wax" animate={isOpen ? { opacity: 0, scale: 1.7, y: 22 } : { opacity: 1, scale: [1, 1.08, 1] }} transition={isOpen ? { duration: .4 } : { repeat: Infinity, duration: 1.8 }}><Heart fill="currentColor" /></motion.span>
      </button>
      <AnimatePresence>{!isOpen && <motion.p className="paper-letter-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: .65 }}><Rich text={c.hint} /></motion.p>}</AnimatePresence>
      <AnimatePresence>{isOpen && <motion.article className="diary-letter" initial={{ opacity: 0, x: -78, y: 118, scale: .54, rotate: -12 }} animate={narrow ? { opacity: [0, 1, 1], x: [-30, 8, 0], y: [118, -drop - 16, -drop - 8], scale: [.54, .9, 1], rotate: [-10, 3, 1] } : { opacity: [0, 1, 1], x: [-78, 74, 108], y: [118, -26, -20], scale: [.54, .78, .9], rotate: [-12, 7, 3] }} exit={{ opacity: 0 }} transition={{ delay: .48, duration: 1.4, times: [0, .66, 1], ease: [0.16, 1, 0.3, 1] }}>
        <motion.span className="letter-fold letter-fold-top" initial={{ rotateX: 179 }} animate={{ rotateX: 0 }} transition={{ delay: 1.62, duration: .86, ease: [0.16, 1, 0.3, 1] }} />
        <motion.span className="letter-fold letter-fold-bottom" initial={{ rotateX: -179 }} animate={{ rotateX: 0 }} transition={{ delay: 2.18, duration: .9, ease: [0.16, 1, 0.3, 1] }} />
        <motion.div ref={copyRef} className="letter-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.82, duration: .7 }}>{shortLetter.map((line, index) => <motion.p key={index} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.85 + index * .13, duration: .42 }}><Rich text={line} /></motion.p>)}</motion.div>
      </motion.article>}</AnimatePresence>
    </motion.div>

    <AnimatePresence>{isOpen && <motion.button className="paper-letter-next" type="button" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2, duration: .6 }} whileHover={{ x: 5 }} whileTap={{ scale: .97 }} onClick={() => { sound.playSparkle(); onNext(); }}><Rich text={c.button} /> <ArrowRight /></motion.button>}</AnimatePresence>
    <footer><CreatorCredit /></footer>
  </motion.section>;
}
