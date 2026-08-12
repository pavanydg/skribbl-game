import { socket } from "./socket";

export function createRoom(name: string): Promise<string> {
	return new Promise((resolve, reject) => {
		socket.emit("create_room", { name }, (res) => {
			if ("error" in res) reject(new Error(res.error));
			else resolve(res.code);
		});
	});
}

export function joinRoom(code: string, name: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("join_room", { code, name }, (res) => {
			if ("error" in res) reject(new Error(res.error));
			else resolve();
		});
	});
}
