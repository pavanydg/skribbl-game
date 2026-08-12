"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, joinRoom } from "@/lib/roomActions";

export default function Home() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	async function handleCreate() {
		if (!name.trim()) return setError("Enter a name");
		setError("");
		setBusy(true);
		try {
			const roomCode = await createRoom(name.trim());
			router.push(`/room/${roomCode}`);
		} catch (e) {
			setError((e as Error).message);
			setBusy(false);
		}
	}

	async function handleJoin() {
		if (!name.trim()) return setError("Enter a name");
		if (!code.trim()) return setError("Enter a code");
		setError("");
		setBusy(true);
		const normalized = code.trim().toUpperCase();
		try {
			await joinRoom(normalized, name.trim());
			router.push(`/room/${normalized}`);
		} catch (e) {
			setError((e as Error).message);
			setBusy(false);
		}
	}

	return (
		<main className="grid min-h-screen place-items-center bg-gray-50 p-6">
			<div className="w-full max-w-sm">
				<h1 className="mb-1 text-center text-4xl font-black tracking-tight text-gray-900">
					skribbl
				</h1>
				<p className="mb-8 text-center text-sm text-gray-500">
					draw, guess, win
				</p>

				<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<label className="mb-1.5 block text-xs uppercase tracking-widest text-gray-400">
						Your name
					</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter a name"
						className="mb-5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900"
					/>

					<button
						onClick={handleCreate}
						disabled={busy}
						className="mb-5 w-full rounded-lg bg-gray-900 px-3 py-2.5 font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
					>
						Create room
					</button>

					<div className="mb-5 flex items-center gap-3">
						<span className="h-px flex-1 bg-gray-200" />
						<span className="text-xs text-gray-400">or join</span>
						<span className="h-px flex-1 bg-gray-200" />
					</div>

					<div className="flex gap-2">
						<input
							value={code}
							onChange={(e) => setCode(e.target.value.toUpperCase())}
							placeholder="CODE"
							maxLength={4}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 uppercase tracking-widest text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900"
						/>
						<button
							onClick={handleJoin}
							disabled={busy}
							className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
						>
							Join
						</button>
					</div>

					{error && (
						<p className="mt-4 text-center text-sm text-red-500">{error}</p>
					)}
				</div>
			</div>
		</main>
	);
}
