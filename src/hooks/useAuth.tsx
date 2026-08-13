"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  showWelcome: boolean;
  setShowWelcome: (v: boolean) => void;
  welcomeDay: number;
  setWelcomeDay: (v: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDay, setWelcomeDay] = useState(1);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    // Fetch challenge to determine day for welcome message
    try {
      const challengeRes = await fetch("/api/challenges/current");
      const challengeData = await challengeRes.json();
      if (challengeData.challenge) {
        const completedDays = challengeData.challenge.days.filter((d: any) => d.status === "completed").length;
        setWelcomeDay(Math.min(completedDays + 1, 20));
      } else {
        setWelcomeDay(1);
      }
      setShowWelcome(true);
    } catch {
      setWelcomeDay(1);
      setShowWelcome(true);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    setUser(data.user);
    setWelcomeDay(1);
    setShowWelcome(true);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowWelcome(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, showWelcome, setShowWelcome, welcomeDay, setWelcomeDay }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
