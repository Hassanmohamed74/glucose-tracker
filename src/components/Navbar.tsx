"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Home, History, BarChart3, User, LogOut, Menu, X, Activity } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/history", label: "History", icon: History },
    { href: "/analysis", label: "Analysis", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white" size={18} />
            </div>
            <span className="font-black text-lg text-slate-800 hidden sm:block">GlucoseTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${active ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 ml-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={() => { setMobileOpen(false); logout(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 w-full">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
