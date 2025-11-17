"use client";

import { Card } from "../components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur p-6">
      <div className="text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">
          {label}
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-light text-primary">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
}
