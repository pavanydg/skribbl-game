import { createServer } from "http";
import { Server } from "socket.io";
import type {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@skribbl/shared";

const httpServer = createServer();

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
	cors: {
		origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("disconnected:", socket.id);
	});
});

const PORT = Number(process.env.PORT ?? 3001);
httpServer.listen(PORT, () => {
	console.log(`socket server on :${PORT}`);
});