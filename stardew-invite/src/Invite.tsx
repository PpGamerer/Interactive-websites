import { useState, useEffect, useRef } from "react";
import Flower from "./Flower";
import "./Invite.css";
import confetti from "canvas-confetti";

type ChickenParticle = {
  id: number;
  left: number;      // ตำแหน่ง X (vw)
  delay: number;     // delay ก่อน animation เริ่ม (s)
};

function Invite() {
  const [showFlower, setShowFlower] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [ghostMessage, setGhostMessage] = useState<string | null>(null);
  const [junimos, setJunimos] = useState<string[]>([]);

  // เก็บตำแหน่งเมาส์ปัจจุบัน
  const currentMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // เก็บเวลาที่เริ่มเพื่อคำนวณ sine wave
  const startTime = useRef<number>(0);
  // เก็บ ref ของ cat element
  const catRef = useRef<HTMLElement | null>(null);
  const ghostCatMessages = [
  "Yes, this is me",
  "Really..?",
  "This cat will ghosting you~",
  "Its fine;-;"
  ];
    // เพิ่ม ref สำหรับข้อความ
  const catMessageRef = useRef<HTMLDivElement | null>(null);

  const [chickens, setChickens] = useState<ChickenParticle[]>([]);
  const nextId = useRef(0); // ใช้ ref แทน state

  const junimoImages = [
  "/images/junimos/green.png",
  "/images/junimos/blue.png",
  "/images/junimos/orange.png",
  "/images/junimos/purple.png",
  "/images/junimos/yellow.png",
  ];

  const myUserId = "Demo"; //Discord user ID 

  useEffect(() => {
    const interval = setInterval(() => {
      const newFist: ChickenParticle = {
        id: nextId.current,
        left: Math.random() * 95, // กระจายซ้าย-ขวา
        delay: Math.random() * 2, // สุ่มดีเลย์เล็กน้อย
      };

      nextId.current += 1;

      setChickens((prev) => {
        const updated = [...prev, newFist];
        return updated.length > 20 ? updated.slice(updated.length - 15) : updated;
      });
    }, 1500); // ทุก 1.5 วิ

    return () => clearInterval(interval); // ล้างตอน unmount
  }, []);

  useEffect(() => {
  if (!rejected) return;

  const cat = document.querySelector(".ghost-cat") as HTMLElement;
  if (!cat) return;
  catRef.current = cat;

  cat.style.visibility = "visible";
  cat.classList.remove("fade-in");
  setTimeout(() => {
    cat.classList.add("fade-in");
  }, 50);

  startTime.current = performance.now();

  // เช็คว่าเป็นมือถือหรือไม่ (ง่าย ๆ โดยใช้ window.innerWidth)
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    // --- สำหรับ desktop, ตามเมาส์ ---
    if (mousePos) {
      cat.style.left = mousePos.x + "px";
      cat.style.top = mousePos.y + "px";
      currentMousePos.current = { x: mousePos.x, y: mousePos.y };
    }

    const moveCat = (e: MouseEvent) => {
      const catWidth = cat.offsetWidth;
      const catHeight = cat.offsetHeight;

      let left = e.clientX;
      let top = e.clientY;

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + catWidth > window.innerWidth) left = window.innerWidth - catWidth;
      if (top + catHeight > window.innerHeight) top = window.innerHeight - catHeight;

      currentMousePos.current = { x: left, y: top };
    };

    window.addEventListener("mousemove", moveCat);

    let animationFrameId: number;

    const animate = (time: number) => {
      if (!catRef.current) return;

      const elapsed = time - startTime.current;

      const amplitude = 4;
      const frequency = 1;
      const offsetY = amplitude * Math.sin((2 * Math.PI * frequency * elapsed) / 1000);

      const x = currentMousePos.current.x;
      const y = currentMousePos.current.y + offsetY;

      const catWidth = catRef.current.offsetWidth;
      const catHeight = catRef.current.offsetHeight;

      let left = x;
      let top = y;

      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + catWidth > window.innerWidth) left = window.innerWidth - catWidth;
      if (top + catHeight > window.innerHeight) top = window.innerHeight - catHeight;

      catRef.current.style.left = left + "px";
      catRef.current.style.top = top + "px";

      animationFrameId = requestAnimationFrame(animate);
          // ...ใน animate หรือ animateMobile...
      if (catRef.current && catMessageRef.current) {
        // สมมติว่าแมวอยู่ที่ left, top
        const catRect = catRef.current.getBoundingClientRect();
        catMessageRef.current.style.left = catRect.left + catRect.width / 2 + 20 + "px"; // เยื้องขวา 20px
        catMessageRef.current.style.top = (catRect.top - 40) + "px"; // อยู่เหนือแมว 40px
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", moveCat);
      cancelAnimationFrame(animationFrameId);
    };
  } else {
    // --- สำหรับมือถือ, ลอยไปลอยมาเอง ---
    const catWidth = cat.offsetWidth;
    const catHeight = cat.offsetHeight;

    // เริ่มตำแหน่งแบบสุ่ม
    let posX = Math.random() * (window.innerWidth - catWidth);
    let posY = Math.random() * (window.innerHeight - catHeight);
    let dirX = (Math.random() > 0.5 ? 1 : -1) * 1; // ความเร็วแนวนอน px/frame
    let dirY = (Math.random() > 0.5 ? 1 : -1) * 1; // ความเร็วแนวตั้ง px/frame

    let animationFrameId: number;
    const BOTTOM_PADDING = 5;
    const animateMobile = () => {
      if (!catRef.current) return;

      const screenWidth = document.documentElement.clientWidth;
      const screenHeight = document.documentElement.clientHeight;

      posX += dirX;
      posY += dirY;

      if (posX <= 0) {
        posX = 0;
        dirX = -dirX;
      } else if (posX + catWidth >= screenWidth) {
        posX = screenWidth - catWidth;
        dirX = -dirX;
      }

      if (posY <= 0) {
        posY = 0;
        dirY = -dirY;
      } else if (posY + catHeight >= screenHeight - BOTTOM_PADDING) {
        posY = screenHeight - catHeight - BOTTOM_PADDING;
        dirY = -dirY;
      }

      posX = Math.min(Math.max(0, posX), screenWidth - catWidth);
      posY = Math.min(Math.max(0, posY), screenHeight - catHeight - BOTTOM_PADDING);

      catRef.current.style.left = posX + "px";
      catRef.current.style.top = posY + "px";

      animationFrameId = requestAnimationFrame(animateMobile);

      if (catRef.current && catMessageRef.current) {
        const catRect = catRef.current.getBoundingClientRect();
        catMessageRef.current.style.left = catRect.left + catRect.width / 2 + 20 + "px";
        catMessageRef.current.style.top = (catRect.top - 40) + "px";
      }
    };

    animationFrameId = requestAnimationFrame(animateMobile);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }
}, [rejected, mousePos]);


  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setRejected(true);
    const random = ghostCatMessages[Math.floor(Math.random() * ghostCatMessages.length)];
    setGhostMessage(random);
  };

  const handleAccept = () => {
  setRejected(false);
  setAccepted(true);
  //Junimos!
  const shuffled = [...junimoImages].sort(() => 0.5 - Math.random());
  setJunimos(shuffled.slice(0, 5));
  // Confetti!
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 }
  });
  // Play confetti sound
  const audio = new Audio("/sounds/confetti.mp3");
  audio.volume = 0.3;
  audio.play();
  };

  const handleUnsure = () => {
    setRejected(false);
    setUnsure(true);
  }

  return (
    <div className="invite-page">
      {chickens.map((chicken) => (
        <img
          key={chicken.id}
          src="/images/chicken.png"
          className="chicken-float"
          style={{
            left: `${chicken.left}vw`,
            animationDelay: `${chicken.delay}s`,
          }}
          alt="Fist"
        />
      ))}
      
      <img
        src="/images/logo.png"
        alt="Stardew Valley Logo"
        className="stardew-logo"
      />

      <div className="invite-text-box">
        <div className="invite-text">
        <h1>Let's play~ </h1>
        <p>The desert is waiting for us, Let's play Stardew Valley!
        </p>
        </div>
      </div>

      <div className="buttons-wrapper">
        <img src="/images/chicken.png" alt="chicken" className="chicken chicken-left" />

        <div className="buttons">
          <button onClick={handleAccept}>Yes~</button>
          <button onClick={handleReject}>No!</button>
          <button onClick={handleUnsure}>Maybe..</button>
        </div>
        {accepted && (
        <div className="popup-overlay">
            <div className="popup-content">
            <h2>Yay Time&Date are up to you!</h2>
            <p>(Not for Demo, The button is linked to Discord)</p>
            {junimos.map((src, index) => (
            <img key={index} src={src} className={`junimo-icon position-${index}`} alt="junimo" />
            ))}
            <button
                  onClick={() => {
                    setAccepted(false);
                    // window.open(`discord://discord.com/users/${myUserId}`, "_blank")
                  }
                  }
                >
                  Chat now
                </button>

            </div>
        </div>
        )}

        {unsure && (
          <div className="popup-overlay">
            <div className="popup-content">
              <p>I have an idea🥺</p>
              <button onClick={() => { 
                setUnsure(false);
                setShowFlower(true);}}>
                Ok
              </button>
              <button onClick={() => { 
                setUnsure(false);
                }}>
                Nah
              </button>
            </div>
          </div>
        )}



        <img src="/images/chicken.png" alt="chicken" className="chicken chicken-right" />
      </div>

      {showFlower && <Flower onClose={() => setShowFlower(false)} />}

      {rejected && (
        <img
          src="/images/NO.jpg"
          alt="Ghost Cat"
          className="ghost-cat"
        />   
    )}
    {ghostMessage && rejected && (
      <div
          ref={catMessageRef}
          className={`ghost-cat-message ${rejected ? "visible" : ""}`}
        >
          {ghostMessage}
        </div>
      )}
      <img src="/images/desert.png" className="desert-bg" alt="desert" />
    </div>
  );
}

export default Invite;
