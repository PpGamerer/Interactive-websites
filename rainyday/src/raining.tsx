import { useState, useEffect, useRef } from "react";
import "./raining.css";
import confetti from "canvas-confetti";

export default function AmegaFuttaBirthday() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(23);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [drops, setDrops] = useState<Array<{ id: number; left: number; top: number }>>([]);
  const dropIdRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const [umbrellaX, setUmbrellaX] = useState<number | null>(null);

  // Dog state รวมตำแหน่งและทิศทาง
  const [dogState, setDogState] = useState({ x: 0, dir: 1 });
  const [dogRunning, setDogRunning] = useState(false);
  // Lives
  const [lives, setLives] = useState(3);
  const dogRef = useRef<HTMLDivElement>(null);

  // Notification
  const [showNotification, setShowNotification] = useState(false);
  const [EnvelopeOpened, setEnvelopeOpened] = useState(false);

  const [rainEnabledInGame, setRainEnabledInside] = useState(false); // คุมว่าจะ spawn ฝนมั้ย
  const [rainEnabledOutside, setRainEnabledOutside] = useState(false); // คุมว่าจะ spawn ฝนมั้ย (นอกเกม)
  const [cheatMessage, setCheatMessage] = useState<string | null>(null);

  const [rainCombo, setRainCombo] = useState(0); // นับ combo ต่อเนื่อง
  const [showPreSurprise, setShowPreSurprise] = useState(false);
  const [preSurpriseOption, setPreSurpriseOption] = useState<"pet" | "sleep" | null>(null);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
  // เริ่มเสียงฝน
  if (audioRef.current) {
    audioRef.current.volume = 0.3;
    audioRef.current.play();
  }
  // เริ่ม spawn ฝนด้านนอก
  setRainEnabledOutside(true);
}, []);

  const playConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 }
  });
  };
  //sfx
    const playConfettiSound = () => {
    const audio = new Audio("/confetti.mp3");
    audio.volume = 0.3;
    audio.play();
    };
  const [noBtnPos, setNoBtnPos] = useState({ top: 0, left: 0 });
  const moveNoBtn = () => {
  let newLeft = 0;
  let newTop = 0;
  const distanceThreshold = 50; // ต้องห่างจากตำแหน่งเดิมอย่างน้อย 50px

  let attempt = 0;
  do {
    // สุ่มตำแหน่งใหม่ภายในช่วงกว้างขึ้น
    newLeft = Math.random() * 400 - 200; // -200px ถึง +200px
    newTop = Math.random() * 200 - 100;  // -100px ถึง +100px
    attempt++;
    // ป้องกันไม่ให้วนลูปไม่สิ้นสุด
    if (attempt > 10) break;
  } while (
    Math.abs(newLeft - noBtnPos.left) < distanceThreshold &&
    Math.abs(newTop - noBtnPos.top) < distanceThreshold
  );

  setNoBtnPos({ left: newLeft, top: newTop });
  };

  const [Happy, setHappy] = useState(false);
  const [handX, setHandX] = useState(43);
  const [isDragging, setIsDragging] = useState(false);

  const [pettingCount, setPettingCount] = useState(0);
  const [lastHandX, setLastHandX] = useState<number | null>(null);
  const [lastDirection, setLastDirection] = useState<"left" | "right" | null>(null);
  useEffect(() => {
    function handleMouseUp() {
      setIsDragging(false);
      setLastHandX(null);
      setLastDirection(null);
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  type FallingRain = {
    id: number;
    left: number;
  };

  
  type FallingMeme = {
    id: number;
    top: number; // top position (in %)
    left: number; // left position (in %)
    src: string; // meme image source
  };

  const [rainButtonActive, setrainButtonActive] = useState(false);
  const [fallingRain, setfallingRain] = useState<FallingRain[]>([]);
  const [RainId, setRainId] = useState(0);

  const [fallingMemes, setFallingMemes] = useState<FallingMeme[]>([]);
  const [memeId, setCatId] = useState(0);

  const handleRainAnimation = (id: number) => {
  setfallingRain((prev) => prev.filter((f) => f.id !== id));
  };
  
  const handleRain = () => {
    if (rainButtonActive) return;

    const newRain: FallingRain = {
      id: RainId,
      left: Math.random() * 90,
    };
    setfallingRain((prev) => [...prev, newRain]);
    setRainId((prev) => prev + 1);

    setrainButtonActive(true);
    setTimeout(() => setrainButtonActive(false), 100);

    // เพิ่ม combo ต่อเนื่อง
    setRainCombo((prev) => {
    const nextCombo = prev + 1;

    if (nextCombo >= 3) {
      // เพิ่มดีเลย์ก่อนแสดง popup
      setTimeout(() => {
        setShowPreSurprise(true);
        setEnvelopeOpened(false);
      }, 700); // ดีเลย์ 0.7 วินาที ปรับได้ตามต้องการ

      return 0; // รีเซ็ต combo หลัง trigger
    }

    return nextCombo;
});
  };

  useEffect(() => {
    if (rainCombo === 0) return;
    const timeout = setTimeout(() => setRainCombo(0), 500); // ไม่กด 0.5 วินาที → รีเซ็ต
    return () => clearTimeout(timeout);
  }, [rainCombo]);

  const handleDogClick = () => {
    if (!dogRef.current) return;

    const dogRect = dogRef.current.getBoundingClientRect();

    const Memes = ["strawberry-dance.gif"];
    const randomMeme = Memes[Math.floor(Math.random() * Memes.length)];

    const newMeme: FallingMeme = {
      id: memeId,
      // โผล่ตรงหัวน้องหมา (เลื่อนขึ้นไป ~5px จาก top)
      top: dogRect.top + 5,
      left: dogRect.left + dogRect.width / 2,
      src: randomMeme,
    };

    setFallingMemes((prev) => [...prev, newMeme]);
    setCatId((prev) => prev + 1);

    setTimeout(() => {
      setFallingMemes((prev) => prev.filter((meme) => meme.id !== newMeme.id));
    }, 1000);
  };


  // ตั้งตำแหน่งร่มและหมากลาง stage ตอน mount
  useEffect(() => {
    if (stageRef.current) {
      setUmbrellaX(stageRef.current.clientWidth / 2 - 60);
      setDogState({ x: stageRef.current.clientWidth / 2 - 22, dir: -1 }); // เดินไปทางซ้าย
    }
  }, []);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameFinished(true);
      setDogRunning(false);
      setGameStarted(false);
      setShowNotification(true);
      playConfettiSound();
      playConfetti();
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameFinished, timeLeft]);
// ฝนตอนเล่นเกม
useEffect(() => {
  let spawnInterval: ReturnType<typeof setInterval>;
  if (gameStarted && rainEnabledInGame) {
    spawnInterval = setInterval(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const w = stage.clientWidth;
      const left = Math.random() * (w - 4);
      const id = ++dropIdRef.current;
      setDrops((prev) => [...prev, { id, left, top: -20 }]);
      setTimeout(() => {
        setDrops((prev) =>
          prev.map((d) => (d.id === id ? { ...d, top: stage.clientHeight + 10 } : d))
        );
        setTimeout(() => {
          setDrops((prev) => prev.filter((d) => d.id !== id));
        }, 4200);
      }, 20);
    }, 120);
  }
  return () => clearInterval(spawnInterval);
}, [gameStarted, rainEnabledInGame]);

