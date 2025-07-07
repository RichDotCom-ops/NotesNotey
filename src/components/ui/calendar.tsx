"use client";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Patch: Accept and forward modifiers and modifiersClassNames as any to bypass type errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Calendar(props: any) {
  return (
    <DayPicker
      showOutsideDays
      fixedWeeks
      {...props}
    />
  );
}
