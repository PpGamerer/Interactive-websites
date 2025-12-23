## Birthday Website – Mini Game Collection
Description: Interactive birthday-themed website built as a creative frontend project. The application is structured as a multi-route single-page app featuring multiple mini-games with progression-based mechanics, animations, music, and sound effects to create an engaging and immersive user experience.

# Main Routes & Features:
1. / – Rhythm Game
  - Music-based rhythm mini game
  - Birthday-themed background music
  - Timing interaction with visual feedback synchronized to music
2. /boxhunt – Phone Simulator
A simulated mobile phone interface with multiple interactive components:
  - Chat
    - Short NPC-style chatting experience
    - Visual novel–inspired chat UI (demo content)
  - BoxHunt
    - Interactive box-hunting mini game
    - Hidden interactions and exploratory gameplay
  - Note
    - In-app notes component for narrative or hints
  - Photos
    - Image gallery integrated into the phone UI
  - Music
    - Embedded Spotify playlist (UI integration)
  - Reminder Widget
    - Static calendar-style widget
    - Highlighted birthday date used as a visual hint for box puzzle codes
3. /punch – Punch-the-Box Game
  - Action-based mini game with progression-based mechanics
  - Punch boxes until their HP is depleted
  - Unlock and search for the Golden Fist to continue progression
  - Punch sound effects and animated visual feedback
4. /letter – Surprise Letter
  - Final reveal page unlocked only after completing the punching game progression
  - Displays a surprise message as the narrative conclusion
5. Audio Experience
  - Birthday music featured in the rhythm game
  - Sound effects (SFX) used across multiple pages to enhance interaction feedback

# User Flow
The website follows a progression-based flow where each mini-game unlocks the next stage:
/ (Rhythm Game) -> /boxhunt (Phone Simulator & Box Hunt) -> /punch (Punch-the-Box Game with Golden Fist) -> /letter (Final Surprise Letter)

# Tech Stack: React, Vite, JavaScript / TypeScript, CSS, React Router, Web Animations API, Web Audio API, Spotify Embed

# Live Demo: https://hbdweb-demo.vercel.app/