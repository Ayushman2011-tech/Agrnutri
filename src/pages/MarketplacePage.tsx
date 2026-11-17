import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  MapPin,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

export const MarketplacePage: React.FC = () => {
  const { products, inspectBatch } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [isWholesaleMode, setIsWholesaleMode] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'harvest-date'>('featured');

  const categories = [
    'All',
    'Fresh Vegetables',
    'Farm Fresh Fruits',
    'Specialty Coffee & Beverages',
    'Wild Forest Honey & Wellness',
    'Indigenous Grains & Millets',
    'Organic Pulses',
    'Cold-Pressed Oils & Spices',
    'Farm Seeds & Bio-Inputs',
  ];

  const locations = [
    'All',
    'Sambalpur',
    'Koraput',
    'Kandhamal',
    'Mayurbhanj',
    'Rayagada',
    'Dhenkanal',
    'Nayagarh',
    'Kalahandi',
    'Sundargarh',
    'Puri',
    'Ganjam',
    'Keonjhar',
    'Bargarh',
    'Bhubaneswar',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (
        searchQuery &&
        !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Location
      if (selectedLocation !== 'All' && !p.sellerLocation.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Organic only
      if (organicOnly && !p.isOrganic) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = isWholesaleMode ? a.wholesalePrice : a.price;
      const priceB = isWholesaleMode ? b.wholesalePrice : b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'harvest-date') return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedLocation, organicOnly, isWholesaleMode, sortBy]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-600/50">
            <Leaf className="w-3.5 h-3.5" />
            <span>Multi-Vendor Natural Farm Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Fresh, Traceable Produce Direct from Odisha’s Cultivators
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Every item is sourced directly from verified farmers and bio-processors. View harvest dates,
            lab-tested nutritional facts, and complete batch journeys with single-click QR verification.
          </p>
        </div>

        {/* Wholesale Switcher Pill */}
        <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-600/60 text-xs shrink-0 w-full sm:w-auto">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <div className="font-bold text-white text-xs">Wholesale B2B Mode</div>
              <div className="text-[10px] text-emerald-300">Bulk pricing with MOQs</div>
            </div>
            <button
              onClick={() => setIsWholesaleMode(!isWholesaleMode)}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                isWholesaleMode ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-900 transition-transform ${
                  isWholesaleMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-emerald-200">
            {isWholesaleMode
              ? 'Showing wholesale commercial rates for retailers & processors.'
              : 'Showing standard retail prices for individual consumers.'}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm produce, turmeric, black rice, mangoes, honey..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* District / Location Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Districts / Hubs' : `Hub: ${loc}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="featured">Sort: Featured Harvest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="harvest-date">Newest Harvest Date</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Organic checkbox filter */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors flex items-center gap-1.5 ml-auto ${
              organicOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Organic Only</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span>Showing {filteredProducts.length} verified farm items</span>
          {isWholesaleMode && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Wholesale pricing active (Minimum Order Quantities apply)
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              No matching farm products found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to explore all available crops.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLocation('All');
                setOrganicOnly(false);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showWholesale={isWholesaleMode}
                onOpenTraceability={(bId) => inspectBatch(bId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
