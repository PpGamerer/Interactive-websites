import React, { useState, useRef, useEffect } from "react";
import "../css/Phone.css";
import Chat, { type NPC } from "../components/Chat";
import { chatNodesIkemen1 } from "../datas/chatNodes1";
import { chatNodesIkemen2 } from "../datas/chatNodes2"
import { chatNodesIkemen3 } from "../datas/chatNodes3"
import BoxTab from "../components/BoxTab";
import PhotosTab from "../components/PhotosTab";
import ReminderWidget from "../components/ReminderWidget";
import confetti from "canvas-confetti";

const npcsInitial: NPC[] = [
  {
    id: "ikemen1",
    name: "A", // ธีม Barista / หนุ่มคาเฟ่ขี้เล่น
    profileUrl: "/images/angry_cat_gif.gif", 
    like: "Latte Art, Acoustic Music",
    dislike: "Instant coffee, Rainy days",
    bio: "A charming barista who always remembers your order. He loves making people smile with his special drinks.",
    chatBranchNodeId: "start",
    chatBranchHistory: [{ from: "npc", text: chatNodesIkemen1["start"].npcText }],
    chatNodes: chatNodesIkemen1,
    affection: 0,
  },
  {
    id: "ikemen2",
    name: "B", // ธีม Tech Lead / หัวหน้าทีมซึนเดระ
    profileUrl: "/images/cat_punch.png",
    like: "Clean Code, Mechanical Keyboards",
    dislike: "Bugs, Deploying on Fridays",
    bio: "Your reliable Team Lead. He seems strict about code quality but secretly cares deeply about his team's well-being.",
    chatBranchNodeId: "start",
    chatBranchHistory: [{ from: "npc", text: chatNodesIkemen2["start"].npcText }],
    chatNodes: chatNodesIkemen2,
    affection: 0,
  },
  {
    id: "ikemen3",
    name: "C", // ธีม UI Designer / เพื่อนร่วมงานสายอาร์ต
    profileUrl: "/images/knife.gif", 
    like: "Neon colors, Typography",
    dislike: "Comic Sans, Boring designs",
    bio: "An energetic UI Designer with a sharp eye for detail. He is always excited to show you his latest creative work.",
    chatBranchNodeId: "start",
    chatBranchHistory: [{ from: "npc", text: chatNodesIkemen3["start"].npcText }],
    chatNodes: chatNodesIkemen3,
    affection: 0,
  },
];

const itemsInitial = Array.from({ length: 5 }, (_, i) => ({
  id: `box${i + 1}`,
  name: `กล่องที่ ${i + 1}`,
}));

const PhotosImages = [
  { id: "g1", name: "", url:  "/images/cat_punch.png" },
  { id: "g2", name: "", url: "/images/knife.gif" },
  { id: "g3", name: "", url: "/images/angry_cat_gif.gif" },
  { id: "g4", name: "", url: "/images/NO.jpg" },
];

// Draggable Popup Window
function DraggableWindow({
  title,
  popupType,
  onClose,
  children,
}: {
  title: string;
  popupType?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {

  const windowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const [position, setPosition] = useState<{x: number, y: number}>(() => ({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 150,
  }));

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (posRef.current.dragging) {
        const newX = e.clientX - posRef.current.offsetX;
        const newY = e.clientY - posRef.current.offsetY;
        setPosition({ x: newX, y: newY });
      }
    }
    function onMouseUp() {
      posRef.current.dragging = false;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    if (windowRef.current) {
      posRef.current.dragging = true;
      const rect = windowRef.current.getBoundingClientRect();
      posRef.current.offsetX = e.clientX - rect.left;
      posRef.current.offsetY = e.clientY - rect.top;
    }
  }

  return (
    <div
      className={`draggable-window${
      popupType === "box" ? " draggable-window-box" :
      popupType === "note" ? " draggable-window-note" :
      popupType === "chat" ? " draggable-window-chat" :
      popupType === "photos" ? " draggable-window-photos" :
      popupType === "status" ? " draggable-window-status" :
      popupType === "music" ? " draggable-window-music" :
      popupType === "birthday" ? " draggable-window-hbd" :
      ""
      }`}
      ref={windowRef}
      style={{
        left: position.x + "px",
        top: position.y + "px",
        position: "fixed",
        transform: "none",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="window-header" onMouseDown={onMouseDown}>
        <span>{title}</span>
        <button onClick={onClose} aria-label={`ปิดหน้าต่าง ${title}`}>
          ✕
        </button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
}

const getHighestAffectionNPCs = (npcs: NPC[]) => {
  // หาค่า affection สูงสุด
  const maxAffection = Math.max(...npcs.map(npc => npc.affection));
  
  // ถ้าค่าสูงสุดเป็น 0 ไม่มีใครทักมา
  if (maxAffection === 0) {
    return [];
  }
  
  // หาคนที่มี affection เท่ากับค่าสูงสุด
  const topNPCs = npcs.filter(npc => npc.affection === maxAffection);
  
  return topNPCs;
};

const playConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 }
  });
  const audio = new Audio("/sounds/confetti.mp3");
  audio.volume = 0.3;
  audio.play();
  };

