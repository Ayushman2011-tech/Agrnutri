export interface HistoricalSoilRecord {
  year: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  soilType: string;
  pH: number;
  organicCarbonPercent: number;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  moistureRetentionPercent: number;
  microbialActivityScore: number; // 0 - 100
}

export interface HistoricalWeatherRecord {
  year: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  rainfallMm: number;
  rainfallDeviationPercent: number; // vs 30-year IMD average
  averageTempC: number;
  maxTempC: number;
  heatStressDays: number;
  cloudCoverPercent: number;
  sunshineHoursDaily: number;
}

export interface CropForecastModel {
  cropId: string;
  cropName: string;
  odishaName: string;
  category: string;
  district: string;
  farmPlot: string;
  soilTypeDescription: string;
  optimalSoilPh: string;
  waterNeedCategory: 'Low' | 'Moderate' | 'High';
  growingPeriodDays: number;
  
  // Historical Yield Records (Quintals per Acre)
  historicalYields: {
    year: number;
    season: string;
    yieldQuintalPerAcre: number;
    rainfallMm: number;
    soilHealthIndex: number; // 0-100
  }[];

  // Upcoming Season Predictions
  upcomingSeason: {
    seasonName: string;
    targetSowingWindow: string;
    expectedHarvestMonth: string;
    baselineYieldQuintalPerAcre: number;
    predictedYieldQuintalPerAcre: number;
    yieldVariancePercent: number; // e.g. +14.2%
    predictedRangeQuintal: { min: number; max: number };
    confidenceScorePercent: number; // e.g. 94.2%
    projectedRevenuePerAcreInr: number;
    potentialRevenueGainInr: number;
    
    // Model Factors
    soilSuitabilityIndex: number; // 0-100
    weatherFavorabilityIndex: number; // 0-100
    climateResilienceIndex: number; // 0-100
    
    // Soil & Weather specific drivers
    soilFactors: {
      factor: string;
      status: 'Optimal' | 'Slight Deficit' | 'Surplus' | 'Attention Needed';
      impactOnYield: string;
      value: string;
    }[];
    
    weatherFactors: {
      factor: string;
      outlook: 'Favorable' | 'Normal' | 'Volatile' | 'Advisory Alert';
      impactOnYield: string;
      value: string;
    }[];
    
    predictiveInsights: {
      type: 'positive' | 'warning' | 'action';
      title: string;
      description: string;
    }[];
    
    recommendedInterventions: {
      stage: string;
      action: string;
      expectedBoost: string;
    }[];
  };
}

