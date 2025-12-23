import { type ChatNode } from "../components/Chat";

export const chatNodesIkemen2: Record<string, ChatNode> = {
  start: {
    id: "start",
    npcText: "Happy Birthday. I saw the notification. Why are you still working on a pull request?",
    options: [
      { text: "Just finishing up a few things.", nextId: "route_diligent" },
      { text: "I was just about to leave.", nextId: "route_leave" },
    ],
  },
  route_diligent: {
    id: "route_diligent",
    npcText: "Your dedication is admirable, but go home. The code will still be here tomorrow.",
    affectionChange: 1,
    options: [
      { text: "Okay, boss. Leaving now.", nextId: "end_obey" },
      { text: "Just 5 more minutes!", nextId: "end_stubborn" },
    ],
  },
  route_leave: {
    id: "route_leave",
    npcText: "Good. You deserve a break. The team got you a little something on your desk.",
    affectionChange: 1,
    options: [
      { text: "Wow, thank you so much!", nextId: "end_grateful" },
      { text: "You guys shouldn't have.", nextId: "end_modest" },
    ],
  },
  end_obey: {
    id: "end_obey",
    npcText: "Have a great evening. Don't check Slack!",
    options: [],
  },
  end_stubborn: {
    id: "end_stubborn",
    npcText: "*Sigh* Fine. But seriously, Happy Birthday.",
    options: [],
  },
  end_grateful: {
    id: "end_grateful",
    npcText: "It's a new mechanical keyboard. Hope you like it.",
    options: [],
  },
  end_modest: {
    id: "end_modest",
    npcText: "We wanted to. You're a key part of this team.",
    options: [],
  },
};