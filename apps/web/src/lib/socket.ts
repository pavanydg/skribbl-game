import { io, type Socket } from "socket.io-client";
import type {
	ClientToServerEvents,
	ServerToClientEvents,
} from "@skribbl/shared";

const URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	URL,
	{ autoConnect: true },
);