import React from 'react';
import {
  Award,
  MapPin,
  Sparkles,
  Code2,
  TrendingUp,
  Leaf,
  Sprout,
  CheckCircle2,
  ExternalLink,
  Target,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';
import { FOUNDERS } from '../data/mockData';
import ayushmanPhoto from '../assets/images/ayushman_panda_photo_1791617825930.jpg';

export const FoundersPage: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The Visionaries Behind AgriNutri Farm</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Meet the Founders of{' '}
          <span className="text-emerald-600 dark:text-emerald-400">AgriNutri 2.0</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          From Western Odisha’s agricultural heartland to the pristine forests of Mayurbhanj, Ayushman Panda
          and Gourav Soren joined hands to transform grassroots farming into a circular, transparent, and
          dignified digital ecosystem.
        </p>
      </div>

      {/* Founders Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Founder 1: Ayushman Panda */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="relative py-8 px-6 sm:px-8 w-full bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white border-b border-emerald-900/60 flex flex-col justify-between">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={ayushmanPhoto || '/images/ayushman_panda.jpg'}
                    alt="Ayushman Panda"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-xl ring-4 ring-amber-400/20 shrink-0"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md mb-2">
                      <Award className="w-3.5 h-3.5" />
                      National Awarded Innovator
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{FOUNDERS[0].name}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-300 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        From {FOUNDERS[0].hometown}, {FOUNDERS[0].state}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-emerald-200">{FOUNDERS[0].role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  Biography & Leadership
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {FOUNDERS[0].bio}
                </p>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Key Achievements & Credentials
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {FOUNDERS[0].achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core Expertise Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Core Mastery
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FOUNDERS[0].expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-l-4 border-emerald-500 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{FOUNDERS[0].quote}"
              </blockquote>
            </div>
          </div>

        {/* Founder 2: Gourav Soren */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="relative py-12 px-6 sm:px-8 w-full bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-white border-b border-teal-900/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 via-teal-300 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-teal-500/20 ring-4 ring-teal-400/20">
                  GS
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500 text-slate-950 shadow-md">
                  <Code2 className="w-4 h-4" />
                  Master Web Designer & Ideator
                </span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{FOUNDERS[1].name}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-teal-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    From {FOUNDERS[1].hometown}, {FOUNDERS[1].state}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-teal-200">{FOUNDERS[1].role}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
                  Biography & Product Craft
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {FOUNDERS[1].bio}
                </p>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Achievements & Credentials
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {FOUNDERS[1].achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core Expertise Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Core Mastery
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FOUNDERS[1].expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-l-4 border-teal-500 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{FOUNDERS[1].quote}"
              </blockquote>
            </div>
          </div>
      </div>

      {/* The Journey: AgriNutri V1.0 Prototype to V2.0 Ecosystem */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Evolution of an Agri-Tech Milestone
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            The Journey from AgriNutri V1.0 to AgriNutri Farm 2.0
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            What started as a passionate prototype to connect local tribal gatherers in Mayurbhanj and
            vegetable cultivators in Sambalpur has grown into a comprehensive, multi-vendor smart circular
            ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              V1.0
            </div>
            <h3 className="font-bold text-base text-white">The Genesis Prototype</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Conceptualized by Gourav Soren and engineered by Ayushman Panda, AgriNutri V1.0 proved that
              direct farm listings and transparency build immediate buyer trust, winning national recognition.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              IOT
            </div>
            <h3 className="font-bold text-base text-white">Smart Circular Integration</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              V2.0 incorporates live soil moisture sensors, solar drip irrigation pump controls, and automated
              weather forecasting, safeguarding groundwater and maximizing harvest yields.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              2.0
            </div>
            <h3 className="font-bold text-base text-white">4 Connected Communities</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Unifying Farmers, Producers, Retailers, and Consumers on a single platform with QR traceability
              passports, fair INR pricing, and AgriNutri AI guidance in Odia, Hindi, and English.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 items-center justify-between border-t border-white/10">
          <div className="text-xs text-emerald-200">
            Connect with the leadership team for institutional partnerships or cooperative onboarding:
          </div>
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md"
          >
            Explore Farm Marketplace →
          </button>
        </div>
      </div>
    </div>
  );
};
