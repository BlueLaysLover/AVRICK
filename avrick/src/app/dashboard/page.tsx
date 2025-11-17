"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Link from "next/link";
import { SessionTimer } from "../../components/session-timer";
import { SessionList } from "../../components/session-list";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [predictedMinutes, setPredictedMinutes] = useState(0);
  const [hasBeatenToday, setHasBeatenToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("avrick_auth");
    if (!auth) {
      window.location.href = "/";
    } else {
      const authData = JSON.parse(auth);
      setUsername(authData.username);
    }

    // Load sessions from localStorage
    const stored = localStorage.getItem("avrick_sessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }

    // Load today's stats and prediction
    loadTodayStats();
  }, []);

  const loadTodayStats = async () => {
    const stored = localStorage.getItem("avrick_sessions");
    if (stored) {
      const allSessions = JSON.parse(stored);
      const today = new Date().toLocaleDateString();
      const todaySessions = allSessions.filter((s: any) => s.date === today);
      const today_minutes = todaySessions.reduce(
        (acc: number, s: any) => acc + (s.duration || 0),
        0
      );
      setTodayMinutes(today_minutes);

      await fetchPrediction(allSessions);

      // Check if beaten
      setHasBeatenToday(today_minutes > predictedMinutes);
    }
  };

  const fetchPrediction = async (allSessions: any[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions: allSessions }),
      });
      const data = await response.json();
      setPredictedMinutes(data.predictedMinutes);
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      // Fallback to default if prediction fails
      setPredictedMinutes(60);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionData: any) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem("avrick_sessions", JSON.stringify(updated));
    await loadTodayStats();
  };

  const deleteSession = async (id: number) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("avrick_sessions", JSON.stringify(updated));
    await loadTodayStats();
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
            <p className="text-sm text-muted-foreground">Welcome, {username}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-border/50 hover:bg-card/50">
                Profile & Stats
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/30 bg-card/50 backdrop-blur p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Today's Prediction
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-accent">
                {loading ? "..." : predictedMinutes}
              </span>
              <span className="text-xs text-muted-foreground">minutes</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ML Prediction by Avrick
            </p>
          </Card>

          <Card className="border-border/30 bg-card/50 backdrop-blur p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Today's Study Time
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-light ${
                  todayMinutes > predictedMinutes
                    ? "text-green-400"
                    : "text-accent"
                }`}>
                {todayMinutes}
              </span>
              <span className="text-xs text-muted-foreground">minutes</span>
            </div>
            <p
              className={`text-xs mt-2 ${
                todayMinutes > predictedMinutes
                  ? "text-green-400"
                  : "text-muted-foreground"
              }`}>
              {todayMinutes > predictedMinutes
                ? "✓ You beat Avrick!"
                : "Keep going..."}
            </p>
          </Card>

          <Card
            className={`border-border/30 backdrop-blur p-6 ${
              hasBeatenToday
                ? "bg-green-500/10 border-green-500/30"
                : "bg-card/50"
            }`}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Difference
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-light ${
                  hasBeatenToday ? "text-green-400" : "text-amber-400"
                }`}>
                {Math.abs(todayMinutes - predictedMinutes)}
              </span>
              <span className="text-xs text-muted-foreground">minutes</span>
            </div>
            <p
              className={`text-xs mt-2 ${
                hasBeatenToday ? "text-green-400" : "text-amber-400"
              }`}>
              {hasBeatenToday ? "Ahead of prediction" : "Behind prediction"}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Timer */}
          <div className="lg:col-span-2">
            <SessionTimer onSessionComplete={addSession} />
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="text-lg font-light mb-4">Recent Sessions</h2>
            <SessionList
              sessions={sessions.slice(0, 5)}
              onDelete={deleteSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