export default function Phone() {
  const [activeTab, setActiveTab] = useState<"chat" | "box" | "note" | "photos">("chat");
  const [currentChatId, setCurrentChatId] = useState<string>(npcsInitial[0].id);
  const [npcs, setNpcs] = useState<NPC[]>(npcsInitial);
  const [items] = useState(itemsInitial);
  const [noteText, setNoteText] = useState("");
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [isNpcTyping, setIsNpcTyping] = useState(false);

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
  const [birthdayNPCs, setBirthdayNPCs] = useState<NPC[]>([]);
  const [showBirthdayNotification, setShowBirthdayNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [openPopups, setOpenPopups] = useState<string[]>(["chat"]);

  const currentNPC = npcs.find((n) => n.id === currentChatId)!;

  const togglePopup = (tab: string) => {
    setOpenPopups((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    );
  };

  return (
    <>
      {/* มือถือกึ่งกลางจอ */}
      <div className="phone-container" role="region" aria-label="มือถือจีบหนุ่ม">
        <div className="phone-shell">
          {/* Status bar */}
          <div className="status-bar">
            <span className="time" aria-label="เวลาปัจจุบัน">{currentTime}</span>
            <div className="status-icons" aria-label="สัญญาณและแบตเตอรี่">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          <div style={{ marginBottom: "-10px" }}>
            <ReminderWidget birthDate={new Date(2025, 10, 6)} />
          </div>
          
          {/* พื้นที่แอปต่าง ๆ */}
          <div className="home-screen">
            <div className="app-grid" role="tablist" aria-label="หน้าแอปมือถือ">
              {["chat", "box", "note", "photos", "music"].map((tab) => (
                <button
                  key={tab}
                  className={`app-icon-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab as any);
                    togglePopup(tab);
                  }}
                  role="tab"
                  aria-selected={activeTab === tab}
                >
                  <div className="emoji">
                    {{
                      chat: "💬",
                      box: "📦",
                      note: "📝",
                      photos: "🖼️",
                      music: "🎵",
                    }[tab]}
                  </div>
                  <div className="label">
                    {{
                      chat: "Chat",
                      box: "BoxHunt",
                      note: "Note",
                      photos: "Photos",
                      music: "Music",
                    }[tab]}
                  </div>
                </button>
              ))}
              
              {/* ปุ่มเกม - ลิงก์ไปหน้าเว็บอื่น */}
              <a
                href="https://8puzzle-demo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="app-icon-button"
                role="tab"
              >
                <div className="emoji">🎮</div>
                <div className="label">Game</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Popups แยกหน้าต่าง ลากได้ */}
      {openPopups.includes("chat") && (
        <DraggableWindow
          title="Chat"
          popupType="chat"
          onClose={() =>
            setOpenPopups((prev) => prev.filter((t) => t !== "chat"))
          }
        >
          <Chat
            npcs={npcs}
            setNpcs={setNpcs}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
            isNpcTyping={isNpcTyping}
            setIsNpcTyping={setIsNpcTyping}
            setShowStatusPopup={setShowStatusPopup}
          />
          <p style={{color: "grey"}}>
          <p className="text-sm text-gray-500 text-center">
            In the full game, the NPC guides the Box Hunt.
            For this demo, find the <b>Rainbow Box (Pass: 0601)</b>
          </p>
          </p>
        </DraggableWindow>
      )}

      {/* popup แสดงสถานะ npc */}
      {showStatusPopup && (
        <DraggableWindow
          title={`${currentNPC.name}`}
          popupType="status"
          onClose={() => setShowStatusPopup(false)}
        >
          <div style={{ textAlign: "center"}}>
            <img
              src={currentNPC.profileUrl}
              alt={`${currentNPC.name} รูปโปรไฟล์ขนาดใหญ่`}
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                marginBottom: "0px",
                userSelect: "none",
                pointerEvents: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}
              draggable={false}
            />
            <p style={{ fontWeight: "bold", fontSize: "1.3em", marginBottom: "10px" }}>
              {currentNPC.name}
            </p>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
              <strong>Bio: </strong>{currentNPC.bio}
            </p>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5", marginBottom: "10px" }}>
              <strong>Like: </strong>{currentNPC.like}
            </p>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5", marginBottom: "10px" }}>
              <strong>Dislike: </strong>{currentNPC.dislike}
            </p>
          </div>
        </DraggableWindow>
      )}

      {/* แจ้งเตือนข้อความวันเกิด (popup เล็กแบบ notification) */}
    {showBirthdayNotification && (
      <div
        className="birthday-notification"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#fff",
          border: "2px solid #b8860b",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 9999,
          animation: "slideIn 0.4s ease",
        }}
      >
        <img
          src="images/envelope.png"
          alt="New message"
          style={{ width: "45px", height: "45px" }}
        />
        <div>
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>New message from {
            birthdayNPCs.length > 1 ? "many people" : birthdayNPCs[0].name
          }</p>
          <p style={{ margin: 0, color: "#555" }}>Happy Birthday!</p>
        </div>
        <button
          onClick={() => {
            setShowBirthdayNotification(false);
            setShowBirthdayMessage(true);
          }}
          style={{
            marginLeft: "15px",
            background: "#b8860b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Read the message
        </button>
      </div>
    )}

    {/* Popup ข้อความอวยพรวันเกิด */}
    {showBirthdayMessage && (
      <DraggableWindow
        title="New Message!"
        popupType="birthday"
        onClose={() => {
          setShowBirthdayMessage(false);
          setBirthdayNPCs([]);
        }}
      >
        <div style={{ padding: "20px"}}>
          {birthdayNPCs.map((npc) => (
            <div key={npc.id} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <img
                  src={npc.profileUrl}
                  alt={npc.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <strong style={{ fontSize: "1.1em" }}>{npc.name}</strong>
              </div>
              <div
                style={{
                  background: "#f0f0f0",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              >
                <p style={{ margin: 0 }}>
                  Happy Birthday!{" "}
                {npc.id === "ikemen1" && " Hope your day is as sweet as a Caramel Macchiato! ☕️✨"}
                {npc.id === "ikemen2" && " Wishing you zero bugs and a smooth deployment! 💻🚀"}
                {npc.id === "ikemen3" && " Hope your day is pixel-perfect and full of inspiration! 🎨✨"}
                </p>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => {
                setShowBirthdayMessage(false);
                setBirthdayNPCs([]);
                playConfetti();
                setTimeout(() => {
                  window.location.href = "/punch";
                }, 500);
              }}
              style={{
                padding: "12px 30px",
                fontSize: "1.1em",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Yayy 🎉
            </button>
          </div>
        </div>
      </DraggableWindow>
    )}

    {/* Box mission popup */}
    {openPopups.includes("box") && (
      <DraggableWindow
        title="BoxHunt"
        popupType="box"
        onClose={() => setOpenPopups((prev) => prev.filter((t) => t !== "box"))}
      >
        <BoxTab
          items={items}
          onCorrectCode={() => {
            const topNPCs = getHighestAffectionNPCs(npcs);

            if (topNPCs.length === 0) {
              // ถ้าไม่มีใคร affection > 0 ให้ใช้ทุกคนแทน
              const npcsToShow = topNPCs.length === 0 ? npcs : topNPCs;
              setBirthdayNPCs(npcsToShow);
              setShowBirthdayNotification(true);
              const audio = new Audio('/sounds/notification.mp3');
              audio.play();
            } else {
              // แสดง notification npc ที่มี affection สูงสุด
              setBirthdayNPCs(topNPCs);
              setShowBirthdayNotification(true);
              const audio = new Audio('/sounds/notification.mp3');
              audio.play();
            }
          }}
        />
      </DraggableWindow>
    )}


      {openPopups.includes("photos") && (
        <DraggableWindow
          title="Photos"
          popupType="photos"
          onClose={() => setOpenPopups((prev) => prev.filter((t) => t !== "photos"))}
        >
          <PhotosTab images={PhotosImages} />
        </DraggableWindow>
      )}

      {openPopups.includes("note") && (
        <DraggableWindow
          title="Note"
          popupType="note"
          onClose={() =>
            setOpenPopups((prev) => prev.filter((t) => t !== "note"))
          }
        >
          <textarea
            className="note-textarea"
            placeholder="..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            aria-label="พื้นที่จดบันทึก"
          />
        </DraggableWindow>
      )}

      {openPopups.includes("music") && (
        <DraggableWindow
          title="Music Player"
          popupType="music"
          onClose={() =>
            setOpenPopups((prev) => prev.filter((t) => t !== "music"))
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <iframe
              src={"https://open.spotify.com/embed/playlist/7hjOK2B01OdN96Nw5lKIoA?utm_source=generator&theme=0"}
              width="100%"
              height="400"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "12px" }}
            ></iframe>
          </div>
        </DraggableWindow>
      )}
    </>
  );
}