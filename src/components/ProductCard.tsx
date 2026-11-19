import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  QrCode,
  ShieldCheck,
  Star,
  Sparkles,
  Leaf,
  MapPin,
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
  const [showNutriModal, setShowNutriModal] = useState(false);
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
      <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400/60 dark:hover:border-emerald-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
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
            <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-4 text-center">
              <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-1.5" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                {product.title}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">{product.category}</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.isOrganic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600/95 text-white shadow-sm backdrop-blur-xs">
                <Leaf className="w-3 h-3" />
                Organic
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/75 text-emerald-300 backdrop-blur-xs font-mono">
              {product.batchId.split('-').slice(-1)[0]}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-xs transition-all ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* QR Trace Action */}
          <button
            onClick={handleTraceClick}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white shadow-md transition-colors inline-flex items-center gap-1"
            title="Inspect Batch Provenance"
          >
            <QrCode className="w-3 h-3" />
            <span>QR Trace</span>
          </button>
        </div>

        {/* Product Details Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <span className="truncate">{product.category}</span>
              <span className="inline-flex items-center gap-0.5 text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                <MapPin className="w-3 h-3 text-emerald-500" />
                {product.sellerLocation.split(',')[0]}
              </span>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {product.title}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Seller & Rating */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate max-w-[155px] font-medium">{product.sellerName}</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
              </span>
            </div>

            {/* Nutrition & Lab Intelligence Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {product.nutritionalInfo.protein}g Pro · {product.nutritionalInfo.calories} kcal
              </span>
              <div className="flex items-center gap-2 font-bold">
                <button
                  onClick={() => openFoodScanner(product.batchId)}
                  className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Lab Scan</span>
                </button>
                <button
                  onClick={() => setShowNutriModal(true)}
                  className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:underline"
                >
                  Facts
                </button>
              </div>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹{activePrice}
                </span>
                <span className="text-[11px] text-slate-500">/{product.unit}</span>
              </div>
              {showWholesale && (
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  MOQ: {product.minWholesaleQty} {product.unit}
                </div>
              )}
            </div>

            <button
              onClick={() => addToCart(product, 1, showWholesale)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mini Nutrition Facts Dialog */}
      {showNutriModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Laboratory Certified Nutrition
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {product.title}
                </h4>
              </div>
              <button
                onClick={() => setShowNutriModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 border-t border-b border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2 flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Serving Size</span>
                <span>Per 100g</span>
              </div>
              <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Energy / Calories</span>
                <span className="font-semibold">{product.nutritionalInfo.calories} kcal</span>
              </div>
              <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Plant Protein</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {product.nutritionalInfo.protein} g
                </span>
              </div>
              <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Carbohydrates</span>
                <span className="font-semibold">{product.nutritionalInfo.carbohydrates} g</span>
              </div>
              <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                <span>Dietary Fiber</span>
                <span className="font-semibold">{product.nutritionalInfo.dietaryFiber} g</span>
              </div>
              {product.nutritionalInfo.ironMg !== undefined && (
                <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Iron</span>
                  <span className="font-semibold">{product.nutritionalInfo.ironMg} mg</span>
                </div>
              )}
              {product.nutritionalInfo.potassiumMg !== undefined && (
                <div className="py-2 flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Potassium</span>
                  <span className="font-semibold">{product.nutritionalInfo.potassiumMg} mg</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.nutritionalInfo.highlights.map((hl, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                >
                  {hl}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setShowNutriModal(false);
                  handleTraceClick({ stopPropagation: () => {} } as any);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition-colors"
              >
                Inspect Farm QR
              </button>
              <button
                onClick={() => setShowNutriModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 transition-colors"
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
