import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import StageWelcome from './components/StageWelcome';
import StageBalloons from './components/StageBalloons';
import StageSevenDays from './components/StageSevenDays';
import StageMemories from './components/StageMemories';
import StagePhotoReel from './components/StagePhotoReel';
import StageLetter from './components/StageLetter';
import StageCake from './components/StageCake';
import StageGiftBox from './components/StageGiftBox';
import StageStarrySky from './components/StageStarrySky';
import StageCounter from './components/StageCounter';
import FloralOpening from './components/FloralOpening';
import RoseReveal from './components/RoseReveal';
import { sound } from './utils/audio';
import { useContent, themeVars, ALL_STAGES } from './content';
import type { StageKey } from './content';

export default function App() {
  const c = useContent();
  // 各页顺序与开关全部来自后台;?stage=xxx 可直接预览某一页(后台「预览」按钮用)
  const flow = useMemo(() => (c.order || ALL_STAGES).filter((k) => ALL_STAGES.includes(k) && c.enabled[k] !== false), [c]);
  const preview = new URLSearchParams(location.search).get('stage') as StageKey | null;
  const [idx, setIdx] = useState(() => Math.max(0, preview ? flow.indexOf(preview) : 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOpening, setShowOpening] = useState(c.enabled.opening !== false && !preview);
  useEffect(() => { if (c.music.src) sound.setCustomBGM(c.music.src, c.music.volume); }, [c]);

  const stage = flow[idx];
  const next = () => { setIdx((i) => (i + 1 < flow.length ? i + 1 : 0)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const restart = () => { setIdx(0); window.scrollTo({ top: 0 }); };
  const handleToggleMusic = () => setIsPlaying(sound.toggleBGM());

  const wrap = (key: string, node: ReactNode) => <div key={key} className="w-full flex justify-center">{node}</div>;
  return (
    <div className={`themed-root ${themeVars(c)['--hue-shift'] !== '0deg' || themeVars(c)['--sat'] !== '1' ? 'is-themed' : ''} h-screen bg-[#fff0f3] text-[#2f1a22] flex flex-col relative overflow-hidden selection:bg-rose-200 selection:text-rose-950`} style={themeVars(c) as CSSProperties}>
      {showOpening && <FloralOpening onComplete={() => setShowOpening(false)} onMusicStart={() => setIsPlaying(true)} />}
      <ParticleBackground />
      <div className="fixed top-4 right-4 z-50">
        <button onClick={handleToggleMusic} aria-label="开关背景音乐"
          className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md ${isPlaying ? 'bg-[#e6396e] hover:bg-[#d82b60] text-white shadow-pink-200 ring-2 ring-pink-200' : 'bg-white/80 text-[#e6396e] hover:bg-white border border-white/60 shadow-sm'}`}>
          {isPlaying ? <div className="flex items-center gap-0.5"><Volume2 className="w-4 h-4" /><span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e6396e]"></span></span></div> : <VolumeX className="w-4 h-4 text-[#6b4c53]" />}
        </button>
      </div>
      {stage === 'rose' && !showOpening && <RoseReveal onComplete={restart} />}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 sm:p-6 lg:p-10 w-full max-w-[1440px] mx-auto">
        <AnimatePresence mode="wait">
          {!showOpening && stage === 'welcome' && wrap('welcome', <StageWelcome onStart={() => { next(); setIsPlaying(true); }} />)}
          {!showOpening && stage === 'sevenDays' && wrap('seven', <StageSevenDays onNext={next} />)}
          {!showOpening && stage === 'counter' && wrap('counter', <StageCounter onNext={next} />)}
          {!showOpening && stage === 'balloons' && wrap('balloons', <StageBalloons onNext={next} />)}
          {!showOpening && stage === 'memories' && wrap('memories', <StageMemories onNext={next} />)}
          {!showOpening && stage === 'photoReel' && wrap('reel', <StagePhotoReel onNext={next} />)}
          {!showOpening && stage === 'letter' && wrap('letter', <StageLetter onNext={next} />)}
          {!showOpening && stage === 'cake' && wrap('cake', <StageCake onNext={next} />)}
          {!showOpening && stage === 'giftbox' && wrap('gift', <StageGiftBox onNext={next} />)}
          {!showOpening && stage === 'starry' && wrap('starry', <StageStarrySky onRestart={next} />)}
        </AnimatePresence>
      </main>
    </div>
  );
}
