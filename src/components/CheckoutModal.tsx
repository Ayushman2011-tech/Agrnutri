import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  Truck,
  MapPin,
  Phone,
  User as UserIcon,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab?: (tab: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, setCurrentTab }) => {
  const { cart, cartTotal, placeOrder, currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name || 'Ayushman Panda',
    phone: '+91 98612 04982',
    pinCode: '768001',
    state: 'Odisha',
    city: 'Sambalpur',
    address: 'Plot 42, Krishi Vihar, Near Samaleswari Temple, Sambalpur',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery',
  });

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = cartTotal > 499 ? 0 : 40;
  const discount = cartTotal > 1000 ? 50 : 0;
  const grandTotal = cartTotal + deliveryFee - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
        paymentMethod: formData.paymentMethod,
      });

      setConfirmedOrder(order);
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {confirmedOrder ? 'Order Confirmed!' : 'Secure Farm-Fresh Checkout'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {confirmedOrder
                  ? `Invoice #${confirmedOrder.invoiceNumber}`
                  : 'Indian Rupee (₹) · Direct Producer Settlement'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Order Success & Printable Invoice State */
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Harvest Scheduled for Delivery!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900 dark:text-white">{confirmedOrder.customerName}</strong>.
                Your direct farm-to-table order has been transmitted to our regional Sambalpur & Mayurbhanj clusters.
              </p>
            </div>

            {/* Simulated Tax Invoice Box */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 text-xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <div className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                    AgriNutri Farm 2.0
                  </div>
                  <div className="text-[11px] text-slate-500">
                    FSSAI License: 12026999000182 · Tax Invoice
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Order #{confirmedOrder.id}
                  </div>
                  <div className="text-[11px] text-slate-400">{confirmedOrder.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-slate-400">Deliver To:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmedOrder.customerName}
                  </p>
                  <p className="text-slate-500">{confirmedOrder.customerAddress}</p>
                  <p className="text-slate-500">{confirmedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Summary:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Method: {confirmedOrder.paymentMethod}
                  </p>
                  <p className="text-slate-500">Status: {confirmedOrder.paymentStatus}</p>
                  <p className="text-slate-500">
                    Est. Arrival: {confirmedOrder.deliveryDateEstimated}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-400 text-[10px] uppercase">
                  <span>Item</span>
                  <span>Total</span>
                </div>
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>
                      {it.quantity}x {it.product.title} ({it.product.unit})
                    </span>
                    <span className="font-semibold">
                      ₹{(it.isWholesale ? it.product.wholesalePrice : it.product.price) * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Total Paid (INR)</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{confirmedOrder.total}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                  if (setCurrentTab) {
                    setCurrentTab('orders');
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track in Your Orders</span>
              </button>
              <button
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            {/* Address Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Delivery Destination (India)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Indian Payment Gateway
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['UPI', 'Card', 'NetBanking', 'Cash on Delivery'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setFormData({ ...formData, paymentMethod: mode })}
                    className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                      formData.paymentMethod === mode
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div>{mode}</div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {mode === 'UPI' ? 'GPay, PhonePe, Paytm' : mode === 'Card' ? 'RuPay, Visa, MC' : 'Zero Fee'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Doorstep Eco-Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Farm-Direct Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Payable Amount (₹)</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{grandTotal}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Confirming with Producer Hub...' : `Pay ₹${grandTotal} & Confirm Order`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
