// 回忆 —— 客户要求「微信朋友圈那种版式」:头像 + 日期 + 文字 + 多张照片;照片按张数自动排版
// (1 张大图;2、4 张两列;3、5、6、7、8、9 张三列),点开可全屏左右翻看。
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { sound } from '../utils/audio';
import { useContent, Rich, fill } from '../content';
import CreatorCredit from './CreatorCredit';

const cols = (n: number) => (n === 1 ? 1 : n === 2 || n === 4 ? 2 : 3);

export default function StageMemories({ onNext }: { onNext: () => void }) {
  const all = useContent(), c = all.memories;
  const [viewer, setViewer] = useState<{ photos: string[]; i: number } | null>(null);
  return <motion.section className="moments" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: .65 }}>
    <div className="close-moments-bg" />
    <div className="moments-scroll">
      <header className="close-moments-heading">
        {c.kicker && <motion.p initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .58 }}><Rich text={c.kicker} /></motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .2, duration: .78, ease: [0.16, 1, 0.3, 1] }} className="moments-title"><b><Rich text={c.title} /></b>{c.titleEm && <span><Rich text={c.titleEm} /></span>}</motion.h2>
        {c.sub && <motion.small initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38, duration: .55 }}><Rich text={c.sub} /></motion.small>}
      </header>
      <div className="moments-feed">
        {c.posts.map((p, k) => <motion.article key={k} className="moment" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}>
          <img className="moment-avatar keep-color" src={c.avatar} alt="" />
          <div className="moment-body">
            {c.name && <b className="moment-name">{fill(all, c.name)}</b>}
            {p.text && <p className="moment-text"><Rich text={p.text} /></p>}
            {p.photos?.length > 0 && <div className={`moment-grid cols-${cols(p.photos.length)} n-${p.photos.length}`}>
              {p.photos.slice(0, 9).map((src, i) => <button type="button" key={i} onClick={() => setViewer({ photos: p.photos, i })}><img className="keep-color" src={src} alt="" loading="lazy" /></button>)}
            </div>}
            {p.date && <time className="moment-date"><Rich text={p.date} /></time>}
          </div>
        </motion.article>)}
      </div>
      <div className="close-moments-bottom">
        <motion.button type="button" whileHover={{ x: 5 }} whileTap={{ scale: .97 }} onClick={() => { sound.playTransition(); onNext(); }}><Rich text={c.button} /> <ArrowRight /></motion.button>
      </div>
      <footer className="moments-credit"><CreatorCredit /></footer>
    </div>
    <AnimatePresence>{viewer && <motion.div className="moment-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewer(null)}>
      <button type="button" className="moment-viewer-close" aria-label="关闭"><X /></button>
      <motion.img key={viewer.i} className="keep-color" src={viewer.photos[viewer.i]} alt="" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { const d = info.offset.x < -50 ? 1 : info.offset.x > 50 ? -1 : 0; if (d) setViewer((v) => v && ({ ...v, i: (v.i + d + v.photos.length) % v.photos.length })); }}
        onClick={(e) => { e.stopPropagation(); setViewer((v) => v && ({ ...v, i: (v.i + 1) % v.photos.length })); }} />
      <span className="moment-viewer-count">{viewer.i + 1} / {viewer.photos.length}</span>
    </motion.div>}</AnimatePresence>
  </motion.section>;
}
