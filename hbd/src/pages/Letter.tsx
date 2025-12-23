import React, { useState } from 'react';
import '../css/Letter.css';
import envelopeImg from '/images/envelope.png';

type FallingGoldenFist = {
  id: number;
  left: number;
};
const Letter: React.FC = () => {
  const [opened, setOpened] = useState(false);

  const [goldenButtonActive, setGoldenButtonActive] = useState(false);
  const [fallingGoldenFists, setFallingGoldenFists] = useState<FallingGoldenFist[]>([]);
  const [goldenFistId, setGoldenFistId] = useState(0);

  const handleGoldenFistAnimationEnd = (id: number) => {
  setFallingGoldenFists((prev) => prev.filter((f) => f.id !== id));
  };

   const handleOpen = () => {
    setOpened(true);
  };

  const playGoldenPunchSound = () => {
  const audio = new Audio("/sounds/golden_punch_sound.mp3");
  audio.volume = 0.6;
  audio.play();
  };

  const handleGoldenPunch = () => {
    if (goldenButtonActive) return; // ป้องกันกดซ้ำตอนอนิเมชันยังไม่จบ
     // เพิ่มหมัดทองคำที่ร่วง
    const newGoldenFist: FallingGoldenFist = {
      id: goldenFistId,
      left: Math.random() * 90,
    };
    setFallingGoldenFists((prev) => [...prev, newGoldenFist]);
    setGoldenFistId((prev) => prev + 1);

    playGoldenPunchSound();

    setGoldenButtonActive(true);
    setTimeout(() => {
      setGoldenButtonActive(false);
    }, 100); // หรือ 200ms ก็ได้
  };
  return (
  <div className='letter-page-container'>
    {!opened ? (
        <div className="envelope-wrapper" onClick={handleOpen}>
          <img src={envelopeImg} alt="envelope" className="envelope-image" />
          <p className="click-text">Click to open the letter</p>
        </div>
      ) : (
        <div>
    <div className="letter-container">
    <div className="envelope">
    <div className="letter">
      <p className="greeting">Dear You</p>
      <p className="message">
        Happy Birthday✨<br />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo nulla deserunt cupiditate obcaecati perspiciatis delectus, natus reiciendis veniam soluta repudiandae iusto impedit maxime dolores qui facere praesentium facilis perferendis consectetur!
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque corporis officia fuga, adipisci possimus rerum libero dolorum ratione? Corrupti quo non fugiat magni dolorem libero necessitatibus, amet ipsa delectus odit!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum veritatis laudantium, odit debitis obcaecati at, nostrum assumenda eos corrupti, praesentium harum alias. Asperiores facere et iusto doloribus aliquam optio alias?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste rerum deleniti eos aspernatur nostrum. Harum corporis saepe nobis eligendi optio vero impedit praesentium beatae, magnam minima, tenetur assumenda debitis numquam.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius exercitationem nulla excepturi, iure at reiciendis, dolor animi recusandae quaerat sit delectus voluptatibus voluptatum saepe ipsam quo molestias esse nam! Distinctio.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum quidem ullam optio beatae dolorum quos mollitia possimus natus aliquid ea delectus modi laudantium hic autem, eaque necessitatibus! Explicabo, sit facilis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores. Doloribus, voluptatum. Quisquam, cumque! Doloremque, cumque. Quos, asperiores.
      </p>
      <p className="signature">From me</p>
    </div>
  </div>
  </div>
    <div>
      <button
      className="golden-punch-button2"
      onClick={handleGoldenPunch}
      >
      <img src="/images/golden_fist.png" alt="Golden Punch" />
      </button>
    </div>
    </div>

  )}
    <div style={{
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    zIndex: 1000,
  }}>
  </div>
  
  {fallingGoldenFists.map((fist) => (
      <img
        key={`golden-fist-${fist.id}`}
        src="/images/golden_fist.png"
        alt="Falling Golden Fist"
        className="falling-fist2 golden"
        style={{ left: `${fist.left}vw` }}
        onAnimationEnd={() => handleGoldenFistAnimationEnd(fist.id)}
      />
    ))}
</div>
  );
};

export default Letter;
