import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Tractor,
  Factory,
  Store,
  Users,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MembershipPlan } from '../types';

export const MembershipPage: React.FC = () => {
  const { membershipPlans, subscribeToPlan, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'Farmer' | 'Producer' | 'Retailer' | 'Consumer'>('Farmer');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activePlanModal, setActivePlanModal] = useState<MembershipPlan | null>(null);

  const filteredPlans = membershipPlans.filter((p) => p.category === selectedCategory);

  const handleSubscribeClick = (plan: MembershipPlan) => {
    if (plan.monthlyPrice === 0) {
      subscribeToPlan(plan);
      return;
    }
    setActivePlanModal(plan);
  };

  const handleConfirmSubscription = () => {
    if (activePlanModal) {
      subscribeToPlan(activePlanModal);
      setActivePlanModal(null);
    }
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Transparent Ecosystem Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Membership & Pricing Plans
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Choose a tailored tier designed for your scale. From individual farmers in Sambalpur to multi-facility
          producers and health-conscious families across India.
        </p>

        {/* Category Switcher Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {(['Farmer', 'Producer', 'Retailer', 'Consumer'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'Farmer' && <Tractor className="w-3.5 h-3.5" />}
              {cat === 'Producer' && <Factory className="w-3.5 h-3.5" />}
              {cat === 'Retailer' && <Store className="w-3.5 h-3.5" />}
              {cat === 'Consumer' && <Users className="w-3.5 h-3.5" />}
              <span>{cat} Plans</span>
            </button>
          ))}
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className={billingCycle === 'monthly' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 p-1 transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-emerald-600 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={billingCycle === 'annual' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
            Annual Billing{' '}
            <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-extrabold ml-1">
              SAVE 20%
            </span>
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {filteredPlans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isCurrentTier = currentUser.membershipTier?.includes(plan.name);

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {plan.badgeText && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                  {plan.badgeText}
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {isCurrentTier && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Active Plan
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-4 mb-6">
                  {price === 0 ? (
                    <div className="text-3xl font-black text-slate-900 dark:text-white">Free</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        ₹{price}
                      </span>
                      <span className="text-xs text-slate-500">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {price === 0 ? 'No credit card required' : 'Configurable in INR · Cancel anytime'}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Benefits
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleSubscribeClick(plan)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isCurrentTier
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 cursor-default'
                      : plan.isPopular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                  }`}
                >
                  {isCurrentTier ? 'Current Active Tier' : price === 0 ? 'Activate Free Plan' : 'Select & Subscribe'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Indian Payment Gateway Dialog */}
      {activePlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Razorpay Secure Gateway (Test Mode)
                </h3>
              </div>
              <button
                onClick={() => setActivePlanModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Selected Tier</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activePlanModal.name} ({activePlanModal.category})
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Billing Period</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {billingCycle}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Merchant</span>
                <span className="text-slate-800 dark:text-slate-200">AgriNutri Farm 2.0 (Odisha)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Amount Due</span>
                <span className="text-emerald-600">
                  ₹{billingCycle === 'annual' ? activePlanModal.annualPrice : activePlanModal.monthlyPrice}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              🔒 256-bit SSL encrypted. Test mode authorized for platform evaluation. No actual charge will be debited.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActivePlanModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscription}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
              >
                Authorize & Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
