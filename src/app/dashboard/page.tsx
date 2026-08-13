"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HandVisualization from "@/components/HandVisualization";
import ProgressBar from "@/components/ProgressBar";
import StreakDisplay from "@/components/StreakDisplay";
import StatsCards from "@/components/StatsCards";
import ReadingTypeSelector from "@/components/ReadingTypeSelector";
import ClassificationBadge from "@/components/ClassificationBadge";
import WelcomeModal from "@/components/WelcomeModal";
import { Finger } from "@/lib/utils";
import { classifyGlucose, ReadingType } from "@/lib/classification";
import { Loader2, CheckCircle, Play, Zap, Sparkles, TrendingUp, PartyPopper } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading, showWelcome, setShowWelcome, welcomeDay } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [todayDay, setTodayDay] = useState<any>(null);
  const [reading, setReading] = useState("");
  const [readingType, setReadingType] = useState<ReadingType | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [typeError, setTypeError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const classification = reading && readingType ? classifyGlucose(readingType, Number(reading)) : null;

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => { if (!user) return; fetchChallenge(); }, [user]);

  const fetchChallenge = async () => {
    try {
      const res = await fetch("/api/challenges/current");
      const data = await res.json();
      setChallenge(data.challenge);
      if (data.challenge) {
        const todayRes = await fetch(`/api/challenges/${data.challenge._id}/today`);
        if (todayRes.ok) { const todayData = await todayRes.json(); setTodayDay(todayData.day); }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createChallenge = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setChallenge(data.challenge);
        const todayRes = await fetch(`/api/challenges/${data.challenge._id}/today`);
        if (todayRes.ok) { const todayData = await todayRes.json(); setTodayDay(todayData.day); }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const submitReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !todayDay) return;
    if (!readingType) { setTypeError("Please select when this blood glucose reading was taken."); return; }
    setTypeError("");
    if (!reading || isNaN(Number(reading)) || Number(reading) <= 0 || Number(reading) > 999) {
      setMessage("Please enter a valid blood glucose reading between 1 and 999."); return;
    }
    setSubmitting(true); setMessage("");
    try {
      const res = await fetch(`/api/challenges/${challenge._id}/readings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glucoseValue: reading, readingType, unit: "mg/dL", note }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true); setReading(""); setReadingType(null); setNote("");
        setTimeout(() => setShowSuccess(false), 3000); await fetchChallenge();
      } else { setMessage(data.error || "Failed to save reading"); }
    } catch (err) { setMessage("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );
  if (!user) return null;

  const completedDays = challenge?.days.filter((d: any) => d.status === "completed").length || 0;
  const readings = challenge?.days.filter((d: any) => d.reading).map((d: any) => d.reading.glucoseValue) || [];
  const average = readings.length > 0 ? Math.round(readings.reduce((a: number, b: number) => a + b, 0) / readings.length) : 0;
  const minimum = readings.length > 0 ? Math.min(...readings) : 0;
  const maximum = readings.length > 0 ? Math.max(...readings) : 0;
  let currentStreak = 0, longestStreak = 0, temp = 0;
  const days = challenge?.days || [];
  for (const day of days) { if (day.status === "completed") { temp++; if (temp > longestStreak) longestStreak = temp; } else { temp = 0; } }
  temp = 0; for (let i = days.length - 1; i >= 0; i--) { if (days[i].status === "completed") temp++; else break; }
  currentStreak = temp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {showWelcome && <WelcomeModal userName={user.name} dayNumber={welcomeDay} onClose={() => setShowWelcome(false)} />}
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">Hello, <span className="text-gradient from-blue-600 to-violet-600">{user.name}</span>!</h1>
          <p className="text-slate-500 mt-1 text-lg">Ready to track your glucose today?</p>
        </div>

        {!challenge ? (
          <div className="card-glass text-center py-16 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 animate-float"><Play className="text-white" size={36} /></div>
            <h2 className="text-3xl font-black text-slate-800 mb-3">Start Your Journey</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">Begin a 20-day blood glucose challenge with randomized finger assignments.</p>
            <button onClick={createChallenge} className="btn-primary text-lg px-10"><Sparkles size={20} /> Start 20-Day Challenge</button>
          </div>
        ) : (
          <>
            {challenge.status === "completed" && (
              <div className="card-gradient bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-center py-8 animate-slide-up">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-bounce-soft"><PartyPopper className="text-white" size={32} /></div>
                <h2 className="text-3xl font-black text-white mb-2">Challenge Completed!</h2>
                <p className="text-white/90 text-lg">All 20 measurements done. Amazing consistency!</p>
                <button onClick={() => router.push("/analysis")} className="mt-6 bg-white text-emerald-600 font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"><TrendingUp size={18} className="inline mr-2" /> View Full Analysis</button>
              </div>
            )}

            <div className="card-glass animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">20-Day Challenge</h2>
                <span className={`badge ${challenge.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{challenge.status === "active" ? "● Active" : "✓ Completed"}</span>
              </div>
              <ProgressBar current={completedDays} total={20} />
            </div>

            <StreakDisplay current={currentStreak} longest={longestStreak} />
            <StatsCards average={average} minimum={minimum} maximum={maximum} completed={completedDays} total={20} />

            {todayDay && challenge.status === "active" && (
              <div className="card-glass animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"><Zap className="text-white" size={20} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Today&apos;s Measurement</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Day {todayDay.dayNumber} of 20</p>
                  </div>
                </div>

                {todayDay.status === "completed" ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30 animate-bounce-soft"><CheckCircle className="text-white" size={40} /></div>
                    <p className="text-2xl font-black text-slate-800">Day {todayDay.dayNumber} Done!</p>
                    <div className="mt-4 inline-flex flex-wrap items-center gap-3 bg-slate-50 rounded-2xl px-6 py-3">
                      <div className="text-center"><p className="text-xs font-bold text-slate-400 uppercase">Type</p><p className="text-sm font-bold text-slate-700">{todayDay.reading?.readingType?.replace("_", " ")}</p></div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center"><p className="text-xs font-bold text-slate-400 uppercase">Reading</p><p className="text-2xl font-black text-blue-600">{todayDay.reading.glucoseValue}</p></div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-center"><p className="text-xs font-bold text-slate-400 uppercase">Finger</p><p className="text-sm font-bold text-slate-700">{todayDay.assignedFinger}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <HandVisualization selectedFinger={todayDay.assignedFinger as Finger} />
                    {showSuccess && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 text-center animate-slide-up">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg"><CheckCircle className="text-white" size={24} /></div>
                        <p className="text-lg font-black text-emerald-700">Reading Saved!</p>
                        <p className="text-sm text-emerald-600">Great job keeping up with your challenge.</p>
                      </div>
                    )}
                    <form onSubmit={submitReading} className="max-w-lg mx-auto space-y-5">
                      {message && <div className="p-4 rounded-2xl text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-fade-in">{message}</div>}
                      <ReadingTypeSelector value={readingType} onChange={(type) => { setReadingType(type); setTypeError(""); }} error={typeError} />
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Blood Glucose Reading <span className="text-rose-500">*</span></label>
                        <div className="flex gap-3">
                          <input type="number" value={reading} onChange={(e) => setReading(e.target.value)} className="input flex-1" placeholder="e.g. 120" min="1" max="999" required />
                          <span className="flex items-center px-5 bg-slate-100 rounded-2xl text-slate-600 font-bold">mg/dL</span>
                        </div>
                      </div>
                      {classification && <ClassificationBadge classification={classification} />}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Note (optional)</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="input" placeholder="How are you feeling?" />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />} Save Reading
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