export const CROP_FORECAST_DATA: CropForecastModel[] = [
  {
    cropId: 'crop-tomato',
    cropName: 'Sambalpur Farm-Fresh Vine Tomatoes',
    odishaName: 'Desi Bilati Baigana',
    category: 'Fresh Vegetables',
    district: 'Sambalpur (Mahanadi River Basin)',
    farmPlot: 'Panda Krishi Plot A & C (Alluvial Silt)',
    soilTypeDescription: 'Black Alluvial Loam with high organic vermicast content (pH 6.8)',
    optimalSoilPh: '6.2 - 6.8',
    waterNeedCategory: 'Moderate',
    growingPeriodDays: 85,
    historicalYields: [
      { year: 2024, season: 'Rabi 2023-24', yieldQuintalPerAcre: 112, rainfallMm: 48, soilHealthIndex: 82 },
      { year: 2025, season: 'Rabi 2024-25', yieldQuintalPerAcre: 124, rainfallMm: 62, soilHealthIndex: 88 },
      { year: 2026, season: 'Rabi 2025-26', yieldQuintalPerAcre: 138, rainfallMm: 54, soilHealthIndex: 94 },
    ],
    upcomingSeason: {
      seasonName: 'Upcoming Rabi Season (Nov 2026 - Feb 2027)',
      targetSowingWindow: 'Nov 12 - Nov 25, 2026',
      expectedHarvestMonth: 'Late January - Mid February 2027',
      baselineYieldQuintalPerAcre: 125,
      predictedYieldQuintalPerAcre: 146.5,
      yieldVariancePercent: 17.2,
      predictedRangeQuintal: { min: 140, max: 154 },
      confidenceScorePercent: 94.8,
      projectedRevenuePerAcreInr: 293000,
      potentialRevenueGainInr: 43000,
      soilSuitabilityIndex: 95,
      weatherFavorabilityIndex: 91,
      climateResilienceIndex: 93,
      soilFactors: [
        {
          factor: 'Organic Carbon (% OC)',
          status: 'Optimal',
          impactOnYield: '+6.5% fruit cluster density',
          value: '0.88% (High)',
        },
        {
          factor: 'Root-Zone Moisture Retention',
          status: 'Optimal',
          impactOnYield: '+4.2% blossom-end rot protection',
          value: '38.4% (Field Capacity)',
        },
        {
          factor: 'Available Nitrogen (N)',
          status: 'Optimal',
          impactOnYield: 'Strong vegetative canopy',
          value: '320 kg/ha (Adequate)',
        },
        {
          factor: 'Soil Electrical Conductivity (EC)',
          status: 'Optimal',
          impactOnYield: 'Zero salt stress on roots',
          value: '0.42 dS/m (Safe)',
        },
      ],
      weatherFactors: [
        {
          factor: 'Winter Daytime Temperature',
          outlook: 'Favorable',
          impactOnYield: '26°C - 28°C ideal for continuous pollination',
          value: 'Avg 27.2°C (IMD Outlook)',
        },
        {
          factor: 'Nighttime Min Temperature',
          outlook: 'Favorable',
          impactOnYield: '14°C - 16°C promotes deep lycopene pigmentation',
          value: 'Avg 15.1°C (Clear skies)',
        },
        {
          factor: 'Relative Humidity',
          outlook: 'Normal',
          impactOnYield: '58% - 65% minimizes late blight fungal spores',
          value: '62% (Moderate)',
        },
        {
          factor: 'Winter Shower Anomaly',
          outlook: 'Advisory Alert',
          impactOnYield: '-12% below average; supplemental drip vital',
          value: '18mm predicted (Low)',
        },
      ],
      predictiveInsights: [
        {
          type: 'positive',
          title: 'Superior Soil Biological Soil Index (+17.2% Expected Gain)',
          description:
            'Three consecutive cycles of green manuring with Sesbania (Dhaincha) and cow dung vermicompost have increased microbial biomass by 34%, ensuring optimal root phosphorus uptake.',
        },
        {
          type: 'warning',
          title: 'Late December Dry Spell Alert',
          description:
            'IMD Doppler and atmospheric moisture models forecast 12% lower December rainfall in Sambalpur block. Maintain solar drip irrigation at 45-minute cycles every 48 hours.',
        },
        {
          type: 'action',
          title: 'Staking & Trellising Timing',
          description:
            'High vegetative vigor predicted by day 28. Install bamboo trellises and jute twine before the flowering peak to prevent soil-contact rot during heavy morning dews.',
        },
      ],
      recommendedInterventions: [
        {
          stage: 'Transplanting (Day 0-7)',
          action: 'Dip root plugs in Jeevamrutha bio-inoculant + Trichoderma viride',
          expectedBoost: '+3.5% seedling survival & collar rot immunity',
        },
        {
          stage: 'First Flowering (Day 25-30)',
          action: 'Foliar spray with fermented buttermilk + panchagavya (3% dilution)',
          expectedBoost: '+5.8% fruit set retention',
        },
        {
          stage: 'Fruit Bulking (Day 50-60)',
          action: 'Apply wood-ash potassium enrichment in drip ring',
          expectedBoost: '+4.2% fruit firmness & brix sweetness',
        },
      ],
    },
  },
  {
    cropId: 'crop-rice',
    cropName: 'Koraput Aromatic Kala Jeera Rice',
    odishaName: 'Prince of Rice (Kala Jeera)',
    category: 'Indigenous Grains & Millets',
    district: 'Koraput (Eastern Ghats Bio-Reserve)',
    farmPlot: 'Terraced Valley Wetland Plot B',
    soilTypeDescription: 'Lateritic alluvial silt with high organic humus and natural mountain runoff (pH 6.2)',
    optimalSoilPh: '5.8 - 6.5',
    waterNeedCategory: 'High',
    growingPeriodDays: 140,
    historicalYields: [
      { year: 2024, season: 'Kharif 2024', yieldQuintalPerAcre: 15.8, rainfallMm: 1120, soilHealthIndex: 86 },
      { year: 2025, season: 'Kharif 2025', yieldQuintalPerAcre: 17.2, rainfallMm: 1280, soilHealthIndex: 91 },
      { year: 2026, season: 'Kharif 2026', yieldQuintalPerAcre: 19.4, rainfallMm: 1210, soilHealthIndex: 96 },
    ],
    upcomingSeason: {
      seasonName: 'Upcoming Pre-Kharif / Kharif 2027 Season',
      targetSowingWindow: 'June 05 - June 20, 2027',
      expectedHarvestMonth: 'Late October - Early November 2027',
      baselineYieldQuintalPerAcre: 16.5,
      predictedYieldQuintalPerAcre: 21.8,
      yieldVariancePercent: 32.1,
      predictedRangeQuintal: { min: 20.5, max: 23.0 },
      confidenceScorePercent: 93.4,
      projectedRevenuePerAcreInr: 196200,
      potentialRevenueGainInr: 47700,
      soilSuitabilityIndex: 97,
      weatherFavorabilityIndex: 89,
      climateResilienceIndex: 95,
      soilFactors: [
        {
          factor: 'Organic Humus Layer',
          status: 'Optimal',
          impactOnYield: 'High iron and trace mineral absorption',
          value: '1.4% (Exceptional)',
        },
        {
          factor: 'Subsoil Moisture Retention',
          status: 'Optimal',
          impactOnYield: 'Resilience through inter-monsoon breaks',
          value: '42.6% (Hydric wetland)',
        },
        {
          factor: 'Soil Acidity / pH',
          status: 'Optimal',
          impactOnYield: 'Perfect for iron & zinc mobilization',
          value: '6.2 (Native heirloom optimum)',
        },
        {
          factor: 'Beneficial Mycorrhizal Fungi',
          status: 'Optimal',
          impactOnYield: '+8% phosphorus solubilization',
          value: '94 CFU/g (Very High)',
        },
      ],
      weatherFactors: [
        {
          factor: 'Monsoon Onset Window',
          outlook: 'Favorable',
          impactOnYield: 'Timely June 10-14 arrival in Koraput hill tracts',
          value: 'Normal onset projected',
        },
        {
          factor: 'Cumulative Monsoon Precipitation',
          outlook: 'Favorable',
          impactOnYield: '1,240 mm provides sustained bund ponding',
          value: '102% of Long Period Avg',
        },
        {
          factor: 'Hill Valley Diurnal Temp Delta',
          outlook: 'Favorable',
          impactOnYield: '12°C day/night spread locks in black pigment & aroma',
          value: 'Day 29°C / Night 17°C',
        },
        {
          factor: 'Late Season Humidity',
          outlook: 'Normal',
          impactOnYield: 'Clean panicle emergence with low false smut risk',
          value: '74% (Safe threshold)',
        },
      ],
      predictiveInsights: [
        {
          type: 'positive',
          title: 'Phenomenal Aroma & Grain Filling Potential (+32.1% Forecast)',
          description:
            'Historical hill agro-climatic logs confirm cool October nights combined with laterite organic humus maximize 2-acetyl-1-pyrroline (aroma compound) and test-weight per 1,000 grains.',
        },
        {
          type: 'action',
          title: 'System of Rice Intensification (SRI) Spacing',
          description:
            'Use 25x25 cm grid spacing with 10-12 day young single seedlings rather than clump planting to stimulate 28+ effective tillers per hill.',
        },
        {
          type: 'warning',
          title: 'Watch for Leaf Folder in Mid-Tillering',
          description:
            'High relative humidity in August may trigger leaf folders. Release Trichogramma egg parasitoids at 50,000/ha instead of any chemical spray.',
        },
      ],
      recommendedInterventions: [
        {
          stage: 'Nursery (Day 1-12)',
          action: 'Raised nursery bed enriched with vermicompost and Azospirillum bio-fertilizer',
          expectedBoost: '+15% root length & root density',
        },
        {
          stage: 'Tillering Stage (Day 35)',
          action: 'Cono-weeder pass to aerate root rhizosphere and incorporate Azolla bio-mulch',
          expectedBoost: '+4.5 tillers per plant',
        },
        {
          stage: 'Booting to Panicle (Day 90)',
          action: 'Spray 5% wild neem kernel extract + cow urine to prevent panicle blast',
          expectedBoost: 'Zero grain discoloration guarantee',
        },
      ],
    },
  },
  {
    cropId: 'crop-turmeric',
    cropName: 'Kandhamal GI Organic Golden Turmeric',
    odishaName: 'Kandhamal Haladi (GI Certified)',
    category: 'Spices & Herbs',
    district: 'Kandhamal (Tribal Agro-Forestry Zone)',
    farmPlot: 'Hill Slope Terraces Plot 4 (Kalinga Ghati)',
    soilTypeDescription: 'Red Sandy Laterite on sloping terrain, free-draining with virgin leaf mold (pH 6.1)',
    optimalSoilPh: '5.5 - 6.5',
    waterNeedCategory: 'Moderate',
    growingPeriodDays: 240,
    historicalYields: [
      { year: 2024, season: 'Annual 2023-24', yieldQuintalPerAcre: 52, rainfallMm: 1340, soilHealthIndex: 88 },
      { year: 2025, season: 'Annual 2024-25', yieldQuintalPerAcre: 58, rainfallMm: 1410, soilHealthIndex: 92 },
      { year: 2026, season: 'Annual 2025-26', yieldQuintalPerAcre: 64, rainfallMm: 1380, soilHealthIndex: 96 },
    ],
    upcomingSeason: {
      seasonName: 'Upcoming Planting Cycle (April 2027 - Jan 2028)',
      targetSowingWindow: 'April 20 - May 15, 2027',
      expectedHarvestMonth: 'January 2028',
      baselineYieldQuintalPerAcre: 55,
      predictedYieldQuintalPerAcre: 71.5,
      yieldVariancePercent: 30.0,
      predictedRangeQuintal: { min: 68, max: 75 },
      confidenceScorePercent: 95.2,
      projectedRevenuePerAcreInr: 286000,
      potentialRevenueGainInr: 66000,
      soilSuitabilityIndex: 98,
      weatherFavorabilityIndex: 94,
      climateResilienceIndex: 97,
      soilFactors: [
        {
          factor: 'Virgin Deciduous Leaf Mold',
          status: 'Optimal',
          impactOnYield: 'High natural mycorrhizae stimulate fat mother rhizomes',
          value: '1.2% Organic Carbon',
        },
        {
          factor: 'Slope Drainage & Aeration',
          status: 'Optimal',
          impactOnYield: 'Zero water-logging, eliminates rhizome rot (Pythium)',
          value: '8.4% slope gradient',
        },
        {
          factor: 'Potassium Availability',
          status: 'Optimal',
          impactOnYield: 'Essential for high curcumin synthesis (>5.2%)',
          value: '290 kg/ha K2O (High)',
        },
        {
          factor: 'Soil Bulk Density',
          status: 'Optimal',
          impactOnYield: 'Loose friable tilth allows lateral finger rhizome expansion',
          value: '1.18 g/cm³ (Excellent)',
        },
      ],
      weatherFactors: [
        {
          factor: 'Pre-Monsoon Showers (Kalbaisakhi)',
          outlook: 'Favorable',
          impactOnYield: '45mm expected in May to trigger prompt sprouting',
          value: 'Favorable early rains',
        },
        {
          factor: 'Canopy Filtered Solar Radiation',
          outlook: 'Favorable',
          impactOnYield: 'Inter-cropped silver oak canopy provides 30% shade buffer',
          value: '6.2 Peak Sun Hours/day',
        },
        {
          factor: 'Monsoon Distribution',
          outlook: 'Favorable',
          impactOnYield: 'Well-spaced 1,350mm provides uninterrupted vegetative growth',
          value: 'Normal Indian Ocean Dipole',
        },
        {
          factor: 'Dry Winter Maturation',
          outlook: 'Favorable',
          impactOnYield: 'Crisp dry December air concentrates essential volatile oils',
          value: 'Relative Humidity 48%',
        },
      ],
      predictiveInsights: [
        {
          type: 'positive',
          title: 'Curcumin Concentration Potential: >5.4% Projected',
          description:
            'Predictive soil-weather correlation models reveal that high potassium laterite soils combined with natural hill micro-climate will yield exceptionally potent medicinal curcumin, qualifying for 25% export premium.',
        },
        {
          type: 'action',
          title: 'Heavy Forest Leaf Mulching Mandate',
          description:
            'Apply 10-12 tons/acre of broad-leaf forest litter (Sal/Mahua leaves) immediately upon planting. This suppresses weeds, conserves soil moisture, and lowers root-zone soil temperature during hot May afternoons.',
        },
        {
          type: 'positive',
          title: 'Zero Chemical Residue Heritage',
          description:
            'Continuous tribal traditional cultivation ensures 0.00 ppm chemical residues with pristine NPOP/EU organic certification conformity.',
        },
      ],
      recommendedInterventions: [
        {
          stage: 'Seed Rhizome Selection',
          action: 'Select bold, disease-free mother rhizomes (45-50g each) treated with cow urine slurry',
          expectedBoost: '+8.2% initial sprout vigor',
        },
        {
          stage: 'First Earthing Up (Day 60)',
          action: 'Incorporate 2 tons of decomposed farmyard manure and re-mulch with green leaves',
          expectedBoost: '+12% finger rhizome multiplication',
        },
        {
          stage: 'Second Earthing Up (Day 110)',
          action: 'Apply wood ash and bone meal bio-source for potassium & phosphorus replenishment',
          expectedBoost: '+9.5% bulk density and rhizome firmness',
        },
      ],
    },
  },
  {
    cropId: 'crop-coffee',
    cropName: 'Koraput Deomali Shade-Grown Arabica Coffee',
    odishaName: 'Koraput Arabica Coffee Cherries',
    category: 'Estate Beverages',
    district: 'Koraput (Deomali Hills, 3,100 ft MSL)',
    farmPlot: 'High-Elevation Forest Canopy Estate (Sub-Plot 2)',
    soilTypeDescription: 'Humus-rich lateritic mountain loam beneath multi-tiered native shade canopy (pH 6.4)',
    optimalSoilPh: '6.0 - 6.5',
    waterNeedCategory: 'Moderate',
    growingPeriodDays: 270,
    historicalYields: [
      { year: 2024, season: 'Harvest 2023-24', yieldQuintalPerAcre: 8.2, rainfallMm: 1450, soilHealthIndex: 90 },
      { year: 2025, season: 'Harvest 2024-25', yieldQuintalPerAcre: 9.6, rainfallMm: 1520, soilHealthIndex: 94 },
      { year: 2026, season: 'Harvest 2025-26', yieldQuintalPerAcre: 11.2, rainfallMm: 1480, soilHealthIndex: 97 },
    ],
    upcomingSeason: {
      seasonName: 'Upcoming Winter Harvest Cycle (Nov 2026 - Jan 2027)',
      targetSowingWindow: 'Perennial Orchard (Flowering March 2026)',
      expectedHarvestMonth: 'December 2026 - January 2027',
      baselineYieldQuintalPerAcre: 9.5,
      predictedYieldQuintalPerAcre: 12.8,
      yieldVariancePercent: 34.7,
      predictedRangeQuintal: { min: 12.1, max: 13.5 },
      confidenceScorePercent: 96.1,
      projectedRevenuePerAcreInr: 320000,
      potentialRevenueGainInr: 82500,
      soilSuitabilityIndex: 97,
      weatherFavorabilityIndex: 96,
      climateResilienceIndex: 98,
      soilFactors: [
        {
          factor: 'Forest Litter Humus',
          status: 'Optimal',
          impactOnYield: 'Deep organic cushion regulates perennial root moisture',
          value: '1.6% Organic Carbon',
        },
        {
          factor: 'Micronutrient Boron & Zinc',
          status: 'Optimal',
          impactOnYield: 'Even berry cluster set and uniform cherry size',
          value: 'Balanced organic levels',
        },
        {
          factor: 'Soil Temperature Stability',
          status: 'Optimal',
          impactOnYield: 'Shade trees keep root zone within 19°C - 23°C',
          value: 'Avg 21.2°C at 20cm depth',
        },
        {
          factor: 'Soil Drainage',
          status: 'Optimal',
          impactOnYield: 'Sloping gravelly loam prevents collar rot',
          value: 'High hydraulic conductivity',
        },
      ],
      weatherFactors: [
        {
          factor: 'Blossom Showers (March)',
          outlook: 'Favorable',
          impactOnYield: '38mm received in early March ensured 96% flower set',
          value: 'Optimal blossom bloom',
        },
        {
          factor: 'Monsoon Backing Showers',
          outlook: 'Favorable',
          impactOnYield: 'Steady rainfall swelled berry pulp without split skins',
          value: '1,420mm cumulative',
        },
        {
          factor: 'Winter Night Chilling (11°C)',
          outlook: 'Favorable',
          impactOnYield: 'Slow cherry ripening concentrates natural sugars (Brix 22°+)',
          value: 'Night 11.5°C in Dec',
        },
        {
          factor: 'Deomali Mountain Mist',
          outlook: 'Favorable',
          impactOnYield: 'Morning dew maintains natural skin elasticity and aroma',
          value: 'Daily 7:00-9:30 AM fog cover',
        },
      ],
      predictiveInsights: [
        {
          type: 'positive',
          title: 'Specialty Grade Cupping Score Predicted: 86.5+ (Micro-lot Premium)',
          description:
            'The predictive climate matrix confirms ideal slow cherry maturation. The higher density of high-elevation beans will yield nuanced notes of wild orange blossom, cocoa nibs, and mountain honey.',
        },
        {
          type: 'action',
          title: 'Selective Selective Hand-Picking Guidance',
          description:
            'Model predicts staggered ripening over 3 picking passes. Harvest only dark crimson oxblood cherries to guarantee 0% under-ripe astringency.',
        },
        {
          type: 'positive',
          title: 'Eco-System Biodiversity Credit',
          description:
            'Coffee plants act as active carbon sinks alongside 18 indigenous forest tree varieties, yielding Carbon Negative agricultural status.',
        },
      ],
      recommendedInterventions: [
        {
          stage: 'Berry Maturation (Oct)',
          action: 'Shade tree regulation (thin 15% upper canopy to admit gentle morning sunlight)',
          expectedBoost: '+6.2% sugar brix concentration',
        },
        {
          stage: 'Pre-Harvest (Nov)',
          action: 'Erect raised African drying beds with UV breathable netting ready for washed processing',
          expectedBoost: 'Consistent 11.0% moisture content target',
        },
        {
          stage: 'Post-Harvest (Jan)',
          action: 'Compost 100% of wet pulp back into orchard soil beds with earthworms',
          expectedBoost: 'Recycles 18 kg potassium per acre for next cycle',
        },
      ],
    },
  },
  {
    cropId: 'crop-brinjal',
    cropName: 'Sambalpur Desi Striped Brinjal (Baigana)',
    odishaName: 'Sambalpuri Gole Baigana',
    category: 'Fresh Vegetables',
    district: 'Sambalpur (Hirakud Command Area)',
    farmPlot: 'Bio-Farm Plot D (Sub-irrigated Loam)',
    soilTypeDescription: 'Fine Sandy Clay Loam enriched with mustard oil cake and biodynamic compost (pH 6.9)',
    optimalSoilPh: '6.5 - 7.2',
    waterNeedCategory: 'Moderate',
    growingPeriodDays: 110,
    historicalYields: [
      { year: 2024, season: 'Kharif-Rabi 2024', yieldQuintalPerAcre: 88, rainfallMm: 85, soilHealthIndex: 84 },
      { year: 2025, season: 'Kharif-Rabi 2025', yieldQuintalPerAcre: 96, rainfallMm: 92, soilHealthIndex: 89 },
      { year: 2026, season: 'Kharif-Rabi 2026', yieldQuintalPerAcre: 104, rainfallMm: 88, soilHealthIndex: 93 },
    ],
    upcomingSeason: {
      seasonName: 'Upcoming Winter & Spring Harvest (Dec 2026 - Mar 2027)',
      targetSowingWindow: 'Nov 01 - Nov 18, 2026',
      expectedHarvestMonth: 'Late December 2026 - March 2027 (Multiple pickings)',
      baselineYieldQuintalPerAcre: 92,
      predictedYieldQuintalPerAcre: 112.5,
      yieldVariancePercent: 22.3,
      predictedRangeQuintal: { min: 108, max: 118 },
      confidenceScorePercent: 92.8,
      projectedRevenuePerAcreInr: 225000,
      potentialRevenueGainInr: 41000,
      soilSuitabilityIndex: 94,
      weatherFavorabilityIndex: 90,
      climateResilienceIndex: 91,
      soilFactors: [
        {
          factor: 'Mustard Cake Residual Nitrogen',
          status: 'Optimal',
          impactOnYield: 'Sustained nitrogen release prevents early leaf yellowing',
          value: '310 kg/ha Available N',
        },
        {
          factor: 'Soil Aeration & Permeability',
          status: 'Optimal',
          impactOnYield: 'Fibrous root expansion deep into the subsoil',
          value: 'Good pore space (48%)',
        },
        {
          factor: 'Soil pH',
          status: 'Optimal',
          impactOnYield: 'Prevents bacterial wilt pathogen (Ralstonia) establishment',
          value: '6.9 (Slightly neutral)',
        },
        {
          factor: 'Trace Zinc & Copper',
          status: 'Optimal',
          impactOnYield: 'Thick glossy purple skin and pest resistance',
          value: '1.4 ppm available Zn',
        },
      ],
      weatherFactors: [
        {
          factor: 'Mean Winter Temperature',
          outlook: 'Favorable',
          impactOnYield: '24°C - 27°C encourages prolonged flowering flush',
          value: 'Avg 25.4°C daytime',
        },
        {
          factor: 'Dew & Fog Exposure',
          outlook: 'Normal',
          impactOnYield: 'Morning dew provides foliar hydration',
          value: 'Moderate morning dew',
        },
        {
          factor: 'Wind Speeds',
          outlook: 'Favorable',
          impactOnYield: 'Gentle breezes (<12 km/h) ensure zero stem lodging',
          value: '8.5 km/h avg',
        },
        {
          factor: 'Late Winter Warmup (Feb)',
          outlook: 'Normal',
          impactOnYield: 'Accelerates secondary branch fruiting',
          value: 'Smooth transition projected',
        },
      ],
      predictiveInsights: [
        {
          type: 'positive',
          title: 'Extended Harvest Window (8-10 Flush Pickings)',
          description:
            'Predictive soil thermal modeling indicates mild winter conditions will extend the fruiting cycle by 3 weeks compared to 2024, enabling farmers to capitalize on peak February local market vegetable rates.',
        },
        {
          type: 'warning',
          title: 'Shoot and Fruit Borer Pheromone Monitoring',
          description:
            'Monitor closely when daytime temperatures exceed 28°C in late January. Install Lucin-lure pheromone traps at 12 traps/acre rather than spraying chemicals.',
        },
        {
          type: 'action',
          title: 'Organic Cow Dung Slurry Top Dressing',
          description:
            'Apply 100 liters of 10-day fermented Jeevamrutha through the solar drip line every 14 days to sustain continuous vigorous fruiting.',
        },
      ],
      recommendedInterventions: [
        {
          stage: 'Vegetative Growth (Day 25)',
          action: 'Nip terminal shoot at 30cm to stimulate 5-6 sturdy lateral branches',
          expectedBoost: '+14% fruit-bearing nodes',
        },
        {
          stage: 'First Harvest Flush (Day 55)',
          action: 'Harvest early in the morning when calyx is tender and green',
          expectedBoost: 'Prevents fruit over-maturity and seed hardening',
        },
        {
          stage: 'Mid-Season Rejuvenation (Day 80)',
          action: 'Foliar spray with vermiwash (10% solution) + light ring weeding',
          expectedBoost: '+8.5 quintals in second picking flush',
        },
      ],
    },
  },
];
