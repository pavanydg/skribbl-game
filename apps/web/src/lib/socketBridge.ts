import { socket } from "./socket";
import { useGameStore } from "./store";

export function initSocketBridge() {
	socket.on("connect", () => useGameStore.getState().setConnected(true));
	socket.on("disconnect", () => useGameStore.getState().setConnected(false));
	socket.on("room_state", (state) => useGameStore.getState().setRoom(state));
}