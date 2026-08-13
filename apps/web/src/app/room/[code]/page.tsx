"use client";

import { use, useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function RoomPage({
	params,
}: {
	params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
	const room = useGameStore((s) => s.room);
	const [copied, setCopied] = useState(false);
	const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
		if (room?.code === code) return; // already a member
		socket.emit("check_room", { code }, (exists) => {
			if (!exists) router.replace("/");
		});
	}, [code, room, router]);

	useEffect(() => {
		// Cancel a leave scheduled by Strict Mode's dev-only mount/cleanup/remount cycle.
		if (leaveTimeoutRef.current) {
			clearTimeout(leaveTimeoutRef.current);
			leaveTimeoutRef.current = null;
		}
		return () => {
			leaveTimeoutRef.current = setTimeout(() => {
				socket.emit("leave_room");
				useGameStore.getState().clearRoom();
			}, 0);
		};
  }, [code]);
  
	function copyCode() {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	if (!room) {
		return (
			<main className="grid min-h-screen place-items-center bg-gray-50">
				<p className="text-gray-400">Joining room {code}…</p>
			</main>
		);
	}

	return (
		<main className="grid min-h-screen place-items-center bg-gray-50 p-6">
			<div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
				<header className="mb-6 flex items-start justify-between">
					<div>
						<span className="text-xs uppercase tracking-widest text-gray-400">
							Lobby
						</span>
						<h1 className="mt-1 text-3xl font-bold tracking-[0.3em] text-gray-900">
							{room.code}
						</h1>
					</div>
					<button
						onClick={copyCode}
						className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm text-white transition hover:bg-gray-700"
					>
						{copied ? "Copied" : "Copy code"}
					</button>
				</header>

				<div className="mb-4 flex items-baseline gap-2">
					<span className="text-xl font-bold text-gray-900">
						{room.players.length}
					</span>
					<span className="text-sm text-gray-500">
						{room.players.length === 1 ? "player" : "players"} · max{" "}
						{room.settings.maxPlayers}
					</span>
				</div>

				<ul className="grid gap-2">
					{room.players.map((p) => (
						<li
							key={p.socketId}
							className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5"
						>
							<span className="grid h-8 w-8 place-items-center rounded-full bg-gray-900 text-sm font-semibold text-white">
								{p.name.charAt(0).toUpperCase()}
							</span>
							<span className="flex-1 text-[15px] text-gray-800">{p.name}</span>
							{p.isHost && (
								<span className="rounded-md bg-gray-200 px-2 py-0.5 text-[11px] text-gray-600">
									Host
								</span>
							)}
						</li>
					))}
				</ul>

				<p className="mt-5 text-center text-sm text-gray-400">
					Waiting for the host to start the game…
				</p>
			</div>
		</main>
	);
}
