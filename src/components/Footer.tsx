import React from 'react';
import { Sprout, Heart, ShieldCheck, Phone, MapPin, Mail, Award, ExternalLink, Leaf } from 'lucide-react';
import { FOUNDERS } from '../data/mockData';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Founders Spotlight Banner inside Footer */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-950/60 to-slate-900 p-6 rounded-2xl border border-emerald-900/50">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Leadership & Founders</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">Roots in Odisha, India</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Conceived & Led by Ayushman Panda & Gourav Soren
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Originating from the award-winning <strong className="text-emerald-300">AgriNutri V1.0 Prototype</strong>,
                  Ayushman Panda (Sambalpur) and Gourav Soren (Mayurbhanj) designed AgriNutri Farm 2.0 to establish
                  India’s foremost intelligent circular farm-to-consumer ecosystem.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentTab('founders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="shrink-0 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all hover:scale-105"
            >
              Read Founders Story →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                AgriNutri <span className="text-emerald-400">Farm 2.0</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              From Smart Farming to Trusted Food. An intelligent agricultural ecosystem bridging Farmers,
              Producers/Processors, Retailers, and Consumers with real-time AI guidance, transparent QR batch
              provenance, circular waste upcycling, and fair-trade marketplace economics.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Chemical Residue Verified
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                NPOP / FSSAI Aligned
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Natural Farm Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Your Orders & Shipment Tracking</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">Live</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('smart-farming');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Smart Farming & Weather
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('tutorials');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Farmer Video Academy</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('sustainability');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Sustainability Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('pricing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Membership & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('founders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Founders & Origin Story
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Dashboards</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-emerald-400 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  Farmer Cultivation Hub
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  Producer Processing Unit
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  Retailer Wholesale Portal
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  Consumer Nutrition Cart
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
                  Administrator Oversight
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Odisha Hubs & Helpline</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sambalpur Innovation Lab & Mayurbhanj Bio-Venture Center, Odisha</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kisan Helpline: 1800-180-1551 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@agrinutrifarm.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgriNutri Farm 2.0. Conceived with pride by Ayushman Panda & Gourav Soren.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Traceability Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
