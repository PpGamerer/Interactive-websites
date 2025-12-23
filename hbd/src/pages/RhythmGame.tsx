import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RhythmGame.css';

const notes = [
  // Happy birthday to you
  { time: 700, type: '🤛' }, //3
  { time: 1100, type: '🤛' }, //3
  { time: 1500, type: '👊' }, //2*
  { time: 1500, type: '✊' }, //1*
  { time: 2000, type: '🤛' }, //3
  { time: 2600, type: '👊' }, //1
  { time: 3500, type: '🤛' }, //3*
  { time: 3500, type: '🤜' }, //4* 1set
  // Happy birthday to you
  { time: 5100, type: '🤛' }, //3
  { time: 5400, type: '🤛' }, //3
  { time: 5900, type: '👊' }, //2*
  { time: 5900, type: '✊' }, //1*
  { time: 6700, type: '🤛' }, //3
  { time: 7300, type: '🤜' }, //4
  { time: 8100, type: '👊' }, //1*
  { time: 8100, type: '🤛' }, //3* 1set
  // Happy birthday dear [Name]
  { time: 9600, type: '🤛' }, //3
  { time: 10000, type: '🤛' }, //3
  { time: 10350, type: '👊' }, //1*
  { time: 10350, type: '✊' }, //2*
  { time: 11200, type: '👊' }, //1
  { time: 11800, type: '👊' }, //1
  { time: 12300, type: '👊' }, //1
  { time: 12600, type: '✊' }, //2*
  { time: 12600, type: '🤜' }, //3*
  { time: 13300, type: '✊' }, //1set
  // // Happy birthday to you
  { time: 15500, type: '🤛' }, //3
  { time: 15900, type: '🤛' }, //3
  { time: 16100, type: '👊' }, //1*
  { time: 16100, type: '✊' }, //2*
  { time: 17100, type: '👊' }, //1
  { time: 17600, type: '👊' }, //1
  { time: 18500, type: '✊' }, //2*
  { time: 18500, type: '🤜' }, //4* 1set
];


const keyMap = {
  d: '🤛', //1
  f: '✊', //2
  j: '👊', //3
  k: '🤜', //4
};

const reverseKeyMap = {
  '🤛': 'd',
  '✊': 'f',
  '👊': 'j',
  '🤜': 'k',
};

const HIT_WINDOW = 150; //นับคะแนน

