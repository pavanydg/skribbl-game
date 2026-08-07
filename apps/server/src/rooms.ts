import type { Room, Player, RoomSettings } from "@skribbl/shared";

const DEFAULT_SETTINGS: RoomSettings = {
	maxPlayers: 8,
	totalRounds: 3,
	drawTimePerRound: 60,
	hints: 2,
};

const rooms = new Map<string, Room>();
// RoomCode -----> SocketId
const socketToRoom = new Map<string, string>();

function generateCode(): string {
	const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	do {
		code = Array.from(
			{ length: 4 },
			() => chars[Math.floor(Math.random() * chars.length)],
		).join("");
	} while (rooms.has(code));
	return code;
}

export function getRoom(code: string): Room | undefined {
	return rooms.get(code);
}

// O(1) scanning of every room.
export function findRoomBySocket(socketId: string): Room | undefined {
	const code = socketToRoom.get(socketId);
	return code ? rooms.get(code) : undefined;
}

export function createRoom(
	hostSocketId: string,
	hostName: string,
	settings?: Partial<RoomSettings>,
): Room {
	const code = generateCode();
	const host: Player = {
		socketId: hostSocketId,
		name: hostName,
		isHost: true,
		score: 0,
		hasGuessed: false,
	};
	const room: Room = {
		code,
		hostSocketId,
		players: [host],
		settings: { ...DEFAULT_SETTINGS, ...settings },
		gameState: null,
	};
	rooms.set(code, room);
	socketToRoom.set(hostSocketId, code);
	return room;
}

export function joinRoom(
	code: string,
	socketId: string,
	name: string,
): { room: Room } | { error: string } {
	const room = rooms.get(code);
	if (!room) return { error: "Room not found" };
	if (room.players.length >= room.settings.maxPlayers) {
		return { error: "Room is full" };
	}

	room.players.push({
		socketId,
		name,
		isHost: false,
		score: 0,
		hasGuessed: false,
	});
	socketToRoom.set(socketId, code);
	return { room };
}

export function removePlayer(socketId: string): Room | null {
	const code = socketToRoom.get(socketId);
	if (!code) return null;

	socketToRoom.delete(socketId);
	const room = rooms.get(code);
	if (!room) return null;

	const idx = room.players.findIndex((p) => p.socketId === socketId);
	if (idx !== -1) room.players.splice(idx, 1);

	if (room.players.length === 0) {
		rooms.delete(code);
		return null;
	}
	if (room.hostSocketId === socketId) {
		room.hostSocketId = room.players[0].socketId;
		room.players[0].isHost = true;
	}
	return room;
}