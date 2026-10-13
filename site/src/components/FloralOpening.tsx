import { useState } from 'react';
import { sound } from '../utils/audio';
import { useContent, Rich } from '../content';

export default function FloralOpening({ onComplete, onMusicStart }: { onComplete: () => void; onMusicStart?: () => void }) {
  const c = useContent().opening;
  const [opening, setOpening] = useState(false);
  const reveal = () => {
    if (opening) return;
    sound.toggleBGM(true);
    sound.playOpening();
    onMusicStart?.();
    setOpening(true);
    window.setTimeout(onComplete, 1650);
  };
  return (
    <div className={`floral-opening ${opening ? 'is-opening' : ''}`}>
      <div className="floral-half floral-left"><img src={c.curtain} alt="" /></div>
      <div className="floral-half floral-right"><img src={c.curtain} alt="" /></div>
      <div className="floral-vignette" />
      <button type="button" className="floral-seal" onClick={reveal}>
        <span><Rich text={c.line} /></span><strong><Rich text={c.to} /></strong><i><Rich text={c.hint} /></i>
      </button>
      <p className="floral-from"><Rich text={c.note} /></p>
    </div>
  );
}
