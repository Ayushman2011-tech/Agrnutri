import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  QrCode,
  ShieldCheck,
  Star,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onOpenTraceability?: (batchId: string) => void;
  showWholesale?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenTraceability,
  showWholesale = false,
}) => {
  const { addToCart, wishlist, toggleWishlist, inspectBatch, openFoodScanner } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [showNutriModal, setShowNutriModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const isFavorite = wishlist.includes(product.id);
  const activePrice = showWholesale ? product.wholesalePrice : product.price;

  const handleTraceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenTraceability) {
      onOpenTraceability(product.batchId);
    } else {
      inspectBatch(product.batchId);
    }
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          {!imgError && product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-emerald-950/60 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-1.5" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-2">
                {product.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {product.category}
              </span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isOrganic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                100% Organic
              </span>
            )}
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500 text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                Featured Harvest
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
              isFavorite
                ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/80'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Quick QR Trace button on image overlay */}
          <button
            onClick={handleTraceClick}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-md hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 z-10"
            title="Inspect Batch Provenance & Journey"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
            <span className="text-[11px]">Trace Batch</span>
          </button>
        </div>

        {/* Product Details Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Origin Line */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                {product.sellerLocation.split(',')[0]}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {product.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Seller & Rating Bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px]">
                By {product.sellerName}
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Quick Nutrition Preview Pill & Info Trigger */}
            <div className="mt-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 px-2.5 py-1.5 rounded-lg text-[11px]">
              <div className="text-slate-600 dark:text-slate-300">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {product.nutritionalInfo.protein}g
                </span>{' '}
                Protein ·{' '}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {product.nutritionalInfo.calories}
                </span>{' '}
                kcal
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openFoodScanner(product.batchId)}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-0.5"
                  title="View verified ingredients, allergens, and 0.00 ppm chemical lab reports"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Lab Intel</span>
                </button>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <button
                  onClick={() => setShowNutriModal(true)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Facts</span>
                  <Info className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing & Cart Action Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{activePrice}
                </span>
                <span className="text-xs text-slate-500">/{product.unit}</span>
              </div>
              {showWholesale && (
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Wholesale (MOQ: {product.minWholesaleQty} {product.unit})
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => addToCart(product, quantity, showWholesale)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Nutrition Facts Dialog */}
      {showNutriModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Lab Certified Profile
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {product.title}
                </h4>
              </div>
              <button
                onClick={() => setShowNutriModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 divide-y divide-slate-200 dark:divide-slate-700 text-xs">
              <div className="py-1.5 flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Serving Size</span>
                <span>Per 100g</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Energy / Calories</span>
                <span className="font-semibold">{product.nutritionalInfo.calories} kcal</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Plant Protein</span>
                <span className="font-semibold text-emerald-600">{product.nutritionalInfo.protein} g</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Carbohydrates</span>
                <span className="font-semibold">{product.nutritionalInfo.carbohydrates} g</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Dietary Fiber</span>
                <span className="font-semibold">{product.nutritionalInfo.dietaryFiber} g</span>
              </div>
              {product.nutritionalInfo.ironMg !== undefined && (
                <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Iron</span>
                  <span className="font-semibold">{product.nutritionalInfo.ironMg} mg</span>
                </div>
              )}
              {product.nutritionalInfo.potassiumMg !== undefined && (
                <div className="py-1.5 flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Potassium</span>
                  <span className="font-semibold">{product.nutritionalInfo.potassiumMg} mg</span>
                </div>
              )}
            </div>

            <div className="mt-3">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highlights</h5>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.nutritionalInfo.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setShowNutriModal(false);
                  handleTraceClick({ stopPropagation: () => {} } as any);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                Inspect Farm QR
              </button>
              <button
                onClick={() => setShowNutriModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
