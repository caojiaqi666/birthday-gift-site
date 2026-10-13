import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { useContent, Rich, fill } from '../content';
import CreatorCredit from './CreatorCredit';

interface StageBalloonsProps { onNext: () => void; }
interface LoveFlight {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  sweepX: number;
  returnX: number;
  highY: number;
  lowY: number;
}


const BALLOON_STYLE = [
  { x: 10, y: 19, scale: .92, hue: -8, delay: 0 },
  { x: 28, y: 10, scale: 1.08, hue: 13, delay: .25 },
  { x: 47, y: 18, scale: .98, hue: 334, delay: .5 },
  { x: 66, y: 8, scale: 1.1, hue: 25, delay: .75 },
  { x: 84, y: 20, scale: .9, hue: 345, delay: 1 },
];

export default function StageBalloons({ onNext }: StageBalloonsProps) {
  const all = useContent(), c = all.balloons, NOTES = c.notes.slice(0, 5);
  const [popped, setPopped] = useState<boolean[]>(Array(5).fill(false));
  const [activeNote, setActiveNote] = useState(c.intro);
  const [flights, setFlights] = useState<LoveFlight[]>([]);
  const [noteHit, setNoteHit] = useState(false);
  const noteRef = useRef<HTMLElement>(null);
  const count = popped.filter(Boolean).length;
  const complete = count === 5;

  const popBalloon = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    if (popped[index]) return;
    sound.playPop();
    window.setTimeout(() => sound.playArrowFlight(), 90);
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height * .32) / innerHeight };
    const target = noteRef.current?.getBoundingClientRect();
    const flightId = Date.now() + index;
    if (target) {
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height * .25;
      const travelRight = startX < innerWidth / 2;
      setFlights((current) => [...current, {
        id: flightId,
        startX,
        startY,
        endX: target.left + 44,
        endY: target.top + target.height * .38,
        sweepX: travelRight ? innerWidth - 115 : 115,
        returnX: travelRight ? innerWidth * .68 : innerWidth * .32,
        highY: Math.max(92, innerHeight * .13),
        lowY: Math.min(innerHeight - 110, innerHeight * .72),
      }]);
    }
    confetti({ particleCount: 58, spread: 78, startVelocity: 34, gravity: .72, scalar: .82, origin, colors: ['#fff2d8','#ff7598','#d51f52','#ffcf67','#ffffff'] });
    setPopped((current) => current.map((value, item) => item === index ? true : value));
    window.setTimeout(() => {
      setActiveNote(NOTES[index]);
      setNoteHit(true);
      sound.playHeartImpact();
      sound.playSparkle();
      window.setTimeout(() => setNoteHit(false), 520);
    }, 2250);
    window.setTimeout(() => setFlights((current) => current.filter((flight) => flight.id !== flightId)), 2600);
    if (count === 4) window.setTimeout(() => {
      sound.playFireworks();
      const colors = ['#ffffff','#ffb5cc','#ff6f9d','#ed1f62','#ffdae6'];
      const bursts = [
        { origin: { x: .02, y: .22 }, angle: 24 },
        { origin: { x: .98, y: .22 }, angle: 156 },
        { origin: { x: .03, y: .76 }, angle: 38 },
        { origin: { x: .97, y: .76 }, angle: 142 },
        { origin: { x: .5, y: .02 }, angle: 270 },
      ];
      bursts.forEach((burst, index) => window.setTimeout(() => confetti({ particleCount: 54, spread: 64, startVelocity: 47, gravity: .58, ticks: 170, scalar: .88, origin: burst.origin, angle: burst.angle, colors }), index * 115));
    }, 2280);
  };

  return <motion.section className="balloon-classic" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}>
    <img className="balloon-classic-bg" src={c.background} alt="" />
    <div className="balloon-classic-panel">
      <header className="balloon-classic-heading">
        <div>
          <motion.p initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12, duration: .65 }}><Rich text={c.kicker} /></motion.p>
          <motion.h2 initial={{ opacity: 0, x: -48, filter: 'blur(7px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ delay: .28, duration: .82, ease: [0.16, 1, 0.3, 1] }}><Rich text={c.title} /> <span><Rich text={c.titleEm} /></span></motion.h2>
        </div>
        <motion.div className="balloon-classic-count" initial={{ opacity: 0, y: -14, scaleX: .82 }} animate={{ opacity: 1, y: 0, scaleX: 1 }} transition={{ delay: .48, duration: .62 }}><i style={{ width: `${count * 20}%` }}/><span>已戳破 {count} / 5</span></motion.div>
      </header>

      <div className="balloon-classic-grid">
        <section className="balloon-classic-canopy">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .62, duration: .55 }}><Rich text={c.canopyHint} /></motion.p>
          <div className="balloon-classic-row">
            {BALLOON_STYLE.map((position, index) => <div className="balloon-classic-slot" key={index} style={{ '--h': `${position.hue}deg`, '--d': `${position.delay}s` } as CSSProperties}>
              <AnimatePresence>{!popped[index] && <motion.button type="button" aria-label={`戳破第 ${index + 1} 个气球`} onClick={(event) => popBalloon(index, event)} initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.5, opacity: 0, filter: 'blur(7px)' }} transition={{ delay: position.delay * .35 }} whileHover={{ scale: 1.12, y: -9 }} whileTap={{ scale: .9 }}><img className={`balloon-tint-${all.theme.balloon}`} src={c.balloonImage} alt=""/></motion.button>}</AnimatePresence>
              {popped[index] && <motion.div className="balloon-classic-spark" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} />}
            </div>)}
          </div>
        </section>

        <motion.aside ref={noteRef} className={`balloon-classic-notes ${noteHit ? 'is-hit' : ''}`} initial={{ opacity: 0, x: 34, scale: .97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: .78, duration: .72, ease: [0.16, 1, 0.3, 1] }}>
          {c.notesTitle && <span><Rich text={c.notesTitle} /></span>}
          <AnimatePresence mode="wait"><motion.blockquote key={activeNote} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}><Heart fill="currentColor"/><p><Rich text={activeNote} /></p></motion.blockquote></AnimatePresence>
          <div className="balloon-classic-dots">{popped.map((done,index)=><i key={index} className={done?'done':''}/>)}</div>
          <AnimatePresence>{complete ? <motion.button className="balloon-classic-next" type="button" onClick={() => { sound.playSparkle(); onNext(); }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><Rich text={c.next} /> <ArrowRight /></motion.button> : <motion.p className="balloon-classic-hint">{fill(all, c.hint, { 剩余: 5 - count })}</motion.p>}</AnimatePresence>
        </motion.aside>
      </div>
    </div>
    <AnimatePresence>{flights.map((flight) => <motion.div
      key={flight.id}
      className="love-arrow-flight"
      style={{ left: flight.startX, top: flight.startY }}
      initial={{ opacity: 0, scale: .55, x: 0, y: 0 }}
      animate={{
        opacity: [0,1,1,1,1,0],
        scale: [.55,1.08,1.18,1.08,1,.72],
        x: [0, flight.sweepX-flight.startX, flight.returnX-flight.startX, (flight.endX-flight.startX)*.62, flight.endX-flight.startX, flight.endX-flight.startX],
        y: [0, flight.highY-flight.startY, flight.lowY-flight.startY, flight.highY-flight.startY+35, flight.endY-flight.startY, flight.endY-flight.startY],
        rotate: [-18,72,178,292,365,365],
      }}
      transition={{ duration: 2.45, times: [0,.23,.48,.7,.92,1], ease: 'easeInOut' }}
    ><span className="love-arrow-aura"/><i/><Heart fill="currentColor"/></motion.div>)}</AnimatePresence>
    <motion.footer className="balloon-classic-footer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: .55 }}><CreatorCredit /></motion.footer>
  </motion.section>;
}
