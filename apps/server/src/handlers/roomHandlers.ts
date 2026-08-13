import type { Server, Socket } from "socket.io";
import type {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@skribbl/shared";
import { createRoom, getRoom, joinRoom, removePlayer, roomToPublic } from "../rooms.js";

type IO = Server<ClientToServerEvents, ServerToClientEvents>;
// each client has its own socket connection to server!
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

function handleLeave(io: IO, socket: IOSocket) {
	const room = removePlayer(socket.id);
	if (room) {
		socket.leave(room.code);
		io.to(room.code).emit("room_state", roomToPublic(room));
	}
}

export function registerRoomHandlers(io: IO, socket: IOSocket) {
    socket.on("create_room", ({ name }, ack) => {
        const room = createRoom(socket.id, name);
        socket.join(room.code); // make the particular client join the room - This is socket.io's internal function
        ack({ code: room.code });
        io.to(room.code).emit("room_state", roomToPublic(room))
    });

    socket.on("join_room", ({ code, name }, ack) => {
        const result = joinRoom(code, socket.id, name);
        if ("error" in result) {
            ack({ error: result.error });
			return;
        }
        socket.join(code);
		ack({ ok: true });
		io.to(code).emit("room_state", roomToPublic(result.room));
    })

    socket.on("check_room", ({ code }, ack) => {
		ack(Boolean(getRoom(code)));
	});

    socket.on("leave_room", () => handleLeave(io, socket));
	socket.on("disconnect", () => handleLeave(io, socket));
  
}