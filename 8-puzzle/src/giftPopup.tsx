import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './giftPopup.css';

interface GiftPopupProps {
  num: number;
  onClose: () => void;
}

const GiftPopup: React.FC<GiftPopupProps> = ({ num, onClose }) => {
  // 1. อะไร
  const [showAnswer, setShowAnswer] = useState(false);

  // 2. ปลุกใจ
  const [chickenCried, setChickenCried] = useState(false);
  const chickenAudio = useRef<HTMLAudioElement | null>(null);

  // 3. ต่อย 😗
  const [dodged, setDodged] = useState(false);

  // 4. กิน!
  const [friedChickens, setFriedChickens] = useState(0);
  const [friedChickenBites, setFriedChickenBites] = useState<number[]>([]);
  const foods = ["🥗","🍜","🍅","🍞"];
  const [foodBitesArray, setFoodBitesArray] = useState<number[]>(new Array(foods.length).fill(0));
  // clip-path สำหรับอาหารแหว่ง
  const clipPaths = [
  "inset(0% 0% 0% 0%)",
  "inset(0% 33% 0% 0%)",
  "inset(0% 66% 0% 0%)",
  ];
  // รายการอาหาร
  const addFriedChicken = () => {
    setFriedChickens(friedChickens + 1);
    setFriedChickenBites([...friedChickenBites, 0]);
  };

  // 5. ลูบหัวแมว
  const [catHappy, setCatHappy] = useState(false);
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

  // 6. เพลงสมาธิ
  const [playing, setPlaying] = useState(false);
  const meditationAudio = useRef<HTMLAudioElement | null>(null);

  // 7. ยิ้มยัง
  const [smile, setSmile] = useState<null | boolean>(null);
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

  // 8. นับแกะ
  const [sheepCount, setSheepCount] = useState(1);
  const [isSleepy, setIsSleepy] = useState(false);
  let content: React.ReactNode = null;
  
  const handleClick = () => {
    if (sheepCount < 10) {
      setSheepCount(sheepCount + 1);
    } else {
      setIsSleepy(true);
    }
  };

switch (num) {
  case 1:
    content = (
      <>
        <h2>1. What</h2>
        {!showAnswer ? (
           <button 
                onClick={() => setShowAnswer(true)}>
                  ❓
            </button>
        ) : (
          <>
            <p>
              Demo
            </p>
            <button style={{ marginTop: 5 }} onClick={onClose}>Close</button>
          </>
        )}
      </>
    );
    break;
  case 2:
    content = (
      <>
        <h2>2. Wake Heart Up</h2>
            <div style={{ fontSize: 48, margin: 12 }}>
        {chickenCried ? (
            <span className="heartbeat">💓</span>
        ) : (
            "❤️"
        )}
        </div>
        <div>
        {!chickenCried ? (
            <>
            <button
            style={{ fontSize: 32 }}
            onClick={() => {
                setChickenCried(true);
                chickenAudio.current?.play();
            }}
            >
            🐔
            </button>
            </>
        ) : (
            <>
            <p>Awake!</p>
            <button style={{ marginTop: 0 }} onClick={onClose}>Close</button>
            </>
        )}
          <audio ref={chickenAudio} 
            src="/sounds/rooster.mp3"/>
        </div>
      </>
    );
    break;
  case 3:
    content = (
      <>
        <h2>3. Punch</h2>
        <div style={{ fontSize: 48, margin: 12, position: "relative", height: 60 }}>
          {!dodged ? (
            <span
              style={{ cursor: "pointer", transition: "left 0.2s", position: "absolute", left: "38%" }}
              onClick={() => setDodged(true)}
            >
              😗
            </span>
          ) : (
            <span style={{ position: "absolute", left: "70%" }}>😗</span>
          )}
        </div>
        {!dodged ? (
          <button onClick={() => setDodged(true)}>👊</button>
        ) : (
          <>
            <div>Missed~</div>
            <button style={{ marginTop: 12 }} onClick={onClose}>Close</button>
          </>
        )}
      </>
    );
    break;
   case 4:
      content = (
        <>
  <h2>4. Eat a lot!</h2>

  <div style={{ display: "flex", gap: 20, marginBottom: 12, justifyContent: "center" }}>
    {/* อาหารปกติ */}
    {foods.map((food, index) => {
      const bites = foodBitesArray[index];
      if (bites >= clipPaths.length) return null;
      return (
        <div
          key={"food-" + index}
          onClick={() => {
            if (bites < clipPaths.length) {
              const newBites = [...foodBitesArray];
              newBites[index] = bites + 1;
              setFoodBitesArray(newBites);
            }
          }}
          style={{
            width: 100,
            height: 100,
            backgroundColor: "#f5a623",
            borderRadius: 20,
            cursor: "pointer",
            clipPath: clipPaths[bites],
            transition: "clip-path 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            userSelect: "none",
          }}
        >
          {food}
        </div>
      );
    })}

    {/* ไก่ทอดที่ขอเพิ่ม */}
    {friedChickenBites.map((bites, index) => {
      if (bites >= clipPaths.length) return null;
      return (
        <div
          key={"fried-" + index}
          onClick={() => {
            if (bites < clipPaths.length) {
              const newBites = [...friedChickenBites];
              newBites[index] = bites + 1;
              setFriedChickenBites(newBites);
            }
          }}
          style={{
            width: 100,
            height: 100,
            backgroundColor: "#f28c28",
            borderRadius: 20,
            cursor: "pointer",
            clipPath: clipPaths[bites],
            transition: "clip-path 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            userSelect: "none",
          }}
        >
          🍗
        </div>
      );
    })}
  </div>

  {foodBitesArray.every(bites => bites >= clipPaths.length) &&
  friedChickenBites.every(bites => bites >= clipPaths.length) ? (
    <>
      <div style={{ marginBottom: 12 }}>Good Job!</div>
      <button onClick={addFriedChicken}>Give me more</button>
      <button style={{ marginLeft: 12 }} onClick={onClose}>Close</button>
    </>
  ) : (
    <div>Click to eat it all!</div>
  )}
</>
      );
      break;
  case 5:
  content = (
    <>
      <h2>5. Cat</h2>
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
                    setCatHappy(true);
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
        <span style={{ position: "absolute", left: "38%" }}>
          {catHappy ? "😸" : "😾"}
        </span>
        <span
          style={{
            position: "absolute",
            left: `${handX}%`,
            cursor: "grab",
            fontSize: 32,
            top: 0,
            transition: isDragging ? "none" : "left 0.2s",
          }}
          onMouseDown={() => setIsDragging(true)}
        >
          🫳
        </span>
      </div>
      {!catHappy && <div>Drag to pat</div>}
      {catHappy && (
        <>
          <button style={{ marginTop: 12 }} onClick={onClose}>
            Close
          </button>
        </>
      )}
    </>
  );
  break;
  case 6:
    content = (
      <>
        <h2>6. Meditation</h2>
        {!playing && (<button
          onClick={() => {
            setPlaying(true);
            meditationAudio.current?.play();
          }}
        >
          🧘
        </button>
        )}
        <audio
          ref={meditationAudio}
          src="/sounds/meditate.mp3"
          loop
        />
          <>
          {playing && (
            <div style={{scale:2, marginTop: 20}}>🧘</div>
             )}
            {playing && (
            <button style={{ marginTop: 20 }} onClick={onClose}>Close</button>
            )}
          </>
      </>
    );
    break;
  case 7:
    content = (
      <>
        <h2>7. Smile?</h2>
        <div style={{ margin: 16 }}>
          <button onClick={() => setSmile(true)}>Yes</button>
          <button
            style={{
              marginLeft: 16,
              position: "relative",
              left: noBtnPos.left,
              top: noBtnPos.top,
              transition: "left 0.2s, top 0.2s"
            }}
            onMouseEnter={moveNoBtn}
            onClick={() => setSmile(false)}
          >
            No
          </button>
        </div>
        {smile === true && (
          <>
            <div>🥳</div>
            <button style={{ marginTop: 12 }} onClick={onClose}>Close</button>
          </>
        )}
      </>
    );
    break;
  case 8:
    content = (
      <>
        <h2>8. Counting Sheep</h2>
        <div className="flex flex-col items-center gap-6 mt-10 text-xl">
        <div className="relative h-32 w-full max-w-md overflow-hidden border rounded bg-blue-50 p-4">
        {/* รั้วตรงกลาง */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-3xl z-10">
          🚧
        </div>

        {/* แกะกระโดดวน */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sheepCount}
            initial={{ x: 10, y: 0, opacity: 0 }}
            animate={{ x: -50, y: [0, -60, 0], opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 2, ease: "easeInOut" },
              y: { duration: 0.6, ease: "easeInOut" },
              opacity: { duration: 0.4 },
            }}
            className="absolute bottom-0 text-3xl z-20 flex flex-col items-center"
            style={{ right: 0 }}
          >
            🐑
            <div className="text-sm text-gray-600">{sheepCount}</div>
          </motion.div>
        </AnimatePresence>
      </div>

        {!isSleepy ? (
          <>
        
            {sheepCount === 10 && <p>It all gone!</p>}
            <button onClick={() => setIsSleepy(true)}>Sleepy</button>
            <button
              className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300 transition"
              style={{ marginLeft: 16 }}
              onClick={handleClick}
            >
              Still Awake
            </button>
          </>
        ) : (
          <>
            <div className="text-2xl text-blue-600">Good night😴</div>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
      </>
    );
    break;
  default:
    content = (
      <>
        <h2>surprise</h2>
        <p>no data</p>
        <button onClick={onClose}>Close</button>
      </>
    );
}

    return (
    <div className="popup-overlay">
        <div className="popup-box">{content}</div>
    </div>
    );
};

export default GiftPopup;