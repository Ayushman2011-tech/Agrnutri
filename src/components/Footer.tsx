import React from 'react';
import { Sprout, Phone, MapPin, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const navigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Highlight CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-teal-900/50 to-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Circular Agritech Initiative · Odisha</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Empowering Farmers, Processors, Retailers &amp; Households
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience full QR farm-to-fork transparency, real-time IoT soil intelligence, and direct fair-trade harvests built in Odisha by Ayushman Panda &amp; Gourav Soren.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('marketplace')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <span>Shop Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('founders')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              Founders Story
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Founders Attribution */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                AgriNutri Farm 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              From Smart Farming to Trusted Food. Conceived by Ayushman Panda (Sambalpur) and
              Gourav Soren (Mayurbhanj) in Odisha to connect farmers, processors, retailers, and
              consumers with verified laboratory provenance and direct fair-trade commerce.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-[11px] font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NPOP &amp; FSSAI Aligned · 0.00 ppm Assay Ledger</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Natural Farm Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => navigate('orders')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Your Orders &amp; Tracking</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('logistics')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Logistics Optimizer</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('smart-farming')} className="hover:text-emerald-400 transition-colors">
                  Smart Farming &amp; Weather
                </button>
              </li>
              <li>
                <button onClick={() => navigate('tutorials')} className="hover:text-emerald-400 transition-colors">
                  Farmer Video Academy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('sustainability')} className="hover:text-emerald-400 transition-colors">
                  Sustainability Score
                </button>
              </li>
              <li>
                <button onClick={() => navigate('pricing')} className="hover:text-emerald-400 transition-colors">
                  Membership &amp; Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Workspaces */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3.5">Communities</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Farmer Cultivation Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Producer Processing Unit
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Retailer Wholesale Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Consumer Nutrition Cart
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Administrator Console
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hubs */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3.5">Odisha Hubs</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sambalpur Innovation Lab &amp; Mayurbhanj Bio-Venture Center, Odisha</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono">1800-180-1551</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@agrinutrifarm.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgriNutri Farm 2.0 · Ayushman Panda &amp; Gourav Soren, Odisha.</p>
          <div className="flex items-center gap-5">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Traceability Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