// ฝนหน้าอื่น ๆ
useEffect(() => {
  let spawnInterval: ReturnType<typeof setInterval>;
  if (!gameStarted && rainEnabledOutside) {
    spawnInterval = setInterval(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const w = stage.clientWidth;
      const left = Math.random() * (w - 4);
      const id = ++dropIdRef.current;
      setDrops((prev) => [...prev, { id, left, top: -20 }]);
      setTimeout(() => {
        setDrops((prev) =>
          prev.map((d) => (d.id === id ? { ...d, top: stage.clientHeight + 10 } : d))
        );
        setTimeout(() => {
          setDrops((prev) => prev.filter((d) => d.id !== id));
        }, 4200);
      }, 20);
    }, 400);
  }
  return () => clearInterval(spawnInterval);
}, [!gameStarted, rainEnabledOutside]);


  // Dog movement (วิ่งเร็วขึ้น + สุ่ม speed)
  useEffect(() => {
    if (!gameStarted || gameFinished) return;

    const interval = setInterval(() => {
      if (!stageRef.current) return;
      const stageWidth = stageRef.current.clientWidth;

      setDogState(({ x, dir }) => {
        // สุ่มความเร็วเล็กน้อยแต่ละ tick (เช่น 6–12 px)
        const speed = 6 + Math.random() * 6;

        let nextX = x + dir * speed;
        let nextDir = dir;

        if (nextX <= 0) {
          nextX = 0;
          nextDir = 1;
        } else if (nextX >= stageWidth - 44) {
          nextX = stageWidth - 44;
          nextDir = -1;
        }

        return { x: nextX, dir: nextDir };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted, gameFinished]);

// Dog random turn (หันสุ่มๆ ระหว่างวิ่ง)
useEffect(() => {
  if (!gameStarted || gameFinished) return;

  const randomTurn = setInterval(() => {
    setDogState((prev) => {
      // 30% โอกาสเปลี่ยนทิศ
      if (Math.random() < 0.4) {
        return { ...prev, dir: prev.dir * -1 };
      }
      return prev;
    });
  }, 2000); // ทุก 2 วิลองสุ่มเปลี่ยนทิศ

  return () => clearInterval(randomTurn);
}, [gameStarted, gameFinished]);


// Collision detection
useEffect(() => {
  if (!gameStarted || gameFinished) return;
  const dogEl = dogRef.current;
  const umbrellaEl = document.querySelector(".umbrella") as HTMLDivElement | null;
  if (!dogEl) return;

  const dogRect = dogEl.getBoundingClientRect();
  const umbrellaRect = umbrellaEl?.getBoundingClientRect();

  drops.forEach((d) => {
    const dropEl = document.getElementById(`drop-${d.id}`);
    if (!dropEl) return;
    const dropRect = dropEl.getBoundingClientRect();

    const isOnUmbrella =
      umbrellaRect &&
      dropRect.left < umbrellaRect.right &&
      dropRect.right > umbrellaRect.left &&
      dropRect.top < umbrellaRect.bottom &&
      dropRect.bottom > umbrellaRect.top;

    const hitDog =
      dropRect.left < dogRect.right &&
      dropRect.right > dogRect.left &&
      dropRect.top < dogRect.bottom &&
      dropRect.bottom > dogRect.top;

    // ถ้าโดนร่ม → ลบทิ้ง
    if (isOnUmbrella) {
      setDrops((prev) => prev.filter((drop) => drop.id !== d.id));
    }

    // ถ้าโดนน้องหมา (แต่ไม่โดนร่ม) → หักหัวใจ
    if (hitDog && !isOnUmbrella) {
      setLives((prev) => {
        if (prev > 1) return prev - 1;

        // หัวใจหมด → กลับหน้าแรก
        setGameFinished(false);
        setGameStarted(false);
        setDogRunning(false);
        setShowNotification(false);
        setNoBtnPos({ left: 0, top: 0 });
        setLives(3);
        setTimeLeft(23);
        setDrops([]);
        if (stageRef.current) {
          setUmbrellaX(stageRef.current.clientWidth / 2 - 60);
          setDogState({ x: stageRef.current.clientWidth / 2 - 22, dir: -1 }); // เดินไปทางซ้าย
        }
        return 0;
      });
      setDrops((prev) => prev.filter((drop) => drop.id !== d.id));
    }
  });
}, [drops, gameStarted, gameFinished]);



  const startGame = () => {
    setGameStarted(true);
    setDogRunning(true);
    setTimeLeft(23);
    setGameFinished(false);
    setShowNotification(false);
    setEnvelopeOpened(false);
    setRainEnabledInside(true); // เริ่มเกม → ฝนตก
  };

  const toggleRainSound = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.volume = 0.3;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    if (!gameStarted) {
      // นอกเกม → ปรับฝนตามเสียง
      setRainEnabledOutside(!audioRef.current.paused);
    } else {
      // ในเกม → ฝนไม่เปลี่ยน
      setCheatMessage("อย่าโกงสิ~");
      setTimeout(() => setCheatMessage(null), 2000);
    }
  };

  // Drag umbrella
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left - 60;
      x = Math.max(0, Math.min(rect.width - 120, x));
      setUmbrellaX(x);
    }
    function onMouseUp() {
      setDragging(false);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  const startDrag = () => setDragging(true);

  return (
    <div className="page">
      <header className="header">
        <h1>雨胸に晴れますように</h1>
        <div className="controls">
          <button onClick={toggleRainSound}>
          { audioRef.current?.paused ? "☁️" : "🌧️"}
        </button>

        </div>
      </header>

      <main className="stage" ref={stageRef}>
        {/* Drops */}
        {drops.map((d) => (
        <div key={d.id} id={`drop-${d.id}`} className="drop" style={{ left: d.left, top: d.top }} />
        ))}


        <audio ref={audioRef} loop src="/rain.mp3" />

        {/* HUD */}
        {gameStarted && !gameFinished && (
        <div className="hud">
          ⏳ {timeLeft}s &nbsp; {"❤️".repeat(lives)}
        </div>
        )}

        {/* Dog */}
        <div
          ref={dogRef}
          className={`dog ${dogRunning ? "run" : ""}`}
          style={{
            left: dogState.x,
            transform: gameStarted
              ? dogState.dir === 1
                ? "scaleX(-1)"
                : "scaleX(1)"
              : "scaleX(1)", // ยังไม่เริ่ม = หันซ้าย
          }}
          onClick={handleDogClick}
        >
          🐕
        </div>  
          {fallingMemes.map((meme) => (
          <img
            key={meme.id}
            src={meme.src}
            className="dog-meme"
            style={{
              position: "fixed",
              top: meme.top,
              left: meme.left,
              width: "80px", // 👉 ปรับขนาดตรงนี้
              transform: "translate(-50%, -100%)", // จัดให้อยู่กลางหัว
              pointerEvents: "none",
            }}
          />
        ))}


        {/* Umbrella */}
        {umbrellaX !== null && (
          <div className="umbrella" style={{ left: `${umbrellaX}px` }} onMouseDown={startDrag}>
            ☂️
          </div>
        )}


        {/* Intro */}
        {!gameStarted && !gameFinished && (
          <div className="intro">
            <p>
              t's raining right now, but the pup wants to go for a walk! <br>
              </br>The kind owner is holding an umbrella to keep the little one dry. ☂️
            </p>
          <div className="controls">
          <div style={{ margin: 16 }}>
          <button onClick={startGame}>Let's Go~</button>
          <button
            style={{
              marginLeft: 16,
              position: "relative",
              left: noBtnPos.left,
              top: noBtnPos.top,
              transition: "left 0.2s, top 0.2s"
            }}
            onMouseEnter={moveNoBtn}
          >
            No!
          </button>
        </div>
          </div>
          </div>
        )}
        {/* แจ้งเตือนข้อความใหม่ */}
          {showNotification && (
      <div className="notification-popup" role="alert" aria-live="assertive">
        <img src="/envelope.png" alt="Mail" className="mail" />
        <p>Yay! 🎉</p>
        <button
          onClick={() => {
            setShowNotification(false);
            setEnvelopeOpened(true);
          }}
        >
          Read the Message
        </button>
      </div>
    )}

  {/* Cheat Message */}
  {cheatMessage && (
    <div className="cheat-warning">
      {cheatMessage}
    </div>
  )}
  {/* Result */}
  {EnvelopeOpened && (
    <div className="result">
      <p>
        You did it! Thank you for helping the pup stay dry. 🐕☂️ <br/>
        Here's a little something for you. Triple-Click the raindrop button below to see! 💧
      </p>

        <button
        className="rain-button"
        onClick={handleRain}
        >
        <img src="/rain.png" />
        </button>
        {/* แสดง combo เฉพาะตอนเกิน 1 */}
        {rainCombo > 1 && (
        <div className="combo-indicator">💧 x{rainCombo}</div>
              )}
    </div>
  )}

         {fallingRain.map((rain) => (
          <img
            key={`rain-${rain.id}`}
            src="/rain.png"
            className="falling-rain"
            style={{ left: `${rain.left}vw` }}
            onAnimationEnd={() => handleRainAnimation(rain.id)}
          />
        ))}

        {showPlaylist && (
          <div className="popup3">
          <div className="playlist">
        <h3>🎵 Playlist for You🎵</h3>
       <p>
        (Spotify embeded playlist)<br/>
        </p>
        <iframe
          src=""
          width="100%"
          height="405"
          allow="encrypted-media"
        ></iframe>
        </div>
      </div>
      )}

        {showPreSurprise && (
          <div className="popup">
            <p>Can I get some pets first?🤲</p>
            <div className="options">
              <button
                onClick={() => {
                  setPreSurpriseOption("pet"); // ไปลูบหัว
                  setShowPreSurprise(false);
                  setShowSurprise(true);
                }}
              >
                🫳🫳🫳
              </button>
              <button
                onClick={() => {
                  setPreSurpriseOption("sleep"); // หน้า ";-;" พร้อมปุ่ม 🫳
                  setShowPreSurprise(false);
                }}
              >
                🫵🛏️💤
              </button>
            </div>
          </div>
        )}

        {preSurpriseOption === "sleep" && (
      <div className="popup">
        <div className="angry-meme-wrapper">
      <img
        src="/angry_cat.gif"
        alt="angry cat"
        className="angry-meme"
      />
        </div>
        <button
          onClick={() => {
            setShowPreSurprise(false);
            setPreSurpriseOption(null);
            setShowSurprise(true); // ไปหน้าของแถม
          }}
        >
          🫳
        </button>
      </div>
    )}

      {showSurprise && (
          <div className="popup2">
        <div
      style={{
        fontSize: 48,
        margin: 12,
        position: "relative",
        height: 60,
        userSelect: "none",
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        let x = ((e.clientX - box.left) / box.width) * 100;
        x = Math.min(90, Math.max(0, x));

        if (lastHandX !== null) {
          const direction = x > lastHandX ? "right" : "left";

          if (Math.abs(x - 38) < 10) {
            if (lastDirection !== direction) {
              // เพิ่มจำนวนรอบการลูบ
              setPettingCount((count) => {
                const newCount = count + 1;
                if (pettingCount >= 3) {  // ตัวอย่าง 3 รอบก็พอ
                  setHappy(true);
                }
                return newCount;
              });
            }
          }
          setLastDirection(direction);
        }
        setLastHandX(x);
        setHandX(x);
      }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseDown={() => {
          setIsDragging(true);
          setLastHandX(null);
          setLastDirection(null);
        }}
      >
        <span style={{ position: "absolute", left: "25%" }}>
          {Happy ? "🥺" : "😎"}
        </span>
        <span
          style={{
            position: "absolute",
            left: `${handX}%`,            
            top: -9,
            cursor: "grab",
            fontSize: 32,
            transition: isDragging ? "none" : "left 0.2s",
          }}
          onMouseDown={() => setIsDragging(true)}
        >
          🫳
        </span>
      </div>
      {!Happy && <div>Drag to pat</div>}
      {Happy && (
        <>
          <button style={{ marginTop: 12}} onClick={() => (setShowPlaylist(true), setShowSurprise(false))}>
            🎁
          </button>
          </>
       )}
       </div>
      )}
      </main>

      <footer className="footer">
        <p>from 0</p>
      </footer>
    </div>
  );
}