"use client";

import { useEffect } from "react";
import { initSocketBridge } from "@/lib/socketBridge";

export default function SocketBridge() {
	useEffect(() => {
		initSocketBridge();
	}, []);
	return null;
}
