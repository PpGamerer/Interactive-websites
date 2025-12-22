import { useState, useEffect, useRef } from 'react';
import './puzzle.css';
import GiftPopup from './giftPopup';

const initialBoard = [1, 2, 3, 4, 5, 6, 7, 8, null];
const TILE_SIZE = 80; // ขนาด tile รวม gap

// ฟังก์ชันสุ่มเรียงเลข (Fisher–Yates shuffle)
function shuffle(array: (number | null)[]) {
  const arr = [...array];
  for (let i = arr.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Puzzle() {
  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [giftMode, setGiftMode] = useState(false);
  const [giftNum, setGiftNum] = useState<number | null>(null);

  // สุ่มกระดานทันทีเมื่อ component โหลด
  useEffect(() => {
    let shuffled;
    do {
      shuffled = shuffle(initialBoard);
    } while (!isSolvable(shuffled));
    setBoard(shuffled);
  }, []);

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started]);

  const isWin = (board: (number | null)[]) => {
    for (let i = 0; i < 8; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[8] === null;
  };

  const isAdjacent = (index1: number, index2: number) => {
    const x1 = index1 % 3;
    const y1 = Math.floor(index1 / 3);
    const x2 = index2 % 3;
    const y2 = Math.floor(index2 / 3);
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
  };

  const handleClick = (index: number) => {
  const emptyIndex = board.indexOf(null);
  if (isAdjacent(index, emptyIndex)) {
    if (!started) setStarted(true);
    const newBoard = [...board];
    [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
    setBoard(newBoard);
    setMoves(m => m + 1);
    if (isWin(newBoard)) {
      setShowPopup(true);
      if (timerRef.current) clearInterval(timerRef.current); 
    }
  }
  };

  const handleNewGame = () => {
    let shuffled;
    do {
      shuffled = shuffle(initialBoard);
    } while (!isSolvable(shuffled));
    setBoard(shuffled);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setGiftMode(false);
    setShowPopup(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ฟังก์ชันตรวจสอบว่าเกม solvable หรือไม่
  const isSolvable = (arr: (number | null)[]) => {
    const nums = arr.filter((n) => n !== null) as number[];
    let inversions = 0;
    for (let i = 0; i < nums.length - 1; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  return (
    <div>
    <div className="game-container">
    <div className="game-header">
      <h1>8 Puzzle</h1>
      <p>Arrange the numbers in the correct order! Click to move the numbers to the empty spaces.</p>
    </div>
    <div className="game-board">
       {board.map((num, idx) => {
            const x = (idx % 3) * TILE_SIZE;
            const y = Math.floor(idx / 3) * TILE_SIZE;
            // เช็คว่าตำแหน่งถูกต้อง (ยกเว้น null)
            const isCorrect = num !== null && num === idx + 1;
            return (
            <div
                key={idx}
                className={`tile${num === null ? " empty" : ""}${isCorrect ? " correct" : ""}`}
                style={{
                transform: `translate(${x}px, ${y}px)`,
                }}
                 onClick={
                  num !== null
                    ? giftMode
                      ? () => setGiftNum(num)
                      : () => handleClick(idx)
                    : undefined
                }
            >
                {num}
            </div>
            );
        })}
        </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Congrats!</h2>
            <p>moves: {moves} <br />time: {seconds} sec</p>
            <div className="popup-actions">
              <button onClick={() => { setShowPopup(false); setGiftMode(true); alert("Try clicking each numbers again!"); }}>Surprise</button>
              <button onClick={() => setShowPopup(false)}>close</button>
            </div>
          </div>
        </div>
      )}
      {giftNum !== null && (
      <GiftPopup num={giftNum} onClose={() => setGiftNum(null)} />
    )}
    </div>
    <div className="controls">
        <button onClick={handleNewGame}>Try Again</button>
    {/* <button
    onClick={() => {
      setBoard([1,2,3,4,5,6,7,8,null]);
      setShowPopup(true);
      setStarted(false); // หยุดนับเวลา
      if (timerRef.current) clearInterval(timerRef.current);
    }}
    style={{ marginLeft: 10, background: "#4CAF50", color: "#fff" }}
  >
    โกง
  </button> */}
    </div>
   <div className="info-row">
    <div className="info-box">
      moves: {moves} 
    </div>
    <div className="info-box">
      time: {seconds}s
    </div>
    </div>
    </div>
  );
}

export default Puzzle;
