import { create } from "zustand"
import type { RoomState } from "@skribbl/shared";

interface GameStore {
	room: RoomState | null;
	connected: boolean;
	setRoom: (room: RoomState) => void;
    setConnected: (connected: boolean) => void;
    clearRoom: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
	room: null,
	connected: false,
	setRoom: (room) => set({ room }),
	setConnected: (connected) => set({ connected }),
	clearRoom: () => set({ room: null }),
}));