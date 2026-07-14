// Client->Server and Server->Client event names + payload types go here.
import type { Player, RoomSettings, ChatMessage, Phase } from "./types";

export interface PublicGameState {
  round: number;
  totalRounds: number;
  drawerSocketId: string;
  drawerName: string;
  phase: Phase;
  turnEndsAt: number;    // clients render a countdown from this
  wordLength: number;    // blanks only, never the word
}

export interface RoomState {
  code: string;
  hostSocketId: string;
  players: Player[];
  settings: RoomSettings;
  game: PublicGameState | null;
}

// Revealed when turn is over
export interface TurnEndResult {
  word: string;
  scores: { socketId: string; score: number; gained: number }[];
}

export interface DrawPoint {
  x: number;      // normalized 0..1
  y: number;      // normalized 0..1
  prevX: number;
  prevY: number;
  color: string;
  size: number;
}

export interface ClientToServerEvents {
  create_room: (
    payload: { name: string; settings?: Partial<RoomSettings> },
    ack: (res: { code: string } | { error: string }) => void
  ) => void;

  join_room: (
    payload: { code: string; name: string },
    ack: (res: { ok: true } | { error: string }) => void
  ) => void;

  start_game: () => void;
  choose_word: (payload: { word: string }) => void;
  draw: (payload: DrawPoint) => void;
  clear_canvas: () => void;
  guess: (payload: { text: string }) => void;
  play_again: () => void;
}

export interface ServerToClientEvents {
  room_state: (payload: RoomState) => void;         // full room, sent on any change
  word_choices: (payload: { words: string[] }) => void; // drawer ONLY — the 3 choices
  turn_started: (payload: PublicGameState) => void;  // everyone — no word
  draw_broadcast: (payload: DrawPoint) => void;
  clear_broadcast: () => void;
  chat_message: (payload: ChatMessage) => void;
  turn_ended: (payload: TurnEndResult) => void;
  game_over: (payload: { players: Player[] }) => void;
  error_msg: (payload: { message: string }) => void;
}