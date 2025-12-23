import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Intro.css";
import confetti from "canvas-confetti";

type FistParticle = {
  id: number;
  left: number;      // ตำแหน่ง X (vw)
  delay: number;     // delay ก่อน animation เริ่ม (s)
};

export default function Intro() {
  const navigate = useNavigate();
  const [fists, setFists] = useState<FistParticle[]>([]);
  const nextId = useRef(0); // ใช้ ref แทน state
  //sfx
  const playPunchSound = () => {
  const audio = new Audio("/sounds/confetti.mp3");
  audio.volume = 0.3;
  audio.play();
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFist: FistParticle = {
        id: nextId.current,
        left: Math.random() * 95, // กระจายซ้าย-ขวา
        delay: Math.random() * 2, // สุ่มดีเลย์เล็กน้อย
      };

      nextId.current += 1;

      setFists((prev) => {
        const updated = [...prev, newFist];
        return updated.length > 20 ? updated.slice(updated.length - 15) : updated;
      });
    }, 1500); // ทุก 1.5 วิ

    return () => clearInterval(interval); // ล้างตอน unmount
  }, []);

  const playConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 }
  });
  };

  const handlePunchClick = () => {
    playPunchSound(); //sfx
    playConfetti(); // แสดง confetti
    navigate("/punch");
  };
  return (
    <div className="intro-container">
      {/* พื้นหลัง fist */}
      {fists.map((fist) => (
        <img
          key={fist.id}
          src="/images/yay.png"
          className="fist-float"
          style={{
            left: `${fist.left}vw`,
            animationDelay: `${fist.delay}s`,
          }}
          alt="Fist"
        />
      ))}

      {/* ข้อความ + ปุ่ม */}
      <div className="birthday-text">
         <h3>Happy Birthday!</h3>
        <button className="punch-button"
                style={{ justifyContent: "center" }}
                onClick={handlePunchClick}>
        <img src="/images/normal_fist.png" alt="Fist" />
        </button>
        </div>
        <audio src="/sounds/hbd.mp3" autoPlay loop/>
    </div>
  );
}
