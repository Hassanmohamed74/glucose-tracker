"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Loader2, Bell, Save, User, Settings, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        setReminderTime(data.settings.reminderTime);
        setNotificationsEnabled(data.settings.notificationsEnabled);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderTime, notificationsEnabled, preferredUnit: "mg/dL" }),
      });
      if (res.ok) {
        setMessage("Settings saved!");
        if (notificationsEnabled && "Notification" in window) {
          Notification.requestPermission();
        }
      } else {
        setMessage("Failed to save settings");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="card-glass">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{user.name}</h1>
              <p className="text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="card-glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Settings className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800">Reminder Settings</h2>
          </div>

          {message && (
            <div className={`mb-5 p-4 rounded-2xl text-sm font-bold border ${message.includes("saved") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
              {message}
            </div>
          )}

          <form onSubmit={saveSettings} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Daily Reminder Time</label>
              <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="input" />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <input type="checkbox" id="notifications" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="notifications" className="text-sm font-bold text-slate-700">Enable browser notifications</label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center justify-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Settings
            </button>
          </form>
        </div>

        <div className="card-glass bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500" size={24} />
            <div>
              <p className="font-bold text-slate-700">Your data is secure</p>
              <p className="text-sm text-slate-500">All readings are encrypted and never shared with third parties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
