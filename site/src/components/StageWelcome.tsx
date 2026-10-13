import { useLayoutEffect, useRef } from 'react';
import { ArrowRight, Heart, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { sound } from '../utils/audio';
import { useContent, Rich, fill } from '../content';
import CreatorCredit from './CreatorCredit';

interface StageWelcomeProps {
  onStart: () => void;
}

export default function StageWelcome({ onStart }: StageWelcomeProps) {
  const all = useContent(), c = all.welcome;
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.welcome-kicker', { x: -70, opacity: 0, duration: .72 })
        .from('.welcome-title-line', { x: -90, opacity: 0, duration: .9, stagger: .22 }, '-=.28')
        .from('.welcome-copy', { x: -70, opacity: 0, duration: .72 }, '-=.3')
        .from('.welcome-route', { x: -58, opacity: 0, duration: .68 }, '-=.28')
        .from('.welcome-actions', { x: -48, opacity: 0, duration: .68 }, '-=.25')
        .from('.welcome-signature', { y: 16, opacity: 0, duration: .55 }, '-=.2')
        .from('.welcome-photo-card', { opacity: 0, x: 120, rotate: 6, duration: 1.25 }, '-=1.55');   // 客户要求:照片带白边横构图,保留滑入动画
    }, root);
    return () => context.revert();
  }, []);

  const handleStart = () => {
    sound.toggleBGM(true);
    sound.playSparkle();
    confetti({ particleCount: 36, spread: 54, origin: { y: .72 }, colors: ['#7c1733', '#c94868', '#eed4cc'] });
    onStart();
  };

  return <div ref={root} className="welcome-editorial">
    <div className="welcome-hero-bg"><img src={c.background} alt="" /></div>
    <figure className="welcome-photo-card keep-color"><img src={c.photo} alt="封面照片" /></figure>
    <div className="welcome-ambient welcome-ambient-one" />
    <div className="welcome-ambient welcome-ambient-two" />

    <section className="welcome-copy-panel">
      <p className="welcome-kicker"><Rich text={c.kicker} /></p>
      <h1>
        <span className="welcome-title-line welcome-distance-title"><Rich text={c.title1} /></span>
        <span className="welcome-title-line welcome-script"><Rich text={c.title2} /></span>
      </h1>
      <p className="welcome-copy"><Rich text={c.copy} /></p>

      {(c.cityFrom || c.cityTo) && <div className="welcome-route" aria-label={fill(all, '{出发城市}到{到达城市}')}>
        <span><MapPin />{c.cityFrom}</span>
        <i><Heart fill="currentColor" /></i>
        <span><MapPin />{c.cityTo}</span>
      </div>}

      <div className="welcome-actions">
        <button type="button" onClick={handleStart}><Rich text={c.button} /> <ArrowRight /></button>
      </div>
    </section>
    <footer className="welcome-signature"><CreatorCredit /></footer>
  </div>;
}