export default function RhythmGame() {
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [activeNotes, setActiveNotes] = useState([...notes]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showReady, setShowReady] = useState(true);
  const [countdown, setCountdown] = useState(5); //ก่อนเริ่มเกม เริ่มนับถอยหลัง 5 วินาที
  const [speed, setSpeed] = useState(1); // 1 = ปกติ, <1 = เร็วขึ้น
  const animationFrameIdRef = useRef<number | null>(null);
  const [hardModeUsed, setHardModeUsed] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [pressed, setPressed] = useState<{ [emoji: string]: boolean }>({});
  const [hitEffect, setHitEffect] = useState<{ [emoji: string]: boolean }>({});
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [comboBurst, setComboBurst] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  //speed effect
  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.playbackRate = speed;
  }
  }, [speed]);
  
  //countdown effect
  useEffect(() => {
    if (!showReady) return;
    if (countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, showReady]);

  useEffect(() => {
    if (countdown === 0 && showReady) {
      setShowReady(false);
      setGameStarted(true);
    }
  }, [countdown, showReady]);

  const imageMap: Record<string, string> = {
    '👊': '/images/normal_fist.png',
    '✊': '/images/raised_fist.png',
    '🤛': '/images/left_fist.png',
    '🤜': '/images/right_fist.png',
  };

  const hitSlotRefs = {
  '🤛': useRef<HTMLDivElement>(null),
  '✊': useRef<HTMLDivElement>(null),
  '👊': useRef<HTMLDivElement>(null),
  '🤜': useRef<HTMLDivElement>(null),
  };

  const [laneLefts, setLaneLefts] = useState<Record<string, number>>({
    '👊': 0,
    '✊': 0,
    '🤛': 0,
    '🤜': 0,
  });

  const [hitLineY, setHitLineY] = useState<number | null>(null);

 useEffect(() => {
  const updateHitLineY = () => {
    const ref = hitSlotRefs['👊']; // ใช้ปุ่มไหนก็ได้ที่เป็นแถวเดียวกับ note
    if (ref.current) {
      const top = ref.current.offsetTop;
      setHitLineY(top + ref.current.offsetHeight / 2 + 3); // +16px หรือปรับเลขนี้ได้
    }
  };

  updateHitLineY();
  window.addEventListener('resize', updateHitLineY);
  return () => window.removeEventListener('resize', updateHitLineY);
  }, []);

  // const NOTE_TRACK_HEIGHT = window.innerHeight * 0.8; // 80vh ตาม CSS
  // const NOTE_HEIGHT = 48; // ตาม CSS .note ขนาด 48px
  const MAX_DISTANCE = 2000; // เวลาใน ms ที่โน้ตจะวิ่งจากบนสุดถึง hit bar (ปรับได้)
  
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
  if (!gameStarted) return;

  startTimeRef.current = performance.now();

  const loop = () => {
    setCurrentTime(performance.now() - startTimeRef.current);
    animationFrameIdRef.current = requestAnimationFrame(loop);
  };

  audioRef.current?.play();
  animationFrameIdRef.current = requestAnimationFrame(loop);

  return () => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
  };
  }, [gameStarted]);

  const activeNotesRef = useRef(activeNotes);
  const currentTimeRef = useRef(currentTime);

  useEffect(() => {
    activeNotesRef.current = activeNotes;
  }, [activeNotes]);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const handleInput = (emoji: string) => {
  setPressed(prev => ({ ...prev, [emoji]: true }));
  const matchedIndexes = activeNotes
    .map((note, idx) =>
      Math.abs(note.time / speed - currentTime) < HIT_WINDOW && note.type === emoji ? idx : -1
    )
    .filter(idx => idx !== -1);

  if (matchedIndexes.length > 0) {
    setScore((prev) => prev + 100 * matchedIndexes.length);
    setCombo((prev) => {
      const newCombo = prev + matchedIndexes.length;
      if (newCombo > bestCombo) setBestCombo(newCombo);
      return newCombo;
    });
    setComboBurst(true);
    setTimeout(() => setComboBurst(false), 200);
    setActiveNotes((prev) => {
      const newNotes = [...prev];
      matchedIndexes.sort((a, b) => b - a).forEach(idx => newNotes.splice(idx, 1));
      return newNotes;
    });
    // แสดง effect เมื่อได้คะแนน
    setHitEffect(prev => ({ ...prev, [emoji]: true }));
    setTimeout(() => setHitEffect(prev => ({ ...prev, [emoji]: false })), 200);
    // เล่นเสียงต่อย
    const punchAudio = new Audio(`/sounds/punch_sound.mp3`);
    punchAudio.volume = 0.7;
    punchAudio.play();
  }
  setTimeout(() => setPressed(prev => ({ ...prev, [emoji]: false })), 100);
  };

  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
    const emoji = keyMap[e.key as keyof typeof keyMap];
    if (!emoji) return;

    setPressed(prev => ({ ...prev, [emoji]: true }));

    const matchedIndexes = activeNotesRef.current
      .map((note, idx) =>
        Math.abs(note.time / speedRef.current - currentTimeRef.current) < HIT_WINDOW && note.type === emoji ? idx : -1
      )
      .filter(idx => idx !== -1);

    if (matchedIndexes.length > 0) {
      setScore((prev) => prev + 100 * matchedIndexes.length);
      setCombo((prev) => {
      const newCombo = prev + matchedIndexes.length;
      if (newCombo > bestCombo) setBestCombo(newCombo);
        return newCombo;
      });
      setComboBurst(true);
      setTimeout(() => setComboBurst(false), 200);

      setActiveNotes((prev) => {
        const newNotes = [...prev];
        matchedIndexes.sort((a, b) => b - a).forEach(idx => newNotes.splice(idx, 1));
        return newNotes;
      });
      setHitEffect(prev => ({ ...prev, [emoji]: true }));
      setTimeout(() => setHitEffect(prev => ({ ...prev, [emoji]: false })), 200);
       // เล่นเสียงต่อย
      const punchAudio = new Audio(`/sounds/punch_sound.mp3`);
      punchAudio.volume = 0.7;
      punchAudio.play();
    }
    setTimeout(() => setPressed(prev => ({ ...prev, [emoji]: false })), 100);
    };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const MISS_WINDOW = -150; // ms หลังจากเลย hit bar ถึงจะลบโน้ต (ปรับเลขนี้ได้)
  useEffect(() => {
  setActiveNotes((prev) => {
    const filtered = prev.filter(
      (note) => note.time / speed - currentTime > -HIT_WINDOW - MISS_WINDOW
    );
    // เพิ่มบรรทัดนี้เพื่อนับ miss
    if (prev.length > filtered.length) {
      setMissCount((miss) => miss + (prev.length - filtered.length));
      setCombo(0);
    }
    return filtered;
  });
  }, [currentTime]);

  useEffect(() => {
  const updateLanePositions = () => {
    const newLefts: Record<string, number> = {};
    for (const key in hitSlotRefs) {
      const ref = hitSlotRefs[key as keyof typeof hitSlotRefs];
      if (ref.current) {
        newLefts[key] = ref.current.offsetLeft + ref.current.offsetWidth / 2;
      }
    }
    setLaneLefts(newLefts);
  };

  updateLanePositions();
  window.addEventListener('resize', updateLanePositions);
  return () => window.removeEventListener('resize', updateLanePositions);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (gameStarted) {
    containerRef.current?.focus();
  }
  }, [gameStarted]);

 const handleGoToBoxHuntGame = () => {
  setShowNotification(true);
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
};

  return (
      <div
        ref={containerRef}
        className="rhythm-container"
        tabIndex={0}
        autoFocus
      >
      {!gameStarted && showReady &&  (
      <div className="start-popup">
        <h2>{countdown === 0 ? "" : countdown}</h2>
      </div>
    )}
      <audio
        ref={audioRef}
        src="/sounds/hbd.mp3"
        onEnded={() => {
          setGameEnded(true);
          handleGoToBoxHuntGame();
        }}
      />
      <div className="score">Score: {score}</div>
     {combo > 0 && (
      <div className={`combo-display ${comboBurst ? 'burst' : ''}`}>
        Combo: {combo}
      </div>
    )}
      <div className="note-track">
        {/* {hitLineY !== null && (
        <div
          className="hit-line"
          style={{
            position: 'absolute',
            left: '20%',
            width: '60%',
            height: '4px',
            background: '#fa765f',
            opacity: 0.7,
            zIndex: 2,
            borderRadius: '2px',
            pointerEvents: 'none',
            top: `${hitLineY}px`,
          }}
        />
      )} */}
        {activeNotes.map((note, i) => {
        const distanceToHitBar = note.time / speed - currentTime;
        const topPos =
        hitLineY !== null
          ? hitLineY - (distanceToHitBar / MAX_DISTANCE) * hitLineY
          : 0;


        const left = laneLefts[note.type] ?? 0;

        return (
          <img
            key={i}
            className="note"
            src={imageMap[note.type]}
            alt={note.type}
            style={{
              top: `${topPos}px`,
              left: `${left}px`,
              transform: 'translateX(-50%)',
            }}
          />
        );
      })}
      </div>
      <div className="hit-bar">
        {Object.entries(keyMap).map(([key, emoji]) => (
        <div
          key={key}
          ref={hitSlotRefs[emoji as keyof typeof hitSlotRefs]}
          className={`hit-slot ${pressed[emoji] ? 'active' : ''}`}
          onClick={() => handleInput(emoji)}
          style={{ position: 'relative' }}
        >
          <img src={imageMap[emoji]} alt={emoji} />
          <div className="key-label">{reverseKeyMap[emoji as keyof typeof reverseKeyMap]}</div>
           {hitEffect[emoji] && (
            <div className="hit-fx"></div>
          )}
        </div>
      ))}
      {gameEnded && (
      <div className="result-popup">
        <h2 style={{
          marginBottom: '5px',
        }}>Game Over!</h2>
        <p style={{ textAlign: 'center', marginTop: '0px' }}>
        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Combo: {bestCombo}</span>
        {''}
        <span style={{ color: '#f44336', fontWeight: 'bold', marginLeft: 16 }}>Miss: {missCount}</span>
        </p>  
        <div className="popup-buttons">
          <button onClick={() => window.location.reload()}>Again</button>
          {!hardModeUsed && ( <button onClick={() => {
                    setSpeed(1.5);
                    setGameEnded(false);
                    setGameStarted(false);
                    setShowReady(true);
                    setActiveNotes([...notes]);
                    setCountdown(5);
                    setScore(0);
                    setCurrentTime(0); 
                    setHardModeUsed(true);
                    setMissCount(0);
                    setCombo(0);
                    setBestCombo(0);
                    setShowNotification(false);
                  }}
                >
                  Hard Mode
                </button>
                )}
        </div>
      </div>
    )}
      </div>
      {/* Progress bar*/}
      <div style={{
        width: '80vw',
        height: '8px',
        background: '#f08a5d22',
        borderRadius: '4px',
        overflow: 'hidden',
        bottom: '40px',
        position: 'fixed',
      }}>
        <div style={{
          width: `${Math.min(100, (currentTime / ((notes[notes.length-1].time + 2000) / speed)) * 100)}%`,
          height: '100%',
          background: '#f08a5d',
          transition: 'width 0.2s'
        }} />
      </div>
      {/* แจ้งเตือนข้อความใหม่ */}
          {showNotification && (
      <div className="notification-popup" role="alert" aria-live="assertive">
        <img src="images/envelope.png" alt="Mail" className="mail" />
        <p>Happy Birthday!</p>
        <button
          onClick={() => {
            setShowNotification(false);
            navigate('/BoxHunt');
          }}
        >
          Read
        </button>
      </div>
    )}

    </div>
  );
}
