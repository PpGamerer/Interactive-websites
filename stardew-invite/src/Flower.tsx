import { useState, useEffect } from "react";
import "./Flower.css";
import confetti from "canvas-confetti";

const petals = ["No", "Play", "No", "Play", "No", "Play", "No", "Play!"];
const flowerImages = [
  "/images/flower/1.png",
  "/images/flower/2.png",
  "/images/flower/3.png",
  "/images/flower/4.png",
  "/images/flower/5.png",
  "/images/flower/6.png",
  "/images/flower/7.png",
  "/images/flower/8.png",
  "/images/flower/9.png", // ดอกไม้หมดกลีบ
];

function Flower({ onClose }: { onClose: () => void }) {
  const [petalIndex, setPetalIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);

   const handlePickPetal = () => {
    if (petalIndex < flowerImages.length - 1) {
      setMessage(petals[petalIndex]);
      setPetalIndex(petalIndex + 1);
    }
  };

   useEffect(() => {
    if (petalIndex === flowerImages.length - 1) {
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

    // Show result popup
    const timer = setTimeout(() => {
        setShowResultPopup(true);
      }, 600);
      // ล้าง timeout ตอน component unmount หรือ petalIndex เปลี่ยน
      return () => clearTimeout(timer);
    }
  }, [petalIndex]);

  return (
    <div className="modal-overlay">
      <div className="flower-box">
        <h2>Picking Petals</h2>

        <img
          src={flowerImages[petalIndex]}
          alt={`No. ${petalIndex}`}
          onClick={handlePickPetal}
          style={{ cursor: "pointer", userSelect: "none" }}
        />

        <div className="petal-message">
        {message || "Click at a petal!"}
        </div>

        {showResultPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <p>Have you decided yet?</p>
              <button onClick={() => { setShowResultPopup(false); onClose(); }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Flower;
