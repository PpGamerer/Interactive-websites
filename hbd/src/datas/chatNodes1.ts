import { type ChatNode } from "../components/Chat";

export const chatNodesIkemen1: Record<string, ChatNode> = {
  start: {
    id: "start",
    npcText: "Happy Birthday! I made this special latte art just for you. Make a wish!",
    options: [
      { text: "That's so sweet! Thank you.", nextId: "route_sweet" },
      { text: "You remembered? I'm surprised.", nextId: "route_surprised" },
    ],
  },
  route_sweet: {
    id: "route_sweet",
    npcText: "Of course. Anything to see that smile. So, any big plans for tonight?",
    affectionChange: 1,
    options: [
      { text: "Not really, just relaxing.", nextId: "end_relax" },
      { text: "Going out with friends!", nextId: "end_party" },
    ],
  },
  route_surprised: {
    id: "route_surprised",
    npcText: "How could I forget? I've had this date marked on my calendar for weeks.",
    affectionChange: 1,
    options: [
      { text: "You're too kind.", nextId: "end_shy" },
      { text: "Okay, now I'm blushing.", nextId: "end_fluster" },
    ],
  },
  end_relax: {
    id: "end_relax",
    npcText: "Sounds perfect. Enjoy your peaceful night.",
    options: [],
  },
  end_party: {
    id: "end_party",
    npcText: "Have a blast! Don't do anything I wouldn't do.",
    options: [],
  },
  end_shy: {
    id: "end_shy",
    npcText: "Here, this cheesecake is on the house too. Enjoy!",
    options: [],
  },
  end_fluster: {
    id: "end_fluster",
    npcText: "Haha, cute. Happy Birthday again.",
    options: [],
  },
};