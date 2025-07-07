"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getProjectsForUser } from "@/lib/auth";
import { User, Project } from "@/types";
import { format, isSameDay, parseISO, startOfDay } from "date-fns";
import { Plus, CheckCircle2, Trophy } from 'lucide-react';



function getActivityByDate(projects: Project[], date: Date) {
  const day = startOfDay(date);
  const created = projects.filter((p) => isSameDay(startOfDay(parseISO(p.createdAt)), day));
  const updated = projects.filter((p) =>
    Array.isArray(p.checkIns) && p.checkIns.some((ci) => isSameDay(startOfDay(parseISO(ci.date)), day))
  );
  const completed = projects.filter((p) =>
    p.status === "Completed" && p.completedAt && isSameDay(startOfDay(parseISO(p.completedAt)), day)
  );
  return { created, updated, completed };
}


function getAllActivityDates(projects: Project[]) {
  // Helper to deduplicate and normalize to start of day
  const normalize = (dateStr: string) => startOfDay(parseISO(dateStr)).getTime();
  const dedupe = (arr: number[]) => Array.from(new Set(arr));

  const created = dedupe(projects.map((p) => normalize(p.createdAt))).map((t) => new Date(t));
  const updated = dedupe(
    projects.flatMap((p) => Array.isArray(p.checkIns) ? p.checkIns.map((ci) => normalize(ci.date)) : [])
  ).map((t) => new Date(t));
  const completed = dedupe(
    projects.filter((p) => p.status === "Completed" && p.completedAt)
      .map((p) => normalize(p.completedAt!))
  ).map((t) => new Date(t));
  return { created, updated, completed };
}

export function CalendarView({ user }: { user: User }) {
  const [selected, setSelected] = React.useState<Date | undefined>(undefined);
  const projects = getProjectsForUser(user.id);
  const activityDates = getAllActivityDates(projects);
  const modifiers = {
    created: activityDates.created,
    updated: activityDates.updated,
    completed: activityDates.completed,
  };
  const modifiersClassNames = {
    created: "bg-blue-100 text-blue-900",
    updated: "bg-yellow-100 text-yellow-900",
    completed: "bg-green-100 text-green-900",
  };

  const activity = selected ? getActivityByDate(projects, selected) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Productivity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-lg border"
          />
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Activity on {selected ? format(selected, "PPP") : "..."}</CardTitle>
        </CardHeader>
        <CardContent>
          {!selected && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <span className="text-2xl font-bold text-zinc-400 mb-2">📅</span>
              <span className="text-lg font-semibold">Pick a day to see your productivity story!</span>
              <span className="text-sm mt-1">Your project activity will show up here.</span>
            </div>
          )}
          {selected && (
            <div className="space-y-6">
              {activity && activity.created && activity.updated && activity.completed && activity.created.length === 0 && activity.updated.length === 0 && activity.completed.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <span className="text-3xl mb-2">🛌</span>
                  <span className="text-lg font-semibold text-zinc-500">No activity on this day.</span>
                  <span className="text-sm text-zinc-400">Try creating a project or checking in!</span>
                </div>
              ) : (
                <>
                  {activity && activity.created && activity.created.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Plus className="text-blue-700 h-5 w-5" />
                      <span className="font-semibold text-blue-700">Created Projects:</span>
                    </div>
                  )}
                  {activity && activity.created && activity.created.length > 0 && (
                    <ul className="list-disc ml-8 mb-2">
                      {activity.created.map((p) => <li key={p.id}>{p.name}</li>)}
                    </ul>
                  )}
                  {activity && activity.updated && activity.updated.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="text-yellow-700 h-5 w-5" />
                      <span className="font-semibold text-yellow-700">Check-ins:</span>
                    </div>
                  )}
                  {activity && activity.updated && activity.updated.length > 0 && (
                    <ul className="list-disc ml-8 mb-2">
                      {activity.updated.map((p) => <li key={p.id}>{p.name}</li>)}
                    </ul>
                  )}
                  {activity && activity.completed && activity.completed.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Trophy className="text-green-700 h-5 w-5" />
                      <span className="font-semibold text-green-700">Completed Projects:</span>
                    </div>
                  )}
                  {activity && activity.completed && activity.completed.length > 0 && (
                    <ul className="list-disc ml-8 mb-2">
                      {activity.completed.map((p) => <li key={p.id}>{p.name}</li>)}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
