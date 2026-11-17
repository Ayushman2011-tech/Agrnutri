export type UserRole = 'Farmer' | 'Producer' | 'Retailer' | 'Consumer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  phone?: string;
  avatar?: string;
  farmName?: string;
  businessName?: string;
  membershipTier?: string;
  isVerified?: boolean;
}

export interface NutritionalInfo {
  calories: number; // per 100g
  protein: number; // g
  carbohydrates: number; // g
  fat: number; // g
  dietaryFiber: number; // g
  potassiumMg?: number;
  ironMg?: number;
  vitaminCPercent?: number;
  calciumMg?: number;
  antioxidantsOrac?: number; // ORAC units per 100g
  glycemicIndex?: number; // GI score (e.g. 35 low GI)
  highlights: string[];
}

export interface LaboratoryQualityReport {
  labName: string; // e.g. "Odisha State Bio-Safety & Food Testing Laboratory (OSFL-BBSR)"
  certificateNumber: string; // e.g. "NABL-OSFL-2026-88941"
  testDate: string;
  heavyMetalsPpm: number; // lead/mercury < 0.01 ppm
  microbialColiforms: string; // "Nil (Zero CFU/g)"
  pesticideResiduePpm: number; // 0.00 ppm
  safetyRating: '100% Zero-Residue Certified' | 'NPOP Organic Grade A+';
  fssaiLicense: string;
  assaySummary: string;
}

export interface StorageHistory {
  facilityType: 'Solar Cold Storage Packhouse' | 'Jute Aerated Silo' | 'Refrigerated Hermetic Vault';
  facilityLocation: string;
  storageTemperatureC: number;
  storageHumidityPercent: number;
  coldChainDurationHours: number;
  packhouseHandledDate: string;
  transitCarrier: string;
  packagingAssurance: string;
}

export interface BatchSustainabilityReport {
  ecoScore: number; // 0-100
  ecoGrade: 'A+' | 'A' | 'B+';
  waterFootprintLitersPerKg: number;
  dripSavingsPercent: number;
  energySavedKwh: number;
  transportEmissionKgCo2: number;
  agriculturalWasteDivertedKg: number;
  regenerativePractices: string[];
  carbonStatus: 'Carbon Negative' | 'Carbon Neutral' | 'Low Carbon Certified';
  auditHash: string;
}

export interface SustainabilityMetrics {
  waterSavedLiters: number;
  carbonOffsetKg: number;
  organicCertified: boolean;
  renewableEnergyPercent: number;
  packagingType: '100% Biodegradable' | 'Recyclable Jute' | 'Zero Plastic Glass' | 'Compostable Pulp';
  ecoScore?: number;
  ecoGrade?: 'A+' | 'A' | 'B+';
}

