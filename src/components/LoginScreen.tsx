import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Subtle radial glow behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(221 82% 48% / 0.10) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border-dim bg-surface p-10 shadow-2xl"
        style={{ boxShadow: "0 25px 60px -12px hsl(215 41% 5% / 0.8)" }}
      >
        {/* Logo area */}
        <div className="mb-8 text-center">
          {/* Icon mark */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-primary-foreground"
            >
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
            Brand Health Intelligence Platform
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            E-Commerce Competitive Tracker | Wave Q4 2024
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-muted-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="email"
              placeholder="analyst@company.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-border-dim bg-surface-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border-dim bg-surface-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary-glow transition-colors duration-200"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Confidential — For internal use only
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
