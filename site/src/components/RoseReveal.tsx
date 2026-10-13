import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';
import { CREATOR } from '../creator';

type Phase = 'idle' | 'bloom' | 'photos' | 'message';

export default function RoseReveal({ onComplete }: { onComplete: () => void }) {
  const c = useContent().rose;
  const FINALE_PORTRAITS = c.prints.slice(0, 3).map((p, i) => ({ id: ['left', 'center', 'right'][i], url: p.photo, caption: p.caption }));
  const [phase, setPhase] = useState<Phase>('idle');
  const roses = useMemo(() => [
    { count: 18, rx: 47, ry: 48, size: 192 },
    { count: 16, rx: 38, ry: 39, size: 174 },
    { count: 14, rx: 29, ry: 30, size: 150 },
    { count: 12, rx: 20, ry: 21, size: 132 },
    { count: 8, rx: 10, ry: 11, size: 120 },
    { count: 1, rx: 0, ry: 0, size: 150 },
  ].flatMap((ring, ringIndex) => Array.from({ length: ring.count }, (_, index) => {
    const angle = (index / ring.count) * Math.PI * 2 - Math.PI / 2 + ringIndex * .08;
    return { x: 50 + Math.cos(angle) * ring.rx, y: 50 + Math.sin(angle) * ring.ry, size: ring.size + (index % 3) * 12, rotation: angle * 180 / Math.PI + 90, delay: ringIndex * .18 + index * .045 };
  })), []);
  useEffect(() => {
    if (phase !== 'bloom') return;
    // 客户 10-13:不要照片环节,开花后直接进最后一页;后台可以再打开
    const photos = window.setTimeout(() => setPhase(c.showPhotos ? 'photos' : 'message'), 2450);
    return () => window.clearTimeout(photos);
  }, [phase, c.showPhotos]);
  return <div className={`rose-reveal phase-${phase}${c.showPhotos ? '' : ' no-photos'}`}>
    <div className="rose-stars" />
    <div className="rose-wreath" aria-hidden="true">{roses.map((r,i)=><img key={i} src={c.roseImage} alt="" style={{'--x':`${r.x}%`,'--y':`${r.y}%`,'--size':`${r.size}px`,'--r':`${r.rotation}deg`,'--delay':`${r.delay}s`} as CSSProperties}/>)}</div>
    <button type="button" className="rose-trigger" onClick={()=>{sound.playOpening();sound.playArrowFlight();window.setTimeout(()=>sound.playSparkle(),420);setPhase('bloom');}} aria-label="打开生日玫瑰"><img src={c.roseImage} alt="一朵深红色的生日玫瑰"/><span><Rich text={c.tap} /></span></button>
    <div className="rose-photo-title" aria-hidden="true"><p><Rich text={c.title} /></p><strong><span><Rich text={c.happy} /></span><small><Rich text={c.small} /></small></strong></div>
    <div className="rose-photo-prints">{FINALE_PORTRAITS.map((photo,i)=><figure className={`rose-print print-${i+1}`} key={photo.id}><span className="rose-print-heart"><Heart fill="currentColor"/></span><img className="keep-color" src={photo.url} alt=""/><figcaption><Rich text={photo.caption} /></figcaption></figure>)}<button className="rose-message-next" type="button" onClick={()=>{sound.playTransition();setPhase('message');}}><Rich text={c.next} /></button></div>
    <div className="birthday-reveal"><p><Rich text={c.revealKicker} /></p><h1><Rich text={c.revealLine} /><br/><strong><Rich text={c.revealName} /></strong></h1><span><Rich text={c.revealSub} /></span><button type="button" onClick={onComplete}><Rich text={c.again} /> <ArrowRight aria-hidden="true"/></button></div>
    <footer className="rose-credit">模板作者 <a href={CREATOR.repository} target="_blank" rel="noreferrer">{CREATOR.name}</a></footer>
  </div>;
}
