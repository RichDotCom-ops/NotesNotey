"use client";
import * as React from "react";

export type NotificationBarProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export function NotificationBar({ message, type = "info", onClose }: NotificationBarProps) {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (!visible && onClose) onClose();
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  if (!visible) return null;
  let color = "bg-blue-500";
  if (type === "success") color = "bg-green-500";
  if (type === "error") color = "bg-red-500";
  return (
    <div className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold flex items-center gap-3 ${color}`}
      role="alert">
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="ml-4 text-white/80 hover:text-white">&times;</button>
    </div>
  );
}
