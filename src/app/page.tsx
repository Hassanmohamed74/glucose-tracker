import Link from "next/link";
import { Activity, Shield, TrendingUp, Smartphone, Sparkles, Heart, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50/50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-5 py-2 shadow-lg border border-white/60 mb-8">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-slate-600">20-Day Health Challenge</span>
          </div>

          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 animate-float">
            <Activity className="text-white" size={40} />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Track Your <span className="text-gradient from-blue-600 to-violet-600">Glucose</span><br />
            <span className="text-gradient from-emerald-500 to-teal-500">Build Habits</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A beautiful, simple 20-day challenge with randomized finger rotation.
            See your trends. Build consistency. No medical jargon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-center text-lg px-10 py-4">
              <Zap size={20} className="inline mr-2" /> Start Your Challenge
            </Link>
            <Link href="/login" className="btn-secondary text-center text-lg px-10 py-4">
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, title: "Simple Daily Tracking", desc: "One measurement per day. Random finger assigned. Just enter your reading.", gradient: "from-blue-400 to-blue-600" },
            { icon: TrendingUp, title: "Beautiful Analytics", desc: "Gorgeous charts and trends from day one. Track your progress visually.", gradient: "from-emerald-400 to-teal-600" },
            { icon: Shield, title: "Private & Secure", desc: "Your data is encrypted and safe. No sharing. No ads. Just your health.", gradient: "from-violet-400 to-purple-600" },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card-glass text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="font-black text-xl text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats preview */}
        <div className="mt-20 card-glass bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center py-12">
          <h2 className="text-3xl font-black mb-2">Ready to Start?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands building healthier habits, one day at a time.</p>
          <Link href="/register" className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <Heart size={18} className="inline mr-2" /> Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
