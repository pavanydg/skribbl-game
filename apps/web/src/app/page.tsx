// apps/web/src/app/page.tsx
"use client";

import { useSyncExternalStore } from "react";
import { socket } from "@/lib/socket";

function subscribe(cb: () => void) {
	socket.on("connect", cb);
	socket.on("disconnect", cb);
	return () => {
		socket.off("connect", cb);
		socket.off("disconnect", cb);
	};
}

export default function Home() {
	const connected = useSyncExternalStore(
		subscribe,
		() => socket.connected, // client value
		() => false, // server snapshot — avoids hydration mismatch
	);

	return (
		<main style={{ padding: 40 }}>
			<p>socket: {connected ? "connected ✅" : "disconnected ❌"}</p>
		</main>
	);
}
