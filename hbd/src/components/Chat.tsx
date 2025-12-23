import React, { useState, useEffect, useRef } from "react";
import '../css/Chat.css'

export type ChatMessage = {
  from: "player" | "npc" | "system";
  text: string;
  failed?: boolean; // เพิ่ม flag สำหรับข้อความที่ส่งไม่สำเร็จ
};

export type ChatOption = {
  text: string;
  nextId: string;
};

export type ChatNode = {
  id: string;
  npcText: string;
  options: { text: string; nextId: string }[];
  affectionChange?: number;
};

export type NPC = {
  id: string;
  name: string;
  profileUrl: string;
  like: string;
  dislike: string;
  bio: string;
  chatBranchNodeId: string;
  chatBranchHistory: ChatMessage[];
  chatNodes: Record<string, ChatNode>;
  affection: number; 
};

function ChatInput({
  onSend,
  options,
}: {
  onSend: (text: string) => void;
  options?: ChatOption[];
}) {
  const [input, setInput] = useState("");

  const send = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  if (options && options.length > 0) {
    return (
      <div className="chat-options-container">
        {options.map((option, i) => (
          <button
            key={i}
            className="chat-option-button"
            onClick={() => onSend(option.text)}
            aria-label={`เลือกตอบ: ${option.text}`}
          >
            {option.text}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        type="text"
        placeholder="พิมพ์ข้อความ..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
        aria-label="พิมพ์ข้อความแชท"
      />
      <button className="chat-send-button" onClick={send} aria-label="ส่งข้อความ">
        ส่ง
      </button>
    </div>
  );
}

export default function Chat({
  npcs,
  setNpcs,
  currentChatId,
  setCurrentChatId,
  isNpcTyping,
  setIsNpcTyping,
  setShowStatusPopup,
}: {
  npcs: NPC[];
  setNpcs: React.Dispatch<React.SetStateAction<NPC[]>>;
  currentChatId: string;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string>>;
  isNpcTyping: boolean;
  setIsNpcTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // หา NPC ปัจจุบัน
  const currentNPC = npcs.find((n) => n.id === currentChatId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (!currentNPC) {
    return <div>ไม่มีผู้เล่นนี้ในระบบ</div>;
    }

  // ฟังก์ชันเลื่อนข้อความลงล่างสุด
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [currentNPC.chatBranchHistory, isNpcTyping]);

  // ฟังก์ชันเพิ่มข้อความจากผู้เล่นลงในประวัติ
  const addPlayerMessage = (text: string, failed: boolean = false) => {
    if (!text.trim()) return;
    const newMessage: ChatMessage = { from: "player", text, failed };
    setNpcs((oldNpcs) =>
      oldNpcs.map((npc) =>
        npc.id === currentChatId
          ? { ...npc, chatBranchHistory: [...npc.chatBranchHistory, newMessage] }
          : npc
      )
    );
  };

  // ฟังก์ชันจัดการส่งข้อความ
  const handleSend = (text: string) => {
    const currentNode = currentNPC.chatNodes[currentNPC.chatBranchNodeId];
    if (!currentNode) {
      addPlayerMessage(text, true);
      return;
    }

    // เช็คว่าเป็นตัวเลือก (option) หรือไม่
    const matchedOption = currentNode.options?.find((opt) => opt.text === text);

    // ถ้ามี options แต่ผู้ใช้พิมพ์เอง (ไม่ตรงกับ option ใดๆ)
    if (currentNode.options && currentNode.options.length > 0 && !matchedOption) {
      addPlayerMessage(text, true);
      return;
    }

    // ถ้าไม่มี options เลย (แชทจบแล้ว)
    if (!currentNode.options || currentNode.options.length === 0) {
      addPlayerMessage(text, true);
      return;
    }

    if (matchedOption) {
      const nextNode = currentNPC.chatNodes[matchedOption.nextId];
      if (!nextNode) {
        addPlayerMessage(text, true);
        return;
      }

      // ตัวอย่าง: อัปเดต affection ขึ้นอยู่กับคำตอบ
      // สมมติว่าใน chatNodes มี property 'affectionChange' ที่บอกว่าเพิ่ม/ลดเท่าไหร่
      const affectionChange = nextNode.affectionChange ?? 0;

      // อัปเดต NPC: เปลี่ยน branchNodeId และเพิ่มข้อความผู้เล่น
      setNpcs((prevNpcs) =>
        prevNpcs.map((npc) =>
          npc.id === currentChatId
            ? {
                ...npc,
                chatBranchNodeId: matchedOption.nextId,
                chatBranchHistory: [
                  ...npc.chatBranchHistory,
                  { from: "player", text: matchedOption.text },
                ],
                affection: Math.max(0, npc.affection + affectionChange),
              }
            : npc
        )
      );

      // เริ่มสถานะ NPC กำลังพิมพ์
      setIsNpcTyping(true);

      // จำลอง NPC ตอบกลับหลัง delay
      setTimeout(() => {
        setNpcs((prevNpcs) =>
          prevNpcs.map((npc) =>
            npc.id === currentChatId
              ? {
                  ...npc,
                  chatBranchHistory: [
                    ...npc.chatBranchHistory,
                    { from: "npc", text: nextNode.npcText },
                  ],
                }
              : npc
          )
        );
        setIsNpcTyping(false);
      }, 1500);
    }
  };

  return (
    <>
      {/* รายชื่อ NPC */}
      <div className="chat-list" role="list" aria-label="รายชื่อผู้คุย">
        {npcs.map((npc) => (
          <button
            key={npc.id}
            onClick={() => setCurrentChatId(npc.id)}
            className={`chat-user ${npc.id === currentChatId ? "active" : ""}`}
            aria-current={npc.id === currentChatId ? "true" : undefined}
            aria-label={`คุยกับ ${npc.name}`}
          >
            {npc.name}
          </button>
        ))}
      </div>
      
        <div className="affection">
          affection:{" "}
          <span className="heart-container">
            {"❤️".repeat(currentNPC.affection)
              .split("")
              .map((h, i) => (
                <span key={i} className="heartbeat">
                  {h}
                </span>
              ))}
          </span>
        </div>

      {/* ส่วนแสดงข้อความ */}
      <div
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
      >
        {currentNPC.chatBranchHistory.map((msg, i) =>
          msg.from === "npc" ? (
            <div key={i} className="message-block npc-block">
              <div className="message npc">
                <img
                  src={currentNPC.profileUrl}
                  alt={`${currentNPC.name} รูปโปรไฟล์`}
                  className="profile-pic"
                  onClick={() => setShowStatusPopup(true)}
                />
                <span>{msg.text}</span>
              </div>
            </div>
          ) : msg.from === "system" ? (
            <div key={i} className="message system">
              {msg.text}
            </div>
          ) : (
            <div key={i} className={`message player ${msg.failed ? 'failed' : ''}`}>
              {msg.failed && <span className="failed-icon">⚠️ </span>}
              {msg.text}
            </div>
          )
        )}
        {isNpcTyping && (
          <div className="npc-typing-indicator" aria-live="assertive">
            {currentNPC.name} is typing
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}

        {/* div ว่างที่ใช้เลื่อนลงล่างสุด */}
        <div ref={messagesEndRef} />
      </div>

     {/* อินพุตและตัวเลือกตอบ */}
    {!isNpcTyping && (
      <ChatInput
        onSend={handleSend}
        options={currentNPC.chatNodes[currentNPC.chatBranchNodeId]?.options}
      />
    )}

    </>
  );
}