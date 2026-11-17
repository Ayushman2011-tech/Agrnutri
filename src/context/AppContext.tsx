import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Product,
  CartItem,
  Order,
  OrderTrackingStage,
  BatchTraceability,
  MembershipPlan,
  TelemetrySensorData,
} from '../types';
import {
  INITIAL_PRODUCTS,
  SAMPLE_BATCHES,
  INITIAL_MEMBERSHIP_PLANS,
  INITIAL_TELEMETRY,
  INITIAL_USERS,
  INITIAL_ORDERS,
} from '../data/mockData';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, isWholesale?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  placeOrder: (details: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    newStatus: Order['status'],
    newStageName?: OrderTrackingStage['stageName'],
    locationNote?: string
  ) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  cancelOrder: (orderId: string) => void;
  activeBatch: BatchTraceability | null;
  setActiveBatch: (batch: BatchTraceability | null) => void;
  inspectBatch: (batchId: string) => BatchTraceability | null;
  batchesRegistry: Record<string, BatchTraceability>;
  registerBatch: (batch: BatchTraceability) => void;
  membershipPlans: MembershipPlan[];
  updateMembershipPrice: (planId: string, monthly: number, annual: number) => void;
  subscribeToPlan: (plan: MembershipPlan) => void;
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  telemetry: TelemetrySensorData;
  togglePump: () => void;
  simulateRain: () => void;
  logCompostWaste: (kg: number) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: (open: boolean) => void;
  isFoodScannerOpen: boolean;
  setIsFoodScannerOpen: (open: boolean) => void;
  activeFoodScanBatchId: string | null;
  openFoodScanner: (batchId?: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default Ayushman Panda (Founder/Admin)
  const [activeRole, setActiveRole] = useState<UserRole>('Farmer');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-2']);
  const [batchesRegistry, setBatchesRegistry] = useState<Record<string, BatchTraceability>>(SAMPLE_BATCHES);
  const [activeBatch, setActiveBatch] = useState<BatchTraceability | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);
  const [commissionRate, setCommissionRate] = useState<number>(5.0);
  const [telemetry, setTelemetry] = useState<TelemetrySensorData>(INITIAL_TELEMETRY);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals & Drawers
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isFoodScannerOpen, setIsFoodScannerOpen] = useState(false);
  const [activeFoodScanBatchId, setActiveFoodScanBatchId] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openFoodScanner = (batchId?: string) => {
    if (batchId) {
      setActiveFoodScanBatchId(batchId);
    }
    setIsFoodScannerOpen(true);
  };

  // Initial Orders with full tracking
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  useEffect(() => {
    // Sync HTML dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const addToCart = (product: Product, quantity = 1, isWholesale = false) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.isWholesale === isWholesale
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isWholesale === isWholesale
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isWholesale }];
    });
    showNotification(`Added ${quantity} ${product.unit} of ${product.title} to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Removed item from your saved favorites');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Saved to your farm-to-table favorites!');
        return [...prev, productId];
      }
    });
  };

  const placeOrder = (details: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  }) => {
    const deliveryFee = cartTotal > 499 ? 0 : 40;
    const discount = cartTotal > 1000 ? 50 : 0;
    const finalTotal = cartTotal + deliveryFee - discount;

    const primarySellerLocation = cart[0]?.product.sellerLocation || 'Sambalpur Farm Hub, Odisha';
    const primarySellerName = cart[0]?.product.sellerName || 'AgriNutri Farm Cohort';
    const hasPerishables = cart.some((i) => i.product.category === 'Fresh Vegetables' || i.product.category === 'Farm Fresh Fruits');
    const orderDateStr = new Date().toISOString().split('T')[0];
    const orderTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const estDeliveryDate = new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0];
    const trackingNo = `OD-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: orderDateStr,
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee,
      discount,
      total: finalTotal,
      status: 'Processing',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerAddress: details.customerAddress,
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      deliveryDateEstimated: `${estDeliveryDate} (By 04:00 PM)`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shippingPlace: `${primarySellerLocation} (AgriNutri Dispatch Center)`,
      shippingDate: `Scheduled on ${new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]} 08:00 AM`,
      currentStage: 'Order Transmitted to Farmer Cohort for Fresh Harvest Schedule',
      currentLocation: `${primarySellerLocation} Cluster`,
      carrierName: 'Odisha Green Agri-Logistics Express',
      trackingNumber: trackingNo,
      temperatureControlled: hasPerishables,
      trackingStages: [
        {
          id: 'stg-1',
          stageName: 'Order Confirmed',
          title: 'Order Confirmed & Farm Notified',
          description: `Payment status: ${details.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery Scheduled' : 'Verified via ' + details.paymentMethod}. Direct farm order assigned to ${primarySellerName}.`,
          location: 'AgriNutri Platform Hub',
          timestamp: `${orderDateStr} ${orderTimeStr}`,
          isCompleted: true,
          isCurrent: true,
        },
        {
          id: 'stg-2',
          stageName: 'Harvested & Packed',
          title: 'Dawn Hand-Harvest & Quality Sorting',
          location: `${primarySellerLocation}`,
          timestamp: `Scheduled for tomorrow dawn (06:00 AM)`,
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 'stg-3',
          stageName: 'Dispatched / Shipped',
          title: `Dispatch from ${primarySellerLocation} (Place of Shipping)`,
          location: `${primarySellerLocation} Solar Hub`,
          timestamp: `Scheduled tomorrow 08:30 AM`,
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 'stg-4',
          stageName: 'In Transit',
          title: 'Refrigerated Green Transit Corridor',
          location: 'Regional Inter-District Hub',
          timestamp: `Expected ${new Date(Date.now() + 36 * 3600 * 1000).toISOString().split('T')[0]}`,
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 'stg-5',
          stageName: 'Delivered',
          title: 'Doorstep Delivery & Verification',
          location: details.customerAddress,
          timestamp: `Estimated ${estDeliveryDate} 04:00 PM`,
          isCompleted: false,
          isCurrent: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showNotification(`Order #${newOrder.id} confirmed! Harvest dispatch scheduled.`);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: Order['status'],
    newStageName?: OrderTrackingStage['stageName'],
    locationNote?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedStages = (ord.trackingStages || []).map((stage) => {
          if (newStatus === 'Delivered') {
            return {
              ...stage,
              isCompleted: true,
              isCurrent: stage.stageName === 'Delivered',
            };
          }

          if (newStageName) {
            const stagesOrder: OrderTrackingStage['stageName'][] = [
              'Order Confirmed',
              'Harvested & Packed',
              'Dispatched / Shipped',
              'In Transit',
              'Out for Delivery',
              'Delivered',
            ];
            const targetIdx = stagesOrder.indexOf(newStageName);
            const thisIdx = stagesOrder.indexOf(stage.stageName);

            return {
              ...stage,
              isCompleted: thisIdx <= targetIdx,
              isCurrent: thisIdx === targetIdx,
              location:
                thisIdx === targetIdx && locationNote ? locationNote : stage.location,
            };
          }

          return stage;
        });

        const nowStr = new Date().toISOString().split('T')[0];

        return {
          ...ord,
          status: newStatus,
          currentStage: newStageName
            ? `Stage: ${newStageName}`
            : newStatus === 'Delivered'
            ? 'Delivered Fresh to Doorstep'
            : ord.currentStage,
          currentLocation: locationNote || ord.currentLocation,
          deliveredDate: newStatus === 'Delivered' ? nowStr : ord.deliveredDate,
          trackingStages: updatedStages,
        };
      })
    );
    showNotification(`Order #${orderId} status updated to ${newStatus} with live tracking sync.`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showNotification(`Product details & pricing updated in active catalog.`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'Cancelled',
              currentStage: 'Order Cancelled by Customer / Admin',
            }
          : ord
      )
    );
    showNotification(`Order #${orderId} has been cancelled.`);
  };

  const inspectBatch = (batchId: string): BatchTraceability | null => {
    const cleaned = batchId.trim().toUpperCase();
    const batch = batchesRegistry[cleaned];
    if (batch) {
      setActiveBatch(batch);
      return batch;
    }
    // Check if partial match
    const foundKey = Object.keys(batchesRegistry).find((k) => k.includes(cleaned));
    if (foundKey) {
      setActiveBatch(batchesRegistry[foundKey]);
      return batchesRegistry[foundKey];
    }
    return null;
  };

  const registerBatch = (batch: BatchTraceability) => {
    setBatchesRegistry((prev) => ({
      ...prev,
      [batch.batchId]: batch,
    }));
    showNotification(`Traceability batch ${batch.batchId} registered on secure ledger!`);
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProd, ...prev]);
    showNotification(`"${newProd.title}" listed successfully on marketplace!`);
  };

  const updateMembershipPrice = (planId: string, monthly: number, annual: number) => {
    setMembershipPlans((prev) =>
      prev.map((p) =>
        p.id === planId ? { ...p, monthlyPrice: monthly, annualPrice: annual } : p
      )
    );
    showNotification('Membership plan rates updated successfully by Administrator.');
  };

  const subscribeToPlan = (plan: MembershipPlan) => {
    setCurrentUser((prev) => ({
      ...prev,
      membershipTier: `${plan.name} (${plan.category})`,
    }));
    showNotification(`Subscribed to ${plan.name} tier! Welcome to privileged access.`);
  };

  const togglePump = () => {
    setTelemetry((prev) => {
      const nextStatus = prev.irrigationPumpStatus === 'Active' ? 'Idle' : 'Active';
      const msg =
        nextStatus === 'Active'
          ? 'Solar drip irrigation pump ACTIVATED. Monitoring soil absorption.'
          : 'Solar drip irrigation pump IDLE. Water conserved.';
      showNotification(msg);
      return {
        ...prev,
        irrigationPumpStatus: nextStatus,
        soilMoisture: nextStatus === 'Active' ? Math.min(65, prev.soilMoisture + 1.2) : prev.soilMoisture,
      };
    });
  };

  const simulateRain = () => {
    setTelemetry((prev) => {
      const newMoisture = Math.min(85, prev.soilMoisture + 8.5);
      const newTank = Math.min(100, prev.rainwaterTankLevel + 12.0);
      showNotification('Simulated 25mm rain showers recorded! Rainwater reservoir replenished.');
      return {
        ...prev,
        soilMoisture: newMoisture,
        rainfallLast24h: prev.rainfallLast24h + 25,
        rainwaterTankLevel: newTank,
        irrigationPumpStatus: 'Idle',
      };
    });
  };

  const logCompostWaste = (kg: number) => {
    setTelemetry((prev) => {
      const newWaste = prev.compostWasteDivertedKg + kg;
      const newCo2 = +(prev.co2OffsetTons + kg * 0.0018).toFixed(2);
      showNotification(`Logged ${kg}kg crop residue to circular composting reactor!`);
      return {
        ...prev,
        compostWasteDivertedKg: newWaste,
        co2OffsetTons: newCo2,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        activeRole,
        setActiveRole,
        products,
        addProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        updateProduct,
        cancelOrder,
        activeBatch,
        setActiveBatch,
        inspectBatch,
        batchesRegistry,
        registerBatch,
        membershipPlans,
        updateMembershipPrice,
        subscribeToPlan,
        commissionRate,
        setCommissionRate,
        telemetry,
        togglePump,
        simulateRain,
        logCompostWaste,
        notification,
        showNotification,
        isAiModalOpen,
        setIsAiModalOpen,
        isQrScannerOpen,
        setIsQrScannerOpen,
        isFoodScannerOpen,
        setIsFoodScannerOpen,
        activeFoodScanBatchId,
        openFoodScanner,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