export interface TraceabilityTimelineEvent {
  step: string;
  stage: 'Farming' | 'Harvesting' | 'Processing' | 'Logistics' | 'Retail';
  title: string;
  location: string;
  date: string;
  actor: string;
  description: string;
  verificationHash: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

export interface BatchTraceability {
  batchId: string;
  productId: string;
  productName: string;
  farmerName: string;
  farmLocation: string;
  soilCondition: string;
  sowingDate: string;
  harvestDate: string;
  producerFacility?: string;
  processingDate?: string;
  qualityGrade: 'A+' | 'A' | 'Organic Premium';
  moistureContent: string;
  pesticideResidueTest: '0.00 ppm (Zero Chemical Residue)' | 'Compliant NPOP Standards';
  ingredients?: string[];
  allergens?: string[]; // Declared allergens or allergen-free certifications
  nutritionalInfo?: NutritionalInfo;
  laboratoryReport?: LaboratoryQualityReport;
  storageHistory?: StorageHistory;
  sustainability: SustainabilityMetrics;
  sustainabilityReport?: BatchSustainabilityReport;
  timeline: TraceabilityTimelineEvent[];
}

export interface LogisticsRouteSuggestion {
  id: string;
  corridorName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  etaMinutes: number;
  fuelSavedLiters: number;
  co2SavedKg: number;
  costSavedInr: number;
  trafficCondition: 'Clear Highway' | 'Moderate Rain' | 'Ghats Curved Pass' | 'Expressway Fast';
  congestionAlert?: string;
  waypoints: {
    name: string;
    time: string;
    status: 'Passed' | 'Next' | 'Pending';
    coordinates: string;
  }[];
}

export interface ColdChainTelemetrySnapshot {
  shipmentId: string;
  orderId: string;
  vanNumber: string;
  driverName: string;
  currentTempC: number;
  targetTempRange: string;
  minTempThresholdC: number;
  maxTempThresholdC: number;
  ambientTempC: number;
  humidityPercent: number;
  powerStatus: 'Active Solar-Reefer' | 'Auxiliary Battery Backup';
  excursionAlert: boolean;
  alertMessage?: string;
  readingsHistory: {
    time: string;
    tempC: number;
    humidityPercent: number;
  }[];
}

export interface CombinedOrderBundle {
  bundleId: string;
  clusterZone: string;
  orders: {
    orderId: string;
    customerName: string;
    address: string;
    itemsCount: number;
    weightKg: number;
  }[];
  totalWeightKg: number;
  stopsCount: number;
  efficiencyBoostPercent: number;
  costSavingsInr: number;
  carbonSavingsKg: number;
  assignedVehicle: string;
  status: 'Ready for Dispatch' | 'In Transit' | 'Completed';
}

export interface Product {
  id: string;
  title: string;
  category:
    | 'Fresh Vegetables'
    | 'Farm Fresh Fruits'
    | 'Indigenous Grains & Millets'
    | 'Organic Pulses'
    | 'Cold-Pressed Oils & Spices'
    | 'Specialty Coffee & Beverages'
    | 'Wild Forest Honey & Wellness'
    | 'Farm Seeds & Bio-Inputs';
  description: string;
  price: number; // retail price per unit in INR
  wholesalePrice: number; // price for bulk buyers
  minWholesaleQty: number; // e.g. 50 kg
  unit: string; // 'kg', '500g', 'Litre', 'pack'
  imageUrl: string;
  images?: string[];
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerRole: 'Farmer' | 'Producer' | 'Retailer';
  sellerLocation: string;
  rating: number;
  reviewsCount: number;
  isOrganic: boolean;
  batchId: string;
  ingredients?: string[];
  allergens?: string[];
  labReportSummary?: string;
  nutritionalInfo: NutritionalInfo;
  harvestDate: string;
  bestBefore: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isWholesale?: boolean;
}

export interface OrderTrackingStage {
  id: string;
  stageName: 'Order Confirmed' | 'Harvested & Packed' | 'Dispatched / Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  title: string;
  description?: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Harvested' | 'Dispatched' | 'Delivered' | 'Cancelled';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  deliveryDateEstimated: string;
  actualDeliveryDate?: string;
  deliveredDate?: string;
  invoiceNumber: string;
  // Shipping & Stage Tracking Details
  shippingPlace?: string; // Place of shipping (e.g. Sambalpur Solar Hub, Odisha)
  shippingDate?: string; // Shipping Date (e.g. 2026-10-09 08:30 AM)
  currentStage?: string; // Description of current stage
  currentLocation?: string; // Current location / transit hub
  carrierName?: string; // e.g. Odisha Green Agri-Logistics
  trackingNumber?: string; // e.g. OD-EXP-889124
  temperatureControlled?: boolean; // Cold chain active (e.g., 4°C for perishables)
  trackingStages?: OrderTrackingStage[];
}

export interface MembershipPlan {
  id: string;
  category: 'Farmer' | 'Producer' | 'Retailer' | 'Consumer';
  name: string; // Starter, Pro, Enterprise
  monthlyPrice: number; // in INR
  annualPrice: number; // in INR
  badgeText?: string;
  isPopular?: boolean;
  features: string[];
  limits: {
    listingsMax?: number | 'Unlimited';
    qrBatchesPerMonth?: number | 'Unlimited';
    aiConsultations?: number | 'Unlimited';
    analyticsDepth?: 'Basic' | 'Advanced' | 'Enterprise Multi-Facility';
  };
}

export interface TelemetrySensorData {
  soilMoisture: number; // %
  soilPh: number;
  soilNitrogen: string;
  rainfallLast24h: number; // mm
  rainwaterTankLevel: number; // %
  solarGenerationKw: number; // kW
  solarBatteryCharge: number; // %
  irrigationPumpStatus: 'Active' | 'Idle' | 'Scheduled';
  pumpRuntimeTodayHours: number;
  compostWasteDivertedKg: number;
  co2OffsetTons: number;
}

export interface Founder {
  name: string;
  hometown: string;
  state: string;
  role: string;
  title: string;
  bio: string;
  achievements: string[];
  expertise: string[];
  quote: string;
  image?: string;
}

export type TutorialCategory = 'drones' | 'weather' | 'sensors' | 'crop-reports' | 'all';

export interface TutorialChapter {
  id: string;
  title: string;
  startSeconds: number;
  durationSeconds: number;
  narration: {
    en: string;
    hi: string;
    or: string; // Odia
  };
  highlightConcept: string;
  telemetrySnapshot?: {
    altitudeMeters?: number;
    speedKmh?: number;
    sprayFlowRateLMin?: number;
    soilMoisturePercent?: number;
    npkLevel?: string;
    temperatureC?: number;
    humidityPercent?: number;
    windSpeedKmh?: number;
    ndviScore?: number;
    batteryPercent?: number;
  };
  interactivePrompt?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface FarmerTutorial {
  id: string;
  title: string;
  titleHi: string;
  titleOr: string;
  category: 'drones' | 'weather' | 'sensors' | 'crop-reports';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationSeconds: number;
  instructor: string;
  thumbnailUrl: string;
  description: string;
  simulationType: 'drone' | 'weather' | 'sensor' | 'crop-report';
  chapters: TutorialChapter[];
  practicalChecklist: string[];
  equipmentNeeded: string[];
  isAiGenerated?: boolean;
}
