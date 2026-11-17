export interface IrrigationSessionLog {
  id: string;
  zoneId: string;
  zoneName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  waterUsedLiters: number;
  method: 'Solar Drip Emitter' | 'Micro-Sprinkler' | 'Gravity Furrow' | 'Sub-Surface Drip';
  waterSource: 'Solar Deep Borewell' | 'Rainwater Retention Pond' | 'Natural Mountain Spring' | 'Hirakud Canal Lift';
  operator: string;
  soilMoistureBeforePercent: number;
  soilMoistureAfterPercent: number;
  notes: string;
}

export interface ZoneWaterBudget {
  zoneId: string;
  zoneName: string;
  localPlotName: string;
  cropName: string;
  totalAcres: number;
  irrigationMethod: string;
  flowRateLitersPerMin: number;
  
  // Daily Thresholds (in Liters)
  dailySustainableLimitLiters: number;
  todayConsumedLiters: number;
  weeklySustainableLimitLiters: number;
  thisWeekConsumedLiters: number;
  
  // Benchmarks
  litersPerKgHarvestProjected: number;
  floodIrrigationBaselineLiters: number; // What traditional flood would use
  groundwaterSavedPercent: number; // e.g. 42%
  
  // Status
  status: 'Normal' | 'Approaching Threshold' | 'Threshold Exceeded';
  alertMessage?: string;
  recommendedAction?: string;
  autoShutoffEnabled: boolean;
}

export const INITIAL_ZONE_WATER_BUDGETS: Record<string, ZoneWaterBudget> = {
  'zone-a': {
    zoneId: 'zone-a',
    zoneName: 'Zone A: Sambalpur River Bio-Cluster',
    localPlotName: 'Plot A (Panda Krishi Bio-Farm)',
    cropName: 'Organic Desi Vine Tomatoes',
    totalAcres: 3.8,
    irrigationMethod: 'Solar Drip Micro-Emitter Grid (1.6 L/h emitters)',
    flowRateLitersPerMin: 42.5,
    dailySustainableLimitLiters: 4500,
    todayConsumedLiters: 3820, // 84.8% (Normal/Approaching)
    weeklySustainableLimitLiters: 31500,
    thisWeekConsumedLiters: 24600,
    litersPerKgHarvestProjected: 26.2,
    floodIrrigationBaselineLiters: 7800,
    groundwaterSavedPercent: 51.0,
    status: 'Normal',
    recommendedAction: 'Current soil moisture optimal at 38.4%. Continue morning 45-min pulse cycle.',
    autoShutoffEnabled: true,
  },
  'zone-b': {
    zoneId: 'zone-b',
    zoneName: 'Zone B: Hirakud Command Bio-Field',
    localPlotName: 'Plot B (Panda Krishi Bio-Farm)',
    cropName: 'Sambalpuri Striped Desi Brinjals',
    totalAcres: 2.6,
    irrigationMethod: 'Solar Micro-Sprinkler & Drip Laterals',
    flowRateLitersPerMin: 34.0,
    dailySustainableLimitLiters: 3200,
    todayConsumedLiters: 3640, // 113.8% (EXCEEDED ALERT!)
    weeklySustainableLimitLiters: 22400,
    thisWeekConsumedLiters: 24100,
    litersPerKgHarvestProjected: 32.4,
    floodIrrigationBaselineLiters: 5800,
    groundwaterSavedPercent: 37.2,
    status: 'Threshold Exceeded',
    alertMessage:
      'CRITICAL WATER USAGE ALERT: Daily consumption (3,640 L) has exceeded the 3,200 L sustainable ceiling by 440 Liters (113.8%). Prolonged pumping risks topsoil nutrient leaching and groundwater depletion.',
    recommendedAction:
      'Immediate Action Required: Pause active pump line. Inspect lateral lines in Sector B03 for pipe fissure or dislodged emitter. Engage auto-shutoff safety lock.',
    autoShutoffEnabled: true,
  },
  'zone-c': {
    zoneId: 'zone-c',
    zoneName: 'Zone C: Koraput Highland Terraces',
    localPlotName: 'Terraced Wetland Plot 2',
    cropName: 'Aromatic Kala Jeera Rice',
    totalAcres: 5.2,
    irrigationMethod: 'Natural Mountain Spring Runoff + Solar Lift',
    flowRateLitersPerMin: 85.0,
    dailySustainableLimitLiters: 11500,
    todayConsumedLiters: 9800, // 85.2% (Approaching Threshold)
    weeklySustainableLimitLiters: 80500,
    thisWeekConsumedLiters: 68400,
    litersPerKgHarvestProjected: 450.0,
    floodIrrigationBaselineLiters: 21000,
    groundwaterSavedPercent: 48.5,
    status: 'Approaching Threshold',
    alertMessage:
      'THRESHOLD ADVISORY: Approaching 85% of daily water budget (9,800 L / 11,500 L). Standing ponding depth in terrace contours is currently 4.5cm (Optimal).',
    recommendedAction:
      'Switch from continuous ponding to Alternate Wetting and Drying (AWD). Let ponded water subside for 48 hours before next spring diversion.',
    autoShutoffEnabled: true,
  },
  'zone-d': {
    zoneId: 'zone-d',
    zoneName: 'Zone D: Kandhamal Agro-Forestry Terraces',
    localPlotName: 'Ridge Plot 4 (Kalinga Ghati)',
    cropName: 'Kandhamal GI Certified Organic Turmeric',
    totalAcres: 4.5,
    irrigationMethod: 'Gravity Spring Flow & Rainwater Trenching',
    flowRateLitersPerMin: 28.0,
    dailySustainableLimitLiters: 3800,
    todayConsumedLiters: 2150, // 56.6% (Normal / Very Efficient)
    weeklySustainableLimitLiters: 26600,
    thisWeekConsumedLiters: 14800,
    litersPerKgHarvestProjected: 30.1,
    floodIrrigationBaselineLiters: 6500,
    groundwaterSavedPercent: 66.9,
    status: 'Normal',
    recommendedAction:
      'Thick Sal leaf mulching is conserving 62% of soil moisture. Zero irrigation required for next 24 hours.',
    autoShutoffEnabled: true,
  },
};

