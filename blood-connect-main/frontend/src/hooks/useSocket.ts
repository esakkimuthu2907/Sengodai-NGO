import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hooks/use-toast";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://127.0.0.1:5000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}

export function useSocket(bloodGroup?: string, role?: string, userId?: string) {
  const connected = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || connected.current) return;

    const s = getSocket();
    s.connect();
    connected.current = true;

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      // Join role room
      if (role === "admin") s.emit("join_room", "admin_alerts");
      // Join blood group room for matching notifications
      if (bloodGroup) s.emit("join_room", `bloodGroup:${bloodGroup}`);
      // Join personal room
      if (userId) s.emit("join_room", userId);
    });

    // Listen for urgent blood request notifications
    s.on("new_urgent_request", (data: { message: string }) => {
      toast({
        title: "🩸 Urgent Blood Request!",
        description: data.message,
        variant: "destructive",
      });
    });

    // Listen for admin alerts
    s.on("admin_alert", (data: { message: string }) => {
      toast({
        title: "🚨 Admin Alert",
        description: data.message,
      });
    });

    return () => {
      s.off("new_urgent_request");
      s.off("admin_alert");
      s.off("connect");
      s.disconnect();
      connected.current = false;
    };
  }, [bloodGroup, role, userId]);
}
