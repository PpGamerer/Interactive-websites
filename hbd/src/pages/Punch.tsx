import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Punch.css";

type FallingFist = {
  id: number;
  left: number; // ตำแหน่ง X (vw)
};

type FallingScissor = {
  id: number;
  left: number;
};

type FallingCat = {
  id: number;
  top: number; // top position (in %)
  left: number; // left position (in %)
  src: string; // รูปแมว
};

type FallingGoldenFist = {
  id: number;
  left: number;
};

export default function Punch() {
  const navigate = useNavigate();

  const MAX_HP = 100;
  const [hp, setHp] = useState(MAX_HP);
  const [isShielded, setIsShielded] = useState(false);
  const [showScissor, setShowScissor] = useState(false);
  const [boxBroken, setBoxBroken] = useState(false);

  // สำหรับ animation หมัดและกรรไกรร่วง
  const [fallingFists, setFallingFists] = useState<FallingFist[]>([]);
  const [fistId, setFistId] = useState(0);

  const [fallingScissors, setFallingScissors] = useState<FallingScissor[]>([]);
  const [scissorId, setScissorId] = useState(0);

  
  const [fallingCats, setFallingCats] = useState<FallingCat[]>([]);
  const [catId, setCatId] = useState(0);

  const [fallingGoldenFists, setFallingGoldenFists] = useState<FallingGoldenFist[]>([]);
  const [goldenFistId, setGoldenFistId] = useState(0);
  const [fakeGoldenPunchPosition, setFakeGoldenPunchPosition] = useState({ top: '50%', left: '50%' });
  const [hasFakeGoldenPunchMoved, setHasFakeGoldenPunchMoved] = useState(false);


  const [goldenButtonActive, setGoldenButtonActive] = useState(false);
  const [goldenUnlocked, setGoldenUnlocked] = useState(false);

  const [combo, setCombo] = useState(0);
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  //Timer
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  // Ref สำหรับเสียง
  const playPunchSound = () => {
  const audio = new Audio("/sounds/punch_sound.mp3");
  audio.volume = 0.3;
  audio.play();
  };
  const playGoldenPunchSound = () => {
  const audio = new Audio("/sounds/golden_punch_sound.mp3");
  audio.volume = 0.6;
  audio.play();
  };
  const playShieldSound = () => {
  const audio = new Audio("/sounds/shield_sound.mp3");
  audio.play();
  };
  const playScissorSound = () => {
  const audio = new Audio("/sounds/scissor_sound.mp3");
  audio.play();
  };
  const [canPlayPunchSound, setCanPlayPunchSound] = useState(true);
  const [isMeming, setIsMeming] = useState(false);
  const [isUnlock, setIsUnlock] = useState(false);

  useEffect(() => {
      return () => {
        if (comboTimeoutRef.current) {
          clearTimeout(comboTimeoutRef.current);
        }
      };
    }, []);
    
  const handleGiftClick = () => {
    setIsMeming(true);
    if(goldenUnlocked) {
      setIsUnlock(true);
    }
    // รีเซ็ต isMeming หลัง animation เล่นจบ (0.2s ตาม CSS)
    setTimeout(() => {
      setIsMeming(false);
    }, 200);

  // สุ่มแมวแล้วโผล่มา
  const Memes = [
    "/images/angry_cat.png",
    "/images/smirk_cat.png",
    "/images/angry_cat_gif.gif",
    "/images/knife.gif",
    "/images/NO.jpg"
  ];
  const randomCat = Memes[Math.floor(Math.random() * Memes.length)];
  const newCat: FallingCat = {
    id: catId,
    top: Math.random() * 60 + 10,
    left: Math.random() * 60 + 20,
    src: randomCat,
  };
  setFallingCats((prev) => [...prev, newCat]);
  setCatId((prev) => prev + 1);

  // ลบแมวหลัง 1 วิ
  setTimeout(() => {
    setFallingCats((prev) => prev.filter((cat) => cat.id !== newCat.id));
  }, 1000);
  };

  const handlePunch = () => {
    if (boxBroken || goldenUnlocked) return; // กดไม่ได้ถ้ากล่องแตกแล้ว หรือโดนป้องกันอยู่
    
    if (isShielded) {
    // ถ้ามีโล่ ให้เล่นเสียงโล่
    playShieldSound();
    // แล้วไม่ต้องทำอะไรต่อ
    return;
    }
    if (!startTime) { //จับเวลา
    setStartTime(Date.now());
    }

    // เล่นเสียงหมัดถ้า cooldown ผ่าน
    if (canPlayPunchSound) {
      playPunchSound(); //sfx

      setCanPlayPunchSound(false);
      
      setTimeout(() => {
        if (!isShielded) {
        setCanPlayPunchSound(true);
        }
      }, 1500); // cooldown 
    }

    const outcome = Math.random() < 0.8 ? "damage" : "shield";

    if (outcome === "damage") {
       setCombo((prev) => prev + 1);

      // รีเซต timeout สำหรับ combo ถ้ากดไม่ทันใน 0.3 วิ จะรีเซตเป็น 0
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);

      comboTimeoutRef.current = setTimeout(() => {
        setCombo(0);
      }, 300);

      // ลด HP ตาม combo
      setHp((prev) => {
        const damage = combo > 1 ? Math.floor(combo * 1.5) : 1;
        const newHp = prev - damage;
        if (newHp <= 0) {
          setGoldenUnlocked(true);
          setEndTime(Date.now());
        }
        return newHp < 0 ? 0 : newHp;
      });

      setShowScissor(false);
      setIsShielded(false);
    } else {
      // กล่องป้องกันตัว (กระดาษ)
      setIsShielded(true);
      playShieldSound(); //sfx
      setShowScissor(true);
      setCombo(0); // โดนกัน combo หาย
    }

    // สร้างหมัดร่วง
    const newFist: FallingFist = {
      id: fistId,
      left: Math.random() * 90,
    };
    setFallingFists((prev) => [...prev, newFist]);
    setFistId((prev) => prev + 1);
  };

  const handleScissorClick = () => {
    if (boxBroken || !isShielded) return; // กดได้เฉพาะตอนมีป้องกัน
    playScissorSound(); //sfx
    // ตัดกระดาษป้องกัน แล้วต่อยต่อ
    setIsShielded(false);
    setShowScissor(false);

    // กรรไกรร่วง
    const newScissor: FallingScissor = {
      id: scissorId,
      left: Math.random() * 90,
    };
    setFallingScissors((prev) => [...prev, newScissor]);
    setScissorId(scissorId + 1);

    setCombo(0); // ไม่ถือว่าเป็นการต่อคอมโบ
  };

  const handleGoldenPunchClick = () => {
    if (goldenButtonActive) return; // ป้องกันกดซ้ำตอนอนิเมชันยังไม่จบ
    // สุ่มตำแหน่งใหม่ให้หมัดทองคำปลอมหนี
    const randomTop = `${Math.floor(Math.random() * 80)}%`;
    const randomLeft = `${Math.floor(Math.random() * 80)}%`;
    setFakeGoldenPunchPosition({ top: randomTop, left: randomLeft });
    setHasFakeGoldenPunchMoved(true);
     // เพิ่มหมัดทองคำที่ร่วง
    const newGoldenFist: FallingGoldenFist = {
      id: goldenFistId,
      left: Math.random() * 90,
    };
    setFallingGoldenFists((prev) => [...prev, newGoldenFist]);
    setGoldenFistId((prev) => prev + 1);

    playShieldSound();

    setGoldenButtonActive(true);
    setTimeout(() => {
      setGoldenButtonActive(false);
    }, 100); // หรือ 200ms ก็ได้
  };

  const handleGoldenFallingClick = () => {
  playGoldenPunchSound();
  setBoxBroken(true);
  setTimeout(() => {
      navigate("/letter");
    }, 300);
  };


  // เมื่อ animation หมัดจบ ให้ลบหมัดออกจาก state
  const handleFistAnimationEnd = (id: number) => {
    setFallingFists((prev) => prev.filter((f) => f.id !== id));
  };

  // เมื่อ animation กรรไกรจบ ให้ลบกรรไกรออกจาก state
  const handleScissorAnimationEnd = (id: number) => {
    setFallingScissors((prev) => prev.filter((s) => s.id !== id));
  };

  const handleGoldenFistAnimationEnd = (id: number) => {
  setFallingGoldenFists((prev) => prev.filter((f) => f.id !== id));
  };

  const getShakeClass = () => {
    if (combo >= 10) return "shake-strong";
    if (combo >= 6) return "shake-medium";
    if (combo >= 2) return "shake-weak";
    return "";
  };

  
  const elapsedTime = endTime && startTime ? endTime - startTime : 0;
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const minutes = Math.floor(elapsedTime / 60000);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="punch-container">
      <div className="punch-box">
        {!goldenUnlocked && !boxBroken && (
          <>
            <h2>A surprise is inside~</h2>
            <div
              className="punch-controls"
              style={{ flexDirection: "column", gap: "15px" }}
            >
              {/* animation แมวโผล่ */}
              {fallingCats.map((cat) => (
                <img
                  key={`cat-${cat.id}`}
                  src={cat.src}
                  alt="Falling Cat"
                  className="falling-cat"
                  style={{ top: `${cat.top}%`, left: `${cat.left}%`, position: 'absolute' }}
                />
              ))}
              <div className="gift-box-wrapper">
              {combo > 1 && (
                <div className="combo-indicator">🔥 x{combo}</div>
              )}
              <img
                src="/images/gift.png"
                alt="Gift Box"
                className={`gift-box ${getShakeClass()} ${isMeming ? "shake-weak" : ""}`}
                onClick={handleGiftClick}
              />
              
              </div>
              <div className="hp-bar-container"
              title={`HP  ${hp} / ${MAX_HP}`}>
              <div
                className={`hp-bar-fill ${hp <= (20/100 *MAX_HP) ? "low-hp-blink" : ""}`}
                style={{ width: `${(hp / MAX_HP) * 100}%` }}
              ></div>
            </div>

              <br></br>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <button
                  className="punch-button"
                  onClick={handlePunch}
                  disabled={boxBroken || goldenUnlocked}
                >
                  <img src="/images/normal_fist.png" alt="Punch" />
                </button>
                {showScissor && (
                  <button className="scissor-button" onClick={handleScissorClick}>
                    <img src="/images/scissor.png" alt="Cut paper shield" />
                  </button>
                )}
              </div>
              {isShielded && (
                <img
                  src="/images/paper.png"
                  alt="Paper Shield"
                  className="paper-shield"
                />
              )}
            </div>
          </>
         )} {goldenUnlocked && (
          <>
          <div className="unlock-message">
            <br></br>
            <h1> Unlock Golden Fist!</h1>
            <h4>Time: <span className="elapsed-time">{formattedTime}</span></h4>
            {/* animation แมวโผล่ */}
              {fallingCats.map((cat) => (
                <img
                  key={`cat-${cat.id}`}
                  src={cat.src}
                  alt="Falling Cat"
                  className="falling-cat"
                  style={{ top: `${cat.top}%`, left: `${cat.left}%`, position: 'absolute' }}
                />
              ))}
              {!boxBroken && (
            <img
              src="/images/gift.png"
              alt="Gift Box"
              className={`gift-box ${isMeming ? "shake-weak" : ""}`}
              onClick={handleGiftClick}
            />
              )}
            {boxBroken && (
          <img
            src="/images/boom.png"
            alt="Broken Gift Box"
            className="gift-box-broken"
          />
          )}
          <p>Find the Golden Fist</p>
          {isUnlock && (
             <button
              className={`golden-punch-button ${goldenButtonActive ? "active" : ""}`}
              onClick={handleGoldenPunchClick}
              style={{
                    position: 'absolute',
                    top: hasFakeGoldenPunchMoved ? fakeGoldenPunchPosition.top : '90%',
                    left: hasFakeGoldenPunchMoved ? fakeGoldenPunchPosition.left : '50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    background: '#f08a5d',
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    padding: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 11,
                    transition: 'top 0.3s, left 0.3s, background-color 0.3s ease',
    }}
            >
              <img src="/images/golden_fist.png" alt="Golden Punch" />
            </button>
          )}
          </div>
          </>
      )}
    </div>
      

      {/* animation หมัดร่วง */}
      {fallingFists.map((fist) => (
        <img
          key={`fist-${fist.id}`}
          src="/images/normal_fist.png"
          alt="Falling Fist"
          className="falling-fist"
          style={{ left: `${fist.left}vw` }}
          onAnimationEnd={() => handleFistAnimationEnd(fist.id)}
        />
      ))}

      {/* animation กรรไกรร่วง */}
      {fallingScissors.map((scissor) => (
        <img
          key={`scissor-${scissor.id}`}
          src="/images/scissor.png"
          alt="Falling Scissor"
          className="falling-scissor"
          style={{ left: `${scissor.left}vw` }}
          onAnimationEnd={() => handleScissorAnimationEnd(scissor.id)}
        />
      ))}

      {fallingGoldenFists.map((fist) => (
      <img
        key={`golden-fist-${fist.id}`}
        src="/images/golden_fist.png"
        alt="Falling Golden Fist"
        className="falling-fist golden"
        style={{ left: `${fist.left}vw` }}
        onClick={handleGoldenFallingClick}
        onAnimationEnd={() => handleGoldenFistAnimationEnd(fist.id)}
      />
    ))}

    </div>
  );
}