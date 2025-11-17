"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store auth state in localStorage
    localStorage.setItem(
      "avrick_auth",
      JSON.stringify({ email, username, isLoggedIn: true })
    );
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-glow bg-accent opacity-15"></div>
      <div className="absolute bottom-32 left-1/3 w-80 h-80 rounded-full blur-glow bg-primary opacity-10"></div>

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/60 backdrop-blur">
        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-2">
              <span className="text-primary">Avrick</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Focus. Breathe. Evolve.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Choose your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-border focus:border-primary"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-accent/80 font-medium transition-colors">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
