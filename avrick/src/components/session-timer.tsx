"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";

interface SessionTimerProps {
  onSessionComplete: (data: any) => void;
}

export function SessionTimer({ onSessionComplete }: SessionTimerProps) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [notes, setNotes] = useState("");
  const [presetMinutes, setPresetMinutes] = useState(25);
  const [showPresets, setShowPresets] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(!isRunning);
    if (!isRunning && showPresets) {
      setShowPresets(false);
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    const elapsedMinutes = Math.round(sessionSeconds / 60);
    onSessionComplete({
      name: sessionName || `${notes || "Focus Session"}`,
      duration: elapsedMinutes,
      notes: notes,
    });
    setSessionSeconds(0);
    setSessionName("");
    setNotes("");
    setShowPresets(true);
  };

  const handleQuickStart = (minutes: number) => {
    setPresetMinutes(minutes);
    setShowPresets(false);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionSeconds(0);
    setShowPresets(true);
  };

  return (
    <Card
      className={`border-border/30 bg-card/50 backdrop-blur overflow-hidden transition-all ${
        isRunning ? "session-active" : ""
      }`}>
      <div className="p-8">
        <h2 className="text-2xl font-light mb-8">Focus Session</h2>

        <div
          className={`relative mb-8 transition-all ${
            isRunning ? "animate-pulse-slow" : ""
          }`}>
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
              isRunning ? "opacity-30" : "opacity-10"
            }`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-accent to-primary blur-2xl animate-pulse-slow"></div>
          </div>
          <div className="relative aspect-square flex items-center justify-center rounded-full border-2 border-accent/40">
            <div className="text-center">
              <div className="text-7xl font-light text-accent mb-2 tabular-nums">
                {formatTime(sessionSeconds)}
              </div>
              <p className="text-xs text-muted-foreground">elapsed time</p>
            </div>
          </div>
        </div>

        {showPresets && !isRunning && sessionSeconds === 0 && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
                Quick Start (up to 1 hour)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[5, 15, 25, 45].map((mins) => (
                  <Button
                    key={mins}
                    onClick={() => handleQuickStart(mins)}
                    className="bg-accent/20 hover:bg-accent/40 text-accent text-sm">
                    {mins}m
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Custom Duration (minutes, up to 1440)
              </label>
              <Input
                type="number"
                min="1"
                max="1440"
                value={presetMinutes}
                onChange={(e) =>
                  setPresetMinutes(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="bg-background/50 border-border/30 focus:border-accent mb-2"
              />
              <Button
                onClick={() => handleQuickStart(presetMinutes)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Start {presetMinutes}m Session
              </Button>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Session Notes (helps identify sessions)
              </label>
              <Textarea
                placeholder="What are you studying? (Math, Coding, Reading...)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background/50 border-border/30 focus:border-accent min-h-20 resize-none"
              />
            </div>
          </div>
        )}

        {isRunning && (
          <div className="mb-6 p-4 bg-accent/5 border border-accent/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Active Session</p>
            <p className="text-sm text-foreground">
              {notes || "Focus Session in Progress"}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleStart}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            {isRunning ? "Pause" : "Resume"}
          </Button>
          {(isRunning || sessionSeconds > 0) && (
            <>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-green-600/80 hover:bg-green-600 text-white">
                Complete
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-border/30 hover:bg-card/50">
                Reset
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