export const INITIAL_IRRIGATION_LOGS: IrrigationSessionLog[] = [
  {
    id: 'IRR-LOG-101',
    zoneId: 'zone-b',
    zoneName: 'Zone B: Hirakud Command (Brinjals)',
    date: '2026-11-11',
    startTime: '06:30 AM',
    durationMinutes: 95,
    waterUsedLiters: 3230,
    method: 'Solar Drip Emitter',
    waterSource: 'Solar Deep Borewell',
    operator: 'Ayushman Panda (Lead Cultivator)',
    soilMoistureBeforePercent: 28.4,
    soilMoistureAfterPercent: 41.5,
    notes: 'Exceeded planned 60-min timer due to manual override; triggered over-threshold notification.',
  },
  {
    id: 'IRR-LOG-102',
    zoneId: 'zone-a',
    zoneName: 'Zone A: Sambalpur River (Tomatoes)',
    date: '2026-11-11',
    startTime: '07:15 AM',
    durationMinutes: 65,
    waterUsedLiters: 2760,
    method: 'Solar Drip Emitter',
    waterSource: 'Solar Deep Borewell',
    operator: 'Gourav Soren (Field Specialist)',
    soilMoistureBeforePercent: 31.0,
    soilMoistureAfterPercent: 39.8,
    notes: 'Morning fertigation cycle with fermented Jeevamrutha biostimulant.',
  },
  {
    id: 'IRR-LOG-103',
    zoneId: 'zone-c',
    zoneName: 'Zone C: Koraput Terraces (Rice)',
    date: '2026-11-10',
    startTime: '05:00 AM',
    durationMinutes: 110,
    waterUsedLiters: 9350,
    method: 'Gravity Furrow',
    waterSource: 'Natural Mountain Spring',
    operator: 'Tribal Co-op Field Team',
    soilMoistureBeforePercent: 38.0,
    soilMoistureAfterPercent: 48.0,
    notes: 'Natural spring water diversion along upper terraced contour swales.',
  },
  {
    id: 'IRR-LOG-104',
    zoneId: 'zone-d',
    zoneName: 'Zone D: Kandhamal Terraces (Turmeric)',
    date: '2026-11-10',
    startTime: '04:30 PM',
    durationMinutes: 45,
    waterUsedLiters: 1260,
    method: 'Sub-Surface Drip',
    waterSource: 'Rainwater Retention Pond',
    operator: 'Kandhamal Spices Bio-Cluster',
    soilMoistureBeforePercent: 33.5,
    soilMoistureAfterPercent: 39.2,
    notes: 'Low-evaporation evening pulse to protect mother rhizomes.',
  },
  {
    id: 'IRR-LOG-105',
    zoneId: 'zone-a',
    zoneName: 'Zone A: Sambalpur River (Tomatoes)',
    date: '2026-11-09',
    startTime: '07:00 AM',
    durationMinutes: 40,
    waterUsedLiters: 1700,
    method: 'Solar Drip Emitter',
    waterSource: 'Solar Deep Borewell',
    operator: 'Ayushman Panda',
    soilMoistureBeforePercent: 32.2,
    soilMoistureAfterPercent: 38.4,
    notes: 'Maintenance drip pass. Soil moisture maintained within safe threshold.',
  },
];
