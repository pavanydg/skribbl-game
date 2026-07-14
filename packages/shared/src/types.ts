export type Phase = "lobby" | "choosing" | "drawing" | "turn_end" | "game_over";

export interface Player {
  socketId: string;
  name: string;
  isHost: boolean;
  score: number;
  hasGuessed: boolean; // make this false when new round starts
}

export interface RoomSettings {
  maxPlayers: number;
  totalRounds: number;
  drawTimePerRound: number;
  hints: number;
}

export interface GameState {
  round: number;
  drawerSocketId: string;
  phase: Phase;
  turnStartAt: number;        // Date.now() when the turn began
  turnEndsAt: number;         // Date.now() + drawTime*1000
  wordLength: number;         // sent to guessers so they can render blanks
  currentWord: string;        // THE ANSWER — server-only, never in an event payload
  usedWords: string[];        // so a word doesn't repeat in one game
  drawerOrder: string[];      // socketIds in draw order for this round
  turnIndex: number;          // position within drawerOrder
}

export interface Room {
  code: string;
  hostSocketId: string;
  players: Player[];
  settings: RoomSettings;
  gameState: GameState | null;
}

export interface ChatMessage {
  id: string;
  socketId: string;
  name: string;
  text: string;
  type: "chat" | "correct_guess" | "system";
  createdAt: number;
}