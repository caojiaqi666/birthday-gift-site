import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { useContent, Rich, fill } from '../content';
import CreatorCredit from './CreatorCredit';

interface StagePhotoReelProps { onNext: () => void; }

export default function StagePhotoReel({ onNext }: StagePhotoReelProps) {
  const all = useContent(), c = all.photoReel;
  const gallery = useMemo(() => c.photos.map((src, index) => ({ id: `gallery-${String(index + 1).padStart(2, '0')}`, src })), [c.photos]);
  const half = Math.ceil(gallery.length / 2);
  const firstRow = gallery.slice(0, half);
  const secondRow = gallery.slice(half).length ? gallery.slice(half) : gallery;

  return <motion.section className="portrait-reel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .65 }}>
    <img className="portrait-reel-bg" src={c.background} alt="" />
    <header className="portrait-reel-heading">
      <motion.h2 initial="hidden" animate="visible">
        <motion.span className="block" variants={{ hidden: { opacity: 0, y: 28, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: .12, duration: .76, ease: [0.16, 1, 0.3, 1] } } }}><Rich text={c.line1} /></motion.span>
        <motion.span className="block" variants={{ hidden: { opacity: 0, y: 28, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: .32, duration: .76, ease: [0.16, 1, 0.3, 1] } } }}><Rich text={c.line2} /> <motion.span animate={{ textShadow: ['0 0 0 rgba(255,255,255,0)', '0 0 24px rgba(255,255,255,.5)', '0 0 0 rgba(255,255,255,0)'] }} transition={{ delay: 1.1, duration: 2.4, repeat: Infinity }}><Rich text={c.line2Em} /></motion.span></motion.span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 16, letterSpacing: '.02em' }} animate={{ opacity: 1, y: 0, letterSpacing: '.08em' }} transition={{ delay: .72, duration: .72, ease: [0.16, 1, 0.3, 1] }}><Rich text={c.sub} /></motion.p>
    </header>

    <div className="portrait-reel-rows" aria-label={fill(all, '一组给你的照片：{收件人}')}>
      <PhotoRow photos={firstRow} direction="forward" />
      <PhotoRow photos={secondRow} direction="reverse" />
    </div>

    <motion.button className="portrait-reel-next" type="button" whileHover={{ x: 6 }} whileTap={{ scale: .97 }} onClick={() => { sound.playTransition(); onNext(); }}>
      <Rich text={c.button} /> <ArrowRight />
    </motion.button>
    <footer><CreatorCredit /></footer>
  </motion.section>;
}

function PhotoRow({ photos, direction }: { photos: { id: string; src: string }[]; direction: 'forward' | 'reverse' }) {
  return <div className="portrait-reel-viewport"><div className={`portrait-reel-track ${direction}`}>
    {[0, 1, 2, 3].map((copy) => <div className="portrait-reel-group" key={`copy-${copy}`} aria-hidden={copy > 0}>
      {photos.map((photo) => <figure key={`${photo.id}-${copy}`}><img className="keep-color" src={photo.src} alt={copy === 0 ? '回忆照片' : ''} onError={(event) => { event.currentTarget.src = './demo/portrait-1.png'; }} /></figure>)}
    </div>)}
  </div></div>;
}
