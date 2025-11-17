"use client";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface SessionListProps {
  sessions: any[];
  onDelete: (id: number) => void;
}

export function SessionList({ sessions, onDelete }: SessionListProps) {
  return (
    <div className="space-y-2">
      {sessions.length === 0 ? (
        <Card className="border-border/30 bg-card/50 backdrop-blur p-6 text-center">
          <p className="text-muted-foreground text-sm">
            No sessions yet. Start your first focus session!
          </p>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card
            key={session.id}
            className="border-border/30 bg-card/50 backdrop-blur p-4 hover:bg-card/70 transition-colors group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {session.notes && (
                  <p className="font-medium text-sm text-accent mb-1 truncate">
                    {session.notes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {session.duration}m • {session.date}
                </p>
                {session.name && session.name !== session.notes && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {session.name}
                  </p>
                )}
              </div>
              <Button
                onClick={() => onDelete(session.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                Delete
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
