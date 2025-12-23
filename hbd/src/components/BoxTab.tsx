import React, { useState, useEffect } from 'react';
import '../css/BoxTab.css';


export interface Item {
  id: string;
  name: string;
}

interface BoxTabProps {
  items: Item[];
  onCorrectCode: () => void;
}

export default function BoxTab({ items, onCorrectCode }: BoxTabProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickedBoxId, setClickedBoxId] = useState<string | null>(null);
  const [positions, setPositions] = useState<{[key: string]: {left: number; top: number}}>({});

  const [showModal, setShowModal] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const boxSize = 60;
  const containerWidth = 475;
  const containerHeight = 485;

  useEffect(() => {
    const newPositions: {[key: string]: {left: number; top: number}} = {};
    const placedPositions: {left: number; top: number}[] = [];

    const maxAttempts = 1000;

    items.forEach((item) => {
      let attempt = 0;
      let left = 0;
      let top = 0;
      let overlapping = false;
      const minGap = 80;

      do {
        overlapping = false;
        left = Math.random() * (containerWidth - boxSize);
        top = Math.random() * (containerHeight - boxSize);

        for (const pos of placedPositions) {
          const dx = Math.abs(pos.left - left);
          const dy = Math.abs(pos.top - top);
          if (dx < boxSize + minGap && dy < boxSize + minGap) {
            overlapping = true;
            break;
          }
        }

        attempt++;
        if (attempt > maxAttempts) {
          overlapping = false;
          break;
        }
      } while (overlapping);

      newPositions[item.id] = { left, top };
      placedPositions.push({ left, top });
    });

    setPositions(newPositions);
  }, [items]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = (id: string) => {
    setClickedBoxId(id);
    setSelectedBoxId(id);
    setShowModal(true);
    setCode('');
    setError('');
  };

  const handleCodeSubmit = () => {
    const correctCode = '0601';
    const winningBoxId = 'box5';
    
    if (code === correctCode) {
      if (selectedBoxId === winningBoxId) {
        // ปิด modal ก่อน
        setShowModal(false);
        // เรียก callback เพื่อแสดงข้อความอวยพรและไปหน้า punch
        onCorrectCode();
      } else {
        setError('This is not the correct box!');
        setCode('');
      }
    } else {
      setError('Incorrect code. Try again.');
      setCode('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedBoxId(null);
    setSelectedBoxId(null);
    setCode('');
    setError('');
  };

  const boxEffects: {[key: string]: string[]} = {
    box1: ["effect-glow-red", "effect-swing"],
    box2: ["effect-wiggle-blink", "effect-glow-yellow"],
    box3: ["effect-glow-blue", "effect-bounce"],
    box4: ["effect-flicker"],
    box5: ["effect-rotate-rainbow"],
  };

  return (
    <div
      className="boxhunt-area"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        position: 'relative',
        margin: '0 auto',
      } as React.CSSProperties}
    >
      {items.map((item) => {
        const pos = positions[item.id] || { left: 0, top: 0 };
        const effects = boxEffects[item.id] || [];

        const dx = mousePos.x - (pos.left + boxSize / 2);
        const dy = mousePos.y - (pos.top + boxSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = 100;
        const visibility = Math.max(0.05, 1 - distance / maxDistance);
        
        const isLit = distance < maxDistance;
        const processedEffects = effects.map(effect => {
          if (!isLit) {
            return effect + ' inactive';
          }
          return effect;
        });
        
        return (
          <div
            key={item.id}
            className={`box ${clickedBoxId === item.id ? "clicked" : ""} ${processedEffects.join(" ")} ${isLit ? 'active' : ''}`}
            onClick={() => handleClick(item.id)}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              opacity: visibility,
              transition: 'opacity 0.1s linear, transform 0.2s ease',
            }}
            tabIndex={0}
            role="button"
            aria-label={`กล่อง ${item.name}`}
          />
        );
      })}
      <div className="boxhunt-mask" />
      
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔐</h2>
            <p>Enter 4-digit code to unlock.</p>
            <input
              type="password"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && code.length === 4) {
                  handleCodeSubmit();
                }
              }}
              placeholder="••/••"
              className="code-input"
              autoFocus
            />
            {error && <p className="error-message">❌ {error}</p>}
            <div className="modal-buttons">
              <button onClick={handleCodeSubmit} disabled={code.length !== 4}>
                ✓ OK
              </button>
              <button onClick={handleCloseModal} className="cancel-btn">
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}