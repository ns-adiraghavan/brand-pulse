import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import netscribesLogo from "@/assets/netscribes-logo.png";

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
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(221 82% 48% / 0.10) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-border-dim bg-surface p-10"
        style={{ boxShadow: "0 25px 60px -12px hsl(215 41% 5% / 0.8)" }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-5">
          <img
            src={netscribesLogo}
            alt="Netscribes"
            className="h-10 w-auto object-contain"
          />
          <div className="text-center">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
            Brand Health Intelligence Platform
          </h1>
            <p className="mt-1.5 text-sm font-medium text-primary">
              E-Commerce Competitive Intelligence
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Wave Q4 2024
            </p>
          </div>
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
              placeholder="analyst@netscribes.com"
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
            className="mt-2 w-full font-semibold text-white transition-colors duration-200"
            style={{ background: '#1D4ED8' }}
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Confidential — For internal use only · © Netscribes
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
