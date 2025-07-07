// NoteyIcon.tsx - SVG React component for the NotesNotey favicon
import * as React from "react";

export function NoteyIcon({ className = "", size = 32, gradientColors = ["#ec4899", "#f59e42"], style }: { className?: string; size?: number; gradientColors?: [string, string]; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NoteNotey logo"
      style={style}
    >
      <defs>
        <linearGradient id="notey-gradient" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientColors[0]} />
          <stop offset="1" stopColor={gradientColors[1]} />
        </linearGradient>
      </defs>
      <path
        d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
        clipRule="evenodd"
        fill="url(#notey-gradient)"
        fillRule="evenodd"
      />
    </svg>
  );
}
