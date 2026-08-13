"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Auth context handles welcome modal + redirect
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-violet-50/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/20">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-lg">Sign in to continue your challenge</p>
        </div>

        <div className="card-glass">
          {error && (
            <div className="mb-5 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-200 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
