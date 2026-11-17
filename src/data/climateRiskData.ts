export type ClimateRiskType = 'frost' | 'heavy_rain' | 'drought' | 'heatwave' | 'cyclonic_wind';
export type ClimateSeverity = 'Watch' | 'Advisory' | 'Severe Warning' | 'Critical Emergency';

export interface ClimateHazardAlert {
  id: string;
  type: ClimateRiskType;
  title: string;
  severity: ClimateSeverity;
  targetLocation: string;
  district: string;
  coordinates: string;
  nearestRadarStation: string;
  issuedAt: string;
  validUntil: string;
  probabilityPercent: number; // e.g. 88%
  peakExpectedTime: string;
  
  // Specific Metric Projections
  projectedMetrics: {
    primaryValue: string; // e.g. '4.2°C Ground Temp' or '82mm in 4h' or '16 Consecutive Dry Days'
    thresholdTriggered: string; // e.g. '< 6.0°C Frost Limit'
    soilImpactSummary: string;
    cropsAtRisk: string[];
  };

  // Immediate Mitigation Actions
  emergencyMitigationPlan: {
    step: string;
    action: string;
    urgency: 'Immediate (0-2h)' | 'Pre-Night (4-6h)' | 'Next 24h';
    completed: boolean;
  }[];

  kvkSmsAdvisory: string;
}

export interface FarmLocationWeatherProfile {
  locationKey: string;
  locationName: string;
  district: string;
  coordinates: string;
  elevationMeters: number;
  microClimateType: string;
  currentTempC: number;
  groundTempC: number;
  relativeHumidity: number;
  soilMoisturePercent: number;
  rainfallLast24hMm: number;
  windSpeedKmh: number;
  pressureHpa: number;
  activeAlerts: ClimateHazardAlert[];
}

