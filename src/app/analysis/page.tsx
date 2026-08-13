"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import ReadingTrendChart from "@/components/ReadingTrendChart";
import DailyReadingsChart from "@/components/DailyReadingsChart";
import FingerDistributionChart from "@/components/FingerDistributionChart";
import StatsCards from "@/components/StatsCards";
import StreakDisplay from "@/components/StreakDisplay";
import { READING_TYPE_LABELS, READING_TYPES, ReadingType } from "@/lib/classification";
import { Loader2, TrendingUp, BarChart3, Activity, Target, Award, Filter } from "lucide-react";

export default function AnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ReadingType | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchAnalysis();
  }, [user, filterType]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch("/api/challenges/current");
      const data = await res.json();
      if (data.challenge) {
        const url = `/api/challenges/${data.challenge._id}/statistics${filterType ? `?type=${filterType}` : ""}`;
        const statsRes = await fetch(url);
        const statsData = await statsRes.json();
        setStats(statsData.statistics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
  const isCompleted = stats && stats.completionRate === 100;

  const classificationColors: Record<string, string> = {
    LOW: "bg-blue-500",
    NORMAL: "bg-emerald-500",
    PREDIABETES: "bg-amber-500",
    DIABETES_RANGE: "bg-rose-500",
    BELOW_TARGET: "bg-sky-500",
    TARGET: "bg-emerald-500",
    ABOVE_TARGET: "bg-amber-500",
    HIGH: "bg-rose-500",
    NO_DIAGNOSTIC_THRESHOLD: "bg-emerald-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/60 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="font-bold text-slate-800 text-lg">20-Day Analysis</span>
            {isCompleted && (
              <span className="badge bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                <Award size={12} /> Completed
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient from-blue-600 to-violet-600">
            Your Health Journey
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {stats ? `${stats.completedDays} of ${stats.totalDays} days tracked` : "No data yet"}
          </p>
        </div>

        {!stats ? (
          <div className="card-glass text-center py-20">
            <BarChart3 className="text-slate-300 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No Challenge Data</h2>
            <p className="text-slate-500">Start a challenge to see your analysis here.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 animate-slide-up">
              <Filter size={18} className="text-slate-400" />
              <button
                onClick={() => setFilterType(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filterType ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"}`}
              >
                All
              </button>
              {READING_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterType === type ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"}`}
                >
                  {READING_TYPE_LABELS[type]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              <div className="stat-card from-blue-500 to-blue-600">
                <Activity size={24} className="mb-2 opacity-80" />
                <p className="text-3xl font-black">{stats.average || "—"}</p>
                <p className="text-sm font-semibold opacity-90">Avg mg/dL</p>
              </div>
              <div className="stat-card from-emerald-500 to-teal-500">
                <Target size={24} className="mb-2 opacity-80" />
                <p className="text-3xl font-black">{stats.minimum || "—"}</p>
                <p className="text-sm font-semibold opacity-90">Lowest</p>
              </div>
              <div className="stat-card from-rose-500 to-pink-500">
                <TrendingUp size={24} className="mb-2 opacity-80" />
                <p className="text-3xl font-black">{stats.maximum || "—"}</p>
                <p className="text-sm font-semibold opacity-90">Highest</p>
              </div>
              <div className="stat-card from-violet-500 to-purple-500">
                <BarChart3 size={24} className="mb-2 opacity-80" />
                <p className="text-3xl font-black">{stats.median || "—"}</p>
                <p className="text-sm font-semibold opacity-90">Median</p>
              </div>
            </div>

            <div className="card-glass animate-slide-up">
              <h3 className="text-lg font-black text-slate-800 mb-4">Averages by Reading Type</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fasting</p>
                  <p className="text-2xl font-black text-blue-600">{stats.fastingAverage || "—"}</p>
                  <p className="text-xs text-slate-400">{stats.typeCounts?.FASTING || 0} readings</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Post Breakfast</p>
                  <p className="text-2xl font-black text-emerald-600">{stats.postBreakfastAverage || "—"}</p>
                  <p className="text-xs text-slate-400">{stats.typeCounts?.POST_BREAKFAST || 0} readings</p>
                </div>
                <div className="bg-violet-50 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Random</p>
                  <p className="text-2xl font-black text-violet-600">{stats.randomAverage || "—"}</p>
                  <p className="text-xs text-slate-400">{stats.typeCounts?.RANDOM || 0} readings</p>
                </div>
              </div>
            </div>

            <div className="card-gradient bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-1">Challenge Progress</h2>
                  <p className="text-white/90 font-medium">
                    {stats.completedDays} / {stats.totalDays} days completed ({stats.completionRate}%)
                  </p>
                </div>
                <div className="text-right"><div className="text-4xl font-black">{stats.completionRate}%</div></div>
              </div>
              <div className="mt-4 w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${stats.completionRate}%` }} />
              </div>
            </div>

            <StreakDisplay current={stats.streak.current} longest={stats.streak.longest} />
            <StatsCards average={stats.average} minimum={stats.minimum} maximum={stats.maximum} completed={stats.completedDays} total={stats.totalDays} />

            <div className="grid lg:grid-cols-2 gap-6 animate-slide-up">
              <ReadingTrendChart data={stats.dailyData.map((d: any) => ({ day: d.day, reading: d.reading }))} average={stats.average} />
              <DailyReadingsChart data={stats.dailyData.map((d: any) => ({ day: d.day, reading: d.reading, status: d.status }))} />
            </div>

            <FingerDistributionChart data={stats.fingerUsage} />

            {Object.keys(stats.classificationCounts || {}).length > 0 && (
              <div className="card-glass animate-slide-up">
                <h3 className="text-lg font-black text-slate-800 mb-4">Classification Distribution</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.classificationCounts).map(([cat, count]: [string, any]) => (
                    <div key={cat} className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
                      <div className={`w-3 h-3 rounded-full ${classificationColors[cat] || "bg-slate-400"}`} />
                      <span className="text-sm font-bold text-slate-700">{cat.replace(/_/g, " ")}</span>
                      <span className="text-sm font-black text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card-glass animate-slide-up">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="text-blue-500" size={20} />
                Detailed Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Measurements", value: stats.completedDays, color: "text-blue-600" },
                  { label: "Completion Rate", value: `${stats.completionRate}%`, color: "text-emerald-600" },
                  { label: "Standard Deviation", value: stats.stdDev > 0 ? `${stats.stdDev} mg/dL` : "—", color: "text-violet-600" },
                  { label: "Current Streak", value: `${stats.streak.current} days`, color: "text-orange-600" },
                  { label: "Longest Streak", value: `${stats.streak.longest} days`, color: "text-amber-600" },
                  { label: "Days Remaining", value: stats.totalDays - stats.completedDays, color: "text-rose-600" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-2xl p-4 text-center hover:bg-slate-100 transition-colors">
                    <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
