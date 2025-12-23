import { type ChatNode } from "../components/Chat";

export const chatNodesIkemen3: Record<string, ChatNode> = {
  start: {
    id: "start",
    npcText: "HAPPY BIRTHDAY!! 🎉 Look, I designed a custom birthday card for you! Do you like the font?",
    options: [
      { text: "It's amazing! I love it!", nextId: "route_love" },
      { text: "It's... very colorful!", nextId: "route_colorful" },
    ],
  },
  route_love: {
    id: "route_love",
    npcText: "Yes! I knew this color palette was perfect for you. I'm gonna print it out.",
    affectionChange: 1,
    options: [
      { text: "Can I get the PDF file too?", nextId: "end_file" },
      { text: "Let's go celebrate!", nextId: "end_celebrate" },
    ],
  },
  route_colorful: {
    id: "route_colorful",
    npcText: "Too much? Maybe I should tone down the neon gradients... But hey, it stands out!",
    affectionChange: 0,
    options: [
      { text: "It's unique, like me.", nextId: "end_unique" },
      { text: "Maybe a little less neon.", nextId: "end_fix" },
    ],
  },
  end_file: {
    id: "end_file",
    npcText: "Sent! Check your inbox. Have the best day ever!",
    options: [],
  },
  end_celebrate: {
    id: "end_celebrate",
    npcText: "Way ahead of you. I know a great spot for cake.",
    options: [],
  },
  end_unique: {
    id: "end_unique",
    npcText: "Exactly! That's the spirit. Happy Birthday!",
    options: [],
  },
  end_fix: {
    id: "end_fix",
    npcText: "Okay, v2 coming right up. But first, cake!",
    options: [],
  },
};