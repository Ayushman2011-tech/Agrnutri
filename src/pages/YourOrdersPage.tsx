import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Printer,
  RotateCcw,
  QrCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  AlertCircle,
  Thermometer,
  Layers,
  ShoppingBag,
  Building2,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderTrackingStage } from '../types';

interface YourOrdersPageProps {
  setCurrentTab: (tab: string) => void;
}

export const YourOrdersPage: React.FC<YourOrdersPageProps> = ({ setCurrentTab }) => {
  const { orders, addToCart, inspectBatch, openFoodScanner, showNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Transit' | 'Processing' | 'Delivered'>('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({
    'ORD-98210': true, // Expand active order by default
  });
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const toggleTimeline = (orderId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === 'In Transit' && order.status !== 'Dispatched') return false;
      if (statusFilter === 'Processing' && order.status !== 'Processing' && order.status !== 'Harvested') return false;
      if (statusFilter === 'Delivered' && order.status !== 'Delivered') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesInvoice = order.invoiceNumber.toLowerCase().includes(query);
        const matchesTracking = order.trackingNumber?.toLowerCase().includes(query) ?? false;
        const matchesCustomer = order.customerName.toLowerCase().includes(query);
        const matchesProduct = order.items.some((item) =>
          item.product.title.toLowerCase().includes(query) ||
          item.product.sellerName.toLowerCase().includes(query) ||
          item.product.sellerLocation.toLowerCase().includes(query)
        );
        const matchesShipping = order.shippingPlace?.toLowerCase().includes(query) ?? false;
        return matchesId || matchesInvoice || matchesTracking || matchesCustomer || matchesProduct || matchesShipping;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const activeInTransitCount = orders.filter((o) => o.status === 'Dispatched').length;
  const processingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Harvested').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const totalExpenditure = orders.reduce((sum, o) => sum + o.total, 0);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.isWholesale);
    });
    showNotification(`Re-added ${order.items.length} items from order #${order.id} to cart!`);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            In Transit & Dispatched
          </span>
        );
      case 'Harvested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Dawn Harvested & Packed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            Farm Order Confirmed
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Delivered Fresh
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getStageCompletionPercent = (order: Order) => {
    if (order.status === 'Delivered') return 100;
    if (order.status === 'Dispatched') return 65;
    if (order.status === 'Harvested') return 35;
    if (order.status === 'Processing') return 15;
    return 0;
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-600/50">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Farm-to-Table Shipment Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Your Orders & Live Logistics Radar
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Monitor every stage of your order in real time: origin harvest hubs, places of shipping with verified departure dates,
            inter-district refrigerated transit status, carrier tracking codes, and scheduled doorstep delivery.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentTab('logistics')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Truck className="w-3.5 h-3.5 text-slate-950" />
              <span>Open AI Logistics & Delivery Optimizer →</span>
            </button>
            <button
              onClick={() => openFoodScanner()}
              className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-600/60 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Food Intelligence Scanner</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-emerald-700/50 relative z-10">
          <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="text-[11px] text-emerald-300 font-medium">Total Orders Placed</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{orders.length}</div>
          </div>
          <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="text-[11px] text-emerald-300 font-medium">In Transit / Dispatched</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{activeInTransitCount}</div>
          </div>
          <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="text-[11px] text-emerald-300 font-medium">Delivered Fresh</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">{deliveredCount}</div>
          </div>
          <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/40">
            <div className="text-[11px] text-emerald-300 font-medium">Direct Farm Value</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">₹{totalExpenditure}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (ORD-98210), crop name, place of shipping, or tracking number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Track Input Direct Jump */}
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Filter by Status:
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'In Transit', 'Processing', 'Delivered'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === filterKey
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {filterKey === 'All' && `All Orders (${orders.length})`}
                  {filterKey === 'In Transit' && `In Transit (${activeInTransitCount})`}
                  {filterKey === 'Processing' && `Harvesting (${processingCount})`}
                  {filterKey === 'Delivered' && `Delivered (${deliveredCount})`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List Container */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching orders found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No orders matched your search "${searchQuery}". Check the Order ID or product keywords.`
              : 'You do not have any orders in this status category.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setCurrentTab('marketplace');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Natural Odisha Marketplace</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isTimelineExpanded = expandedTimelines[order.id] ?? false;
            const progressPercent = getStageCompletionPercent(order);

            return (
              <div
                key={order.id}
                id={`order-${order.id}`}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Top Summary Bar */}
                <div className="bg-slate-50/80 dark:bg-slate-850/60 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                      {order.temperatureControlled && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                          <Thermometer className="w-3 h-3 text-cyan-500" />
                          <span>Cold-Chain 4°C Monitored</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Ordered on: <strong className="text-slate-700 dark:text-slate-300">{order.date}</strong></span>
                      <span>·</span>
                      <span>Invoice: <strong className="font-mono text-slate-700 dark:text-slate-300">{order.invoiceNumber}</strong></span>
                      <span>·</span>
                      <span>Payment: <strong className="text-slate-700 dark:text-slate-300">{order.paymentMethod} ({order.paymentStatus})</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setInvoiceModalOrder(order)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      title="View printable tax invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Invoice Receipt</span>
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
                      title="Re-add all items to your cart"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Buy Again</span>
                    </button>
                  </div>
                </div>

                {/* Tracking Milestones Highlight Banner */}
                <div className="p-4 sm:p-6 bg-emerald-50/30 dark:bg-emerald-950/10 border-b border-slate-200 dark:border-slate-700/60">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Place of Shipping with Date */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Place of Shipping & Dispatch Date</span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                        {order.shippingPlace || 'Regional AgriNutri Bio-Hub, Odisha'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Dispatched on: <strong>{order.shippingDate || order.date}</strong></span>
                      </div>
                    </div>

                    {/* Current Stage & Location */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                        <Truck className="w-4 h-4 text-amber-500" />
                        <span>Current Stage & Location</span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                        {order.currentStage || 'Order in Transit'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">Hub: <strong>{order.currentLocation || 'State Transit Hub'}</strong></span>
                      </div>
                      {order.trackingNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          AWB: {order.trackingNumber} ({order.carrierName || 'Agri-Logistics'})
                        </div>
                      )}
                    </div>

                    {/* Delivery Date & Destination */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Delivery Schedule & Destination</span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                        {order.actualDeliveryDate
                          ? `Delivered: ${order.actualDeliveryDate}`
                          : `Estimated Delivery: ${order.deliveryDateEstimated}`}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{order.customerAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Visual Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-600 dark:text-slate-300">Shipment Journey Progress</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}% Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Collapsible Timeline Stages */}
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700/80">
                  <button
                    onClick={() => toggleTimeline(order.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Stage-by-Stage Shipment Journey Log ({order.trackingStages?.length || 5} Milestones)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <span>{isTimelineExpanded ? 'Collapse Timeline' : 'View Detailed Stages'}</span>
                      {isTimelineExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isTimelineExpanded && (
                    <div className="mt-5 space-y-4 pt-2">
                      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                        {order.trackingStages?.map((stage, idx) => (
                          <div key={stage.id} className="relative group">
                            {/* Marker Dot */}
                            <div
                              className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                stage.isCurrent
                                  ? 'bg-amber-500 border-white dark:border-slate-900 shadow-md ring-4 ring-amber-500/20'
                                  : stage.isCompleted
                                  ? 'bg-emerald-600 border-white dark:border-slate-900'
                                  : 'bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-900'
                              }`}
                            >
                              {stage.isCompleted && !stage.isCurrent && (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              )}
                              {stage.isCurrent && (
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                              )}
                            </div>

                            {/* Stage Content */}
                            <div
                              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                stage.isCurrent
                                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-xs'
                                  : stage.isCompleted
                                  ? 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-700/80'
                                  : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                                    {stage.title}
                                  </span>
                                  {stage.isCurrent && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                                      Active Current Stage
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                  {stage.timestamp}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">
                                {stage.description}
                              </p>

                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span>{stage.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Items Breakdown */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Product Items in this Order ({order.items.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      Total: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹{order.total}</strong>
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {order.items.map((item, itemIdx) => {
                      const itemTotal = (item.isWholesale ? item.product.wholesalePrice : item.product.price) * item.quantity;

                      return (
                        <div
                          key={`${order.id}-item-${itemIdx}`}
                          className="py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            {/* Product Thumbnail */}
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                            />

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {item.product.title}
                                </h5>
                                {item.product.isOrganic && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>100% Organic</span>
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                                <span>Category: <strong className="text-slate-700 dark:text-slate-300">{item.product.category}</strong></span>
                                <span>·</span>
                                <span>Farm: <strong className="text-slate-700 dark:text-slate-300">{item.product.sellerName} ({item.product.sellerLocation})</strong></span>
                              </div>

                              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                <span>Qty: <strong className="text-slate-700 dark:text-slate-300">{item.quantity} {item.product.unit}</strong></span>
                                <span>·</span>
                                <span>Rate: ₹{item.isWholesale ? item.product.wholesalePrice : item.product.price} / {item.product.unit}</span>
                              </div>
                            </div>
                          </div>

                          {/* Item Pricing & Trace Button */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                            <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                              ₹{itemTotal}
                            </div>
                            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-1.5">
                              <button
                                onClick={() => openFoodScanner(item.product.batchId)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                                title="View ingredients, allergens, and certified laboratory reports"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span className="text-[10px] font-bold">Food Lab Intelligence</span>
                              </button>
                              <button
                                onClick={() => inspectBatch(item.product.batchId)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                                title="Inspect full batch provenance and harvest journey"
                              >
                                <QrCode className="w-3 h-3 text-emerald-600" />
                                <span className="text-[10px]">Trace Batch</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Breakdown Note */}
                <div className="bg-slate-50 dark:bg-slate-850/50 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Every batch tested for 0.00 ppm chemical residues · Guaranteed Fresh Harvest</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Subtotal: ₹{order.subtotal}</span>
                    <span>Shipping: {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                    {order.discount > 0 && <span className="text-emerald-600 font-semibold">Discount: -₹{order.discount}</span>}
                    <span>Total: <strong className="text-slate-900 dark:text-white text-xs">₹{order.total}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative my-8">
            <button
              onClick={() => setInvoiceModalOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    AgriNutri Farm 2.0
                  </div>
                  <div className="text-xs text-slate-500">
                    Direct Farm-to-Consumer Ecosystem · Odisha Bio-Network
                  </div>
                  <div className="text-[11px] text-slate-400">
                    FSSAI Reg: 12026999000182 · GSTIN: 21AAACA0000A1Z5
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tax Invoice
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {invoiceModalOrder.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-500">Date: {invoiceModalOrder.date}</div>
                </div>
              </div>
            </div>

            {/* Billed To & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Billed To / Recipient:
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {invoiceModalOrder.customerName}
                </div>
                <div className="text-slate-500 text-[11px] leading-relaxed">
                  {invoiceModalOrder.customerAddress}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Phone: {invoiceModalOrder.customerPhone}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dispatch & Shipping Details:
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Origin: {invoiceModalOrder.shippingPlace || 'Sambalpur Farm Hub'}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Dispatched: {invoiceModalOrder.shippingDate || invoiceModalOrder.date}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Tracking AWB: {invoiceModalOrder.trackingNumber || 'OD-AGRI-EXP-88912'}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Payment: {invoiceModalOrder.paymentMethod} ({invoiceModalOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Table of Items */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Purchased Farm Items
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                {invoiceModalOrder.items.map((item, i) => {
                  const price = item.isWholesale ? item.product.wholesalePrice : item.product.price;
                  return (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.product.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.product.unit} × ₹{price} · Batch: {item.product.batchId}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        ₹{price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice Total Calculation */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{invoiceModalOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery & Reefer Handling</span>
                <span>{invoiceModalOrder.deliveryFee === 0 ? 'FREE' : `₹${invoiceModalOrder.deliveryFee}`}</span>
              </div>
              {invoiceModalOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Farm Direct Discount</span>
                  <span>-₹{invoiceModalOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount Paid</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{invoiceModalOrder.total}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