export const REGISTERED_LOCATIONS_WEATHER: Record<string, FarmLocationWeatherProfile> = {
  'Sambalpur, Odisha': {
    locationKey: 'sambalpur',
    locationName: 'Panda Krishi Bio-Farm Cluster',
    district: 'Sambalpur, Western Odisha',
    coordinates: '21.467° N, 83.978° E',
    elevationMeters: 148,
    microClimateType: 'Mahanadi Alluvial Riverine Plain (Sub-tropical)',
    currentTempC: 26.4,
    groundTempC: 5.2, // Chilly night inversion
    relativeHumidity: 62,
    soilMoisturePercent: 38.4,
    rainfallLast24hMm: 0,
    windSpeedKmh: 9.2,
    pressureHpa: 1014,
    activeAlerts: [
      {
        id: 'ALT-FROST-01',
        type: 'frost',
        title: 'Frost & Cold Wave Nocturnal Inversion Warning',
        severity: 'Severe Warning',
        targetLocation: 'Panda Krishi Bio-Farm, Sambalpur',
        district: 'Sambalpur, Odisha',
        coordinates: '21.467° N, 83.978° E',
        nearestRadarStation: 'IMD Doppler Weather Radar Sambalpur Block',
        issuedAt: 'Today, 06:00 AM IST',
        validUntil: 'Tomorrow, 08:30 AM IST',
        probabilityPercent: 86,
        peakExpectedTime: '03:30 AM - 06:00 AM IST',
        projectedMetrics: {
          primaryValue: '4.2°C Ground Surface Temp (Frost point)',
          thresholdTriggered: 'Ground temperature drops below 5.5°C threshold',
          soilImpactSummary: 'Rapid radiant heat loss from bare topsoil; risk of cellular freeze injury on tender blossom buds.',
          cropsAtRisk: ['Sambalpur Vine Tomatoes (Early flowering)', 'Desi Striped Brinjals', 'Young Papaya saplings'],
        },
        emergencyMitigationPlan: [
          {
            step: '1',
            action: 'Deploy organic biomass/paddy straw mulching around root crowns to trap residual daytime soil heat.',
            urgency: 'Pre-Night (4-6h)',
            completed: false,
          },
          {
            step: '2',
            action: 'Trigger 15-minute nocturnal solar micro-sprinkler mist at 3:00 AM (water crystallization releases latent heat).',
            urgency: 'Immediate (0-2h)',
            completed: false,
          },
          {
            step: '3',
            action: 'Light biological smoke blankets (slow-smoldering damp cow-dung briquettes) on the north-west windward boundary.',
            urgency: 'Pre-Night (4-6h)',
            completed: false,
          },
        ],
        kvkSmsAdvisory:
          'KVK SAMBALPUR URGENT: Severe nocturnal cold wave forecast tonight (4.2°C). Irrigate tomato plots lightly to raise soil thermal capacity. Mulch with straw to prevent blossom drop.',
      },
      {
        id: 'ALT-RAIN-02',
        type: 'heavy_rain',
        title: 'Impending Pre-Winter Torrential Downpour Alert',
        severity: 'Advisory',
        targetLocation: 'Sambalpur Mahanadi Basin',
        district: 'Sambalpur, Odisha',
        coordinates: '21.467° N, 83.978° E',
        nearestRadarStation: 'IMD Doppler Weather Radar Sambalpur Block',
        issuedAt: 'Yesterday, 04:00 PM IST',
        validUntil: 'In 36 Hours',
        probabilityPercent: 74,
        peakExpectedTime: 'Mid-afternoon convective shower window',
        projectedMetrics: {
          primaryValue: '58mm Cumulative Precipitation in 6h',
          thresholdTriggered: 'Rainfall intensity > 12mm/hour expected',
          soilImpactSummary: 'Potential topsoil silt wash and bed ponding if drainage swales remain blocked.',
          cropsAtRisk: ['Low-lying vegetable beds', 'Newly sowed coriander beds', 'Seedling nurseries'],
        },
        emergencyMitigationPlan: [
          {
            step: '1',
            action: 'Inspect and clear inter-plot drainage furrows to direct excess water to the solar retention pond.',
            urgency: 'Immediate (0-2h)',
            completed: false,
          },
          {
            step: '2',
            action: 'Pause automated solar drip pumping; soil saturation forecast to hit 75%.',
            urgency: 'Immediate (0-2h)',
            completed: true,
          },
          {
            step: '3',
            action: 'Apply Trichoderma viride bio-fungicide to ward off waterborne collar rot pathogens.',
            urgency: 'Next 24h',
            completed: false,
          },
        ],
        kvkSmsAdvisory:
          'KVK SAMBALPUR: Convective rainfall (50-60mm) likely within 36 hours. Open drainage channels and secure nursery shade nets.',
      },
      {
        id: 'ALT-DROUGHT-03',
        type: 'drought',
        title: 'Seasonal Prolonged Dry Spell & Evapotranspiration Alert',
        severity: 'Watch',
        targetLocation: 'Sambalpur Uplands Plot D',
        district: 'Sambalpur, Odisha',
        coordinates: '21.470° N, 83.977° E',
        nearestRadarStation: 'IMD Doppler Weather Radar Sambalpur Block',
        issuedAt: '2 Days ago',
        validUntil: 'Active 10-day outlook',
        probabilityPercent: 79,
        peakExpectedTime: 'Daytime 11:30 AM - 03:00 PM (Peak ET₀)',
        projectedMetrics: {
          primaryValue: '18 Consecutive Dry Days with 5.8mm/day ET₀',
          thresholdTriggered: 'Soil moisture projection dipping below 24% field capacity',
          soilImpactSummary: 'Capillary water deficit at 15cm root-zone; soil surface crusted.',
          cropsAtRisk: ['Sambalpuri Baigana', 'Mustard relay crop', 'Fodder grass'],
        },
        emergencyMitigationPlan: [
          {
            step: '1',
            action: 'Schedule 60-minute deep-soak solar drip irrigation before 8:00 AM to minimize evaporation.',
            urgency: 'Immediate (0-2h)',
            completed: true,
          },
          {
            step: '2',
            action: 'Spray 2% kaolin clay bio-reflector or diluted cow-urine wash to reduce leaf stomatal water loss.',
            urgency: 'Next 24h',
            completed: false,
          },
          {
            step: '3',
            action: 'Lay sugarcane bagasse or forest leaf mulch to protect soil microbiology from heat exhaustion.',
            urgency: 'Next 24h',
            completed: false,
          },
        ],
        kvkSmsAdvisory:
          'KVK ADVISORY: 18 dry days expected. Transition to pulse drip irrigation. Avoid chemical nitrogen applications during moisture stress.',
      },
    ],
  },
  'Koraput, Odisha': {
    locationKey: 'koraput',
    locationName: 'Koraput Highland Heritage Reserve',
    district: 'Koraput (Eastern Ghats)',
    coordinates: '18.813° N, 82.712° E',
    elevationMeters: 920,
    microClimateType: 'High-Altitude Mountain Valley (Cool Sub-Humid)',
    currentTempC: 19.8,
    groundTempC: 3.8, // Severe ground frost potential
    relativeHumidity: 78,
    soilMoisturePercent: 44.5,
    rainfallLast24hMm: 4.2,
    windSpeedKmh: 14.5,
    pressureHpa: 915,
    activeAlerts: [
      {
        id: 'ALT-KOR-FROST-01',
        type: 'frost',
        title: 'Severe High-Altitude Ground Frost Warning',
        severity: 'Critical Emergency',
        targetLocation: 'Koraput Terraced Bio-Cluster',
        district: 'Koraput, Odisha',
        coordinates: '18.813° N, 82.712° E',
        nearestRadarStation: 'IMD Doppler Weather Radar Visakhapatnam & Koraput Station',
        issuedAt: 'Today, 05:30 AM IST',
        validUntil: 'Tomorrow, 09:00 AM IST',
        probabilityPercent: 94,
        peakExpectedTime: '02:00 AM - 06:30 AM IST',
        projectedMetrics: {
          primaryValue: '2.9°C Nocturnal Ground Frost Inversion',
          thresholdTriggered: 'Ground temperature drops below 3.5°C threshold',
          soilImpactSummary: 'Freezing condensation on hill terrace slopes; cellular damage to Arabica coffee cherries and late rice panicles.',
          cropsAtRisk: ['High-Altitude Arabica Coffee Cherries', 'Kala Jeera Rice (late tillers)', 'Ginger nurseries'],
        },
        emergencyMitigationPlan: [
          {
            step: '1',
            action: 'Deploy temporary thatch bamboo screens over exposed hillside coffee blocks.',
            urgency: 'Immediate (0-2h)',
            completed: false,
          },
          {
            step: '2',
            action: 'Flood terrace contours with 2-3 inches of spring runoff water to maintain temperature buffer above freezing.',
            urgency: 'Pre-Night (4-6h)',
            completed: false,
          },
        ],
        kvkSmsAdvisory:
          'KVK KORAPUT CRITICAL: Sub-zero ground chill alert tonight (2.9°C). Cover high-value coffee seedlings and maintain ponded water in rice terraces.',
      },
    ],
  },
  'Kandhamal, Odisha': {
    locationKey: 'kandhamal',
    locationName: 'Kandhamal Tribal Agro-Forestry Valley',
    district: 'Kandhamal (Kalinga Ghati)',
    coordinates: '20.142° N, 84.152° E',
    elevationMeters: 680,
    microClimateType: 'Forest-Canopy Hill Slopes (Humid Tropical Forest)',
    currentTempC: 22.1,
    groundTempC: 6.8,
    relativeHumidity: 72,
    soilMoisturePercent: 39.0,
    rainfallLast24hMm: 0,
    windSpeedKmh: 8.0,
    pressureHpa: 940,
    activeAlerts: [
      {
        id: 'ALT-KAN-DROUGHT-01',
        type: 'drought',
        title: 'Canopy Soil Moisture Depletion Advisory',
        severity: 'Advisory',
        targetLocation: 'Kandhamal Hill Terraces',
        district: 'Kandhamal, Odisha',
        coordinates: '20.142° N, 84.152° E',
        nearestRadarStation: 'IMD Doppler Weather Radar Gopalpur / Phulbani',
        issuedAt: 'Yesterday, 10:00 AM IST',
        validUntil: 'Active for 7 Days',
        probabilityPercent: 82,
        peakExpectedTime: 'Afternoon humidity dips below 45%',
        projectedMetrics: {
          primaryValue: '14 Days Zero Rainfall with Laterite Crusting',
          thresholdTriggered: 'Root-zone moisture falling below 30%',
          soilImpactSummary: 'Turmeric rhizome swelling slowed down; requires supplementary gravity irrigation.',
          cropsAtRisk: ['Kandhamal GI Organic Turmeric', 'Organic Hill Ginger', 'Black Pepper vines'],
        },
        emergencyMitigationPlan: [
          {
            step: '1',
            action: 'Refresh thick forest leaf mulch (Sal & Mahua leaves) to 15cm thickness across turmeric ridges.',
            urgency: 'Immediate (0-2h)',
            completed: true,
          },
          {
            step: '2',
            action: 'Open gravity spring flow channels for nocturnal furrow soaking.',
            urgency: 'Pre-Night (4-6h)',
            completed: false,
          },
        ],
        kvkSmsAdvisory:
          'KVK KANDHAMAL: Forest soil moisture stress alert. Apply thick green leaf mulching to conserve moisture in turmeric beds.',
      },
    ],
  },
};
