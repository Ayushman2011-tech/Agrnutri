/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { SmartFarmingPage } from './pages/SmartFarmingPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { MembershipPage } from './pages/MembershipPage';
import { FoundersPage } from './pages/FoundersPage';
import { FarmerTutorialsPage } from './pages/FarmerTutorialsPage';
import { YourOrdersPage } from './pages/YourOrdersPage';
import { LogisticsOptimizerPage } from './pages/LogisticsOptimizerPage';
import { FarmerDashboard } from './pages/dashboards/FarmerDashboard';
import { ProducerDashboard } from './pages/dashboards/ProducerDashboard';
import { RetailerDashboard } from './pages/dashboards/RetailerDashboard';
import { ConsumerDashboard } from './pages/dashboards/ConsumerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { QRScannerModal } from './components/QRScannerModal';
import { SmartFoodIntelligenceModal } from './components/SmartFoodIntelligenceModal';
import { TraceabilityDetailModal } from './components/TraceabilityDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthRoleModal } from './components/AuthRoleModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { activeRole, notification, isFoodScannerOpen, setIsFoodScannerOpen, activeFoodScanBatchId } = useApp();

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage setCurrentTab={setCurrentTab} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'smart-farming':
        return <SmartFarmingPage setCurrentTab={setCurrentTab} />;
      case 'tutorials':
        return <FarmerTutorialsPage />;
      case 'sustainability':
        return <SustainabilityPage />;
      case 'logistics':
        return <LogisticsOptimizerPage setCurrentTab={setCurrentTab} />;
      case 'pricing':
        return <MembershipPage />;
      case 'founders':
        return <FoundersPage setCurrentTab={setCurrentTab} />;
      case 'orders':
        return <YourOrdersPage setCurrentTab={setCurrentTab} />;
      case 'dashboard':
        switch (activeRole) {
          case 'Farmer':
            return <FarmerDashboard setCurrentTab={setCurrentTab} />;
          case 'Producer':
            return <ProducerDashboard />;
          case 'Retailer':
            return <RetailerDashboard />;
          case 'Consumer':
            return <ConsumerDashboard />;
          case 'Admin':
            return <AdminDashboard />;
          default:
            return <FarmerDashboard setCurrentTab={setCurrentTab} />;
        }
      default:
        return <HomePage setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 dark:bg-emerald-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main View Area */}
      <main className="flex-1">{renderContent()}</main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Global Interactive Modals & Drawers */}
      <AIAssistantModal />
      <QRScannerModal />
      <SmartFoodIntelligenceModal
        isOpen={isFoodScannerOpen}
        onClose={() => setIsFoodScannerOpen(false)}
        initialBatchId={activeFoodScanBatchId}
      />
      <TraceabilityDetailModal />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        setCurrentTab={setCurrentTab}
      />
      <AuthRoleModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
