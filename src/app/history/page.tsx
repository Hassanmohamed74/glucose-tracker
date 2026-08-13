"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { formatDate, formatTime } from "@/lib/utils";
import { READING_TYPE_LABELS } from "@/lib/classification";
import { Loader2, CheckCircle, XCircle, Clock, Calendar, Droplets } from "lucide-react";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => { if (!user) return; fetchHistory(); }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/challenges/current");
      const data = await res.json();
      if (data.challenge) {
        const readingsRes = await fetch(`/api/challenges/${data.challenge._id}/readings`);
        const readingsData = await readingsRes.json();
        setChallenge({ ...data.challenge, days: readingsData.days });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );
  if (!user) return null;

  const completedCount = challenge?.days.filter((d: any) => d.status === "completed").length || 0;

  const classificationColors: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-700",
    NORMAL: "bg-emerald-100 text-emerald-700",
    PREDIABETES: "bg-amber-100 text-amber-700",
    DIABETES_RANGE: "bg-rose-100 text-rose-700",
    BELOW_TARGET: "bg-sky-100 text-sky-700",
    TARGET: "bg-emerald-100 text-emerald-700",
    ABOVE_TARGET: "bg-amber-100 text-amber-700",
    HIGH: "bg-rose-100 text-rose-700",
    NO_DIAGNOSTIC_THRESHOLD: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Calendar className="text-white" size={24} /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">20-Day History</h1>
            <p className="text-slate-500">{completedCount} of 20 days completed</p>
          </div>
        </div>

        {!challenge ? (
          <div className="card-glass text-center py-16">
            <Droplets className="text-slate-300 mx-auto mb-4" size={48} />
            <p className="text-slate-500 text-lg">No active challenge. Start one from the dashboard.</p>
          </div>
        ) : (
          <div className="card-glass overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Day</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Finger</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Reading</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Result</th>
                    <th className="text-left px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {challenge.days.map((day: any) => (
                    <tr key={day.dayNumber} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-800 text-lg">{day.dayNumber}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{formatDate(day.date)}</td>
                      <td className="px-6 py-4">
                        {day.status === "completed" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-700"><CheckCircle size={12} /> Done</span>
                        ) : new Date(day.date) < new Date(new Date().setHours(0,0,0,0)) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-500"><XCircle size={12} /> Missed</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-700"><Clock size={12} /> Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {day.reading?.readingType ? (
                          <span className="text-sm font-bold text-slate-700">{READING_TYPE_LABELS[day.reading.readingType as keyof typeof READING_TYPE_LABELS]}</span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{day.assignedFinger}</td>
                      <td className="px-6 py-4 font-black text-slate-800 text-lg">
                        {day.reading ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {day.reading.glucoseValue} <span className="text-sm text-slate-400 font-medium">mg/dL</span>
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {day.reading?.classification ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${classificationColors[day.reading.classification] || "bg-slate-100 text-slate-600"}`}>
                            {day.reading.classification.replace(/_/g, " ")}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">{day.reading ? formatTime(day.reading.measuredAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
