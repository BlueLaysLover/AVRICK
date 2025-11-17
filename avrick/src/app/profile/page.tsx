"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Link from "next/link";
import { ActivityCalendar } from "../../components/activity-calendar";
import { StatCard } from "../../components/stat-card";
import { WeeklyStatsChart } from "../../components/weekly-stats-chart";
import { MonthlyStatsChart } from "../../components/monthly-stats-chart";

export default function ProfilePage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [timesBeatAvrick, setTimesBeatAvrick] = useState(0);

  useEffect(() => {
    const auth = localStorage.getItem("avrick_auth");
    if (!auth) {
      window.location.href = "/";
    } else {
      const authData = JSON.parse(auth);
      setUsername(authData.username);
    }

    const stored = localStorage.getItem("avrick_sessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }

    // Load times beaten
    const beaten = localStorage.getItem("avrick_times_beaten");
    if (beaten) {
      setTimesBeatAvrick(parseInt(beaten));
    }
  }, []);

  // Calculate stats
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalSessions = sessions.length;
  const avgDuration =
    totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const calculateTimesBeatAvrick = () => {
    const daysBeaten = new Set<string>();
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();

      const daySessions = sessions.filter((s: any) => s.date === dateStr);
      const dayMinutes = daySessions.reduce(
        (acc: number, s: any) => acc + (s.duration || 0),
        0
      );

      if (dayMinutes > 0) {
        // Simple prediction for past days (average of available data)
        const prediction = Math.max(30, Math.round(dayMinutes * 0.8));
        if (dayMinutes > prediction) {
          daysBeaten.add(dateStr);
        }
      }
    }

    return daysBeaten.size;
  };

  const beaten = calculateTimesBeatAvrick();

  // Get activity data for calendar
  const getActivityData = () => {
    const data: { [key: string]: number } = {};
    sessions.forEach((session) => {
      const date = session.date || new Date().toLocaleDateString();
      const duration = session.duration || 0;
      data[date] = (data[date] || 0) + duration;
    });
    return data;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-glow bg-accent opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-glow bg-primary opacity-10"></div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light">
              <span className="text-accent">Avrick</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {username}'s Profile
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-border/50 hover:bg-card/50">
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("avrick_auth");
                window.location.href = "/";
              }}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Hours" value={totalHours} unit="hrs" />
          <StatCard
            label="Total Sessions"
            value={totalSessions}
            unit="sessions"
          />
          <StatCard label="Average Duration" value={avgDuration} unit="min" />
          <StatCard label="Times Beaten Avrick" value={beaten} unit="times" />
        </div>

        {/* Activity Calendar */}
        <Card className="border-border/30 bg-card/50 backdrop-blur">
          <div className="p-8">
            <h2 className="text-2xl font-light mb-6">
              Focus Activity - Yearly
            </h2>
            <ActivityCalendar activityData={getActivityData()} />
          </div>
        </Card>

        {/* Weekly Stats */}
        <Card className="border-border/30 bg-card/50 backdrop-blur">
          <div className="p-8">
            <h2 className="text-2xl font-light mb-6">Weekly Stats</h2>
            <WeeklyStatsChart sessions={sessions} />
          </div>
        </Card>

        {/* Monthly Stats */}
        <Card className="border-border/30 bg-card/50 backdrop-blur">
          <div className="p-8">
            <h2 className="text-2xl font-light mb-6">Monthly Stats</h2>
            <MonthlyStatsChart sessions={sessions} />
          </div>
        </Card>
      </div>
    </div>
  );
}
