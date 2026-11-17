export type CropFeedingCategory =
  | 'Heavy Feeder'
  | 'Nitrogen Fixer (Legume)'
  | 'Soil Restorative & Cereal'
  | 'Bio-Fumigant & Pest Break'
  | 'Deep Root Aerator';

export interface RotationCropOption {
  id: string;
  name: string;
  odishaName: string;
  category: CropFeedingCategory;
  seasonFit: 'Kharif' | 'Rabi' | 'Zaid / Summer' | 'Annual';
  durationDays: number;
  nitrogenImpactKgHa: number; // positive = added to soil, negative = consumed
  organicBiomassTonsHa: number;
  waterDemand: 'Very Low' | 'Low' | 'Moderate' | 'High';
  pestBreakScore: number; // 0 - 100
  marketValueInrPerAcre: number;
  primaryBenefit: string;
  companionOrNextTip: string;
}

export interface RotationSequenceStep {
  seasonLabel: string;
  timing: string;
  crop: RotationCropOption;
  roleInSequence: string;
  projectedYieldQPerAcre: number;
  yieldBoostVsMonoculturePercent: number;
  soilImpactSummary: string;
}

export interface CropRotationPlan {
  planId: string;
  title: string;
  targetPlot: string;
  district: string;
  anchorCropId: string; // Links to CROP_FORECAST_DATA
  anchorCropName: string;
  focusGoal: 'Nitrogen Restoration' | 'Pest & Blight Break' | 'Max Organic Carbon' | 'Water-Saving Drought Resilience';
  durationYears: number;
  steps: RotationSequenceStep[];
  
  // Aggregate 3-Season / 4-Season Outcomes
  projectedSoilHealthIndex: {
    starting: number;
    afterCycle: number;
    netGain: number;
  };
  netNitrogenBalanceKgHa: number;
  organicCarbonGainPercent: number;
  pestCycleInterruptionPercent: number;
  waterSavedVsMonocultureLiters: number;
  cumulativeProjectedRevenueInr: number;
  forecastYieldBoostOnAnchorCrop: number; // e.g. +19.4% on next tomato harvest
  kvkAdvisoryNote: string;
}

export const ROTATION_CROP_CATALOG: RotationCropOption[] = [
  {
    id: 'rot-tomato',
    name: 'Sambalpur Organic Vine Tomatoes',
    odishaName: 'Bilati Baigana',
    category: 'Heavy Feeder',
    seasonFit: 'Rabi',
    durationDays: 85,
    nitrogenImpactKgHa: -75,
    organicBiomassTonsHa: 3.2,
    waterDemand: 'Moderate',
    pestBreakScore: 30,
    marketValueInrPerAcre: 293000,
    primaryBenefit: 'High-value commercial cash crop with verified 0.00 ppm zero-residue demand.',
    companionOrNextTip: 'Follow immediately with deep-rooting cowpea or marigold to halt nematode buildup.',
  },
  {
    id: 'rot-dhaincha',
    name: 'Sesbania Green Manure (Dhaincha)',
    odishaName: 'Dhaincha Jaiba Sara',
    category: 'Nitrogen Fixer (Legume)',
    seasonFit: 'Kharif',
    durationDays: 45,
    nitrogenImpactKgHa: 125,
    organicBiomassTonsHa: 9.5,
    waterDemand: 'Low',
    pestBreakScore: 88,
    marketValueInrPerAcre: 0, // Green manure incorporated into soil
    primaryBenefit: 'Fixes up to 125 kg/ha atmospheric nitrogen; incorporates 9.5 tons succulent green biomass.',
    companionOrNextTip: 'Plow down into soil at 45-50 days during 50% flowering for maximum nitrogen release.',
  },
  {
    id: 'rot-cowpea',
    name: 'Desi Cowpea / Black-Eyed Pea',
    odishaName: 'Lobia / Jhudunga',
    category: 'Nitrogen Fixer (Legume)',
    seasonFit: 'Zaid / Summer',
    durationDays: 70,
    nitrogenImpactKgHa: 80,
    organicBiomassTonsHa: 5.0,
    waterDemand: 'Low',
    pestBreakScore: 82,
    marketValueInrPerAcre: 68000,
    primaryBenefit: 'Dual purpose: tender green pods for high market value + root nodules fix 80 kg N/ha.',
    companionOrNextTip: 'Thrives in warm summer soils; excellent living ground cover that smothers weeds.',
  },
  {
    id: 'rot-marigold',
    name: 'African Marigold Bio-Fumigant',
    odishaName: 'Gendu Phula',
    category: 'Bio-Fumigant & Pest Break',
    seasonFit: 'Zaid / Summer',
    durationDays: 65,
    nitrogenImpactKgHa: -15,
    organicBiomassTonsHa: 4.2,
    waterDemand: 'Low',
    pestBreakScore: 96,
    marketValueInrPerAcre: 85000,
    primaryBenefit: 'Roots exude alpha-terthienyl, completely eradicating Meloidogyne root-knot nematodes.',
    companionOrNextTip: 'Sell cut flowers for festive demand, then mulch remaining stems into topsoil.',
  },
  {
    id: 'rot-ragi',
    name: 'Finger Millet (Mandia)',
    odishaName: 'Mandia (Millets Mission)',
    category: 'Soil Restorative & Cereal',
    seasonFit: 'Kharif',
    durationDays: 105,
    nitrogenImpactKgHa: -35,
    organicBiomassTonsHa: 4.8,
    waterDemand: 'Very Low',
    pestBreakScore: 85,
    marketValueInrPerAcre: 72000,
    primaryBenefit: 'Fibrous root network decompacts subsoil; extracts bound phosphorus via root exudates.',
    companionOrNextTip: 'Government Odisha Millets Mission guaranteed minimum support procurement.',
  },
  {
    id: 'rot-greengram',
    name: 'Odisha Desi Green Gram (Mung Bean)',
    odishaName: 'Muga Dali',
    category: 'Nitrogen Fixer (Legume)',
    seasonFit: 'Rabi',
    durationDays: 65,
    nitrogenImpactKgHa: 65,
    organicBiomassTonsHa: 3.8,
    waterDemand: 'Low',
    pestBreakScore: 80,
    marketValueInrPerAcre: 62000,
    primaryBenefit: 'Quick 65-day turnaround; enriches rhizosphere with native Rhizobium bacteria.',
    companionOrNextTip: 'Relay directly into residual moisture following rice or vegetables.',
  },
  {
    id: 'rot-mustard',
    name: 'Yellow Bio-Fumigant Mustard',
    odishaName: 'Desi Rai / Sorisa',
    category: 'Bio-Fumigant & Pest Break',
    seasonFit: 'Rabi',
    durationDays: 75,
    nitrogenImpactKgHa: -30,
    organicBiomassTonsHa: 3.5,
    waterDemand: 'Low',
    pestBreakScore: 92,
    marketValueInrPerAcre: 54000,
    primaryBenefit: 'Glucosinolates release natural bio-fumigant isothiocyanates against fungal wilt spores.',
    companionOrNextTip: 'Excellent pollinator attractor; honeybees boost nearby fruit pollination by 22%.',
  },
  {
    id: 'rot-rice',
    name: 'Koraput Aromatic Kala Jeera Rice',
    odishaName: 'Kala Jeera Heirloom',
    category: 'Soil Restorative & Cereal',
    seasonFit: 'Kharif',
    durationDays: 140,
    nitrogenImpactKgHa: -60,
    organicBiomassTonsHa: 6.2,
    waterDemand: 'High',
    pestBreakScore: 65,
    marketValueInrPerAcre: 196200,
    primaryBenefit: 'Premium GI aromatic harvest; straw recycling boosts soil silica and potassium.',
    companionOrNextTip: 'Intercrop Azolla bio-fertilizer in standing water to offset 40 kg N demand.',
  },
  {
    id: 'rot-turmeric',
    name: 'Kandhamal GI Organic Turmeric',
    odishaName: 'Kandhamal Haladi',
    category: 'Heavy Feeder',
    seasonFit: 'Annual',
    durationDays: 240,
    nitrogenImpactKgHa: -85,
    organicBiomassTonsHa: 5.5,
    waterDemand: 'Moderate',
    pestBreakScore: 78,
    marketValueInrPerAcre: 286000,
    primaryBenefit: 'High curcuminoid cash crop; volatile rhizome oils naturally sanitize subsoil bacteria.',
    companionOrNextTip: 'Requires dense leaf mulch; follow with pigeon pea or cowpea for organic rejuvenation.',
  },
  {
    id: 'rot-brinjal',
    name: 'Sambalpur Desi Striped Brinjal',
    odishaName: 'Sambalpuri Baigana',
    category: 'Heavy Feeder',
    seasonFit: 'Rabi',
    durationDays: 110,
    nitrogenImpactKgHa: -70,
    organicBiomassTonsHa: 3.6,
    waterDemand: 'Moderate',
    pestBreakScore: 35,
    marketValueInrPerAcre: 225000,
    primaryBenefit: 'Continuous multi-flush harvest across winter months with high weekly cash flow.',
    companionOrNextTip: 'Never plant immediately before or after tomato (same Solanaceae pest spectrum).',
  },
];

export const PRESET_ROTATION_PLANS: CropRotationPlan[] = [
  {
    planId: 'plan-tomato-regenerative',
    title: 'Sambalpur Solanaceae Regenerative & Nitrogen Rebuilder',
    targetPlot: 'Panda Krishi Bio-Farm (Plot A & C)',
    district: 'Sambalpur (Mahanadi River Basin)',
    anchorCropId: 'crop-tomato',
    anchorCropName: 'Sambalpur Farm-Fresh Vine Tomatoes',
    focusGoal: 'Nitrogen Restoration',
    durationYears: 1.5,
    projectedSoilHealthIndex: {
      starting: 84,
      afterCycle: 96,
      netGain: 12,
    },
    netNitrogenBalanceKgHa: 130, // +130 net kg N added
    organicCarbonGainPercent: 0.38, // +0.38% OC increase
    pestCycleInterruptionPercent: 94,
    waterSavedVsMonocultureLiters: 185000,
    cumulativeProjectedRevenueInr: 446000,
    forecastYieldBoostOnAnchorCrop: 18.6,
    kvkAdvisoryNote:
      'Continuous tomato cropping depletes potassium and invites root-knot nematodes. Rotating with Sesbania green manuring in early Kharif followed by summer marigold completely breaks pathogen lifecycles while injecting +125 kg/ha organic nitrogen.',
    steps: [
      {
        seasonLabel: 'Season 1: Pre-Kharif / Early Monsoon',
        timing: 'June 15 - August 05 (45 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-dhaincha')!,
        roleInSequence: 'Bio-Mass & Atmospheric Nitrogen Restorer',
        projectedYieldQPerAcre: 0,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Fixes +125 kg/ha Nitrogen; inverts 9.5 t/ha fresh green humus into soil.',
      },
      {
        seasonLabel: 'Season 2: Peak Rabi Winter Harvest',
        timing: 'Nov 12 - Feb 20 (85 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-tomato')!,
        roleInSequence: 'Primary Cash Harvest (Capitalizes on green manure N-reserve)',
        projectedYieldQPerAcre: 146.5,
        yieldBoostVsMonoculturePercent: 18.6,
        soilImpactSummary: 'Yields 146.5 Q/Acre (vs 125 baseline) due to unlocked mycorrhizal phosphorus.',
      },
      {
        seasonLabel: 'Season 3: Summer Fallow Transition',
        timing: 'March 01 - May 10 (65 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-marigold')!,
        roleInSequence: 'Nematode Eradication & Summer Bio-Fumigant',
        projectedYieldQPerAcre: 42.0,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Alpha-terthienyl exudates eliminate 94% of Meloidogyne nematodes; flower sales yield ₹85k.',
      },
      {
        seasonLabel: 'Season 4: Autumn Kharif Resilience',
        timing: 'July 01 - October 15 (105 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-ragi')!,
        roleInSequence: 'Subsoil Aeration & Soil Mineral Decompaction',
        projectedYieldQPerAcre: 18.5,
        yieldBoostVsMonoculturePercent: 14.2,
        soilImpactSummary: 'Fibrous root network pulls deep subsoil trace minerals without irrigation strain.',
      },
    ],
  },
  {
    planId: 'plan-brinjal-pest-break',
    title: 'Hirakud Command Bio-Field Pest-Break & Oilseed Rotation',
    targetPlot: 'Panda Krishi Bio-Farm (Plot B)',
    district: 'Sambalpur (Hirakud Command Area)',
    anchorCropId: 'crop-brinjal',
    anchorCropName: 'Sambalpur Desi Striped Brinjals',
    focusGoal: 'Pest & Blight Break',
    durationYears: 1.5,
    projectedSoilHealthIndex: {
      starting: 81,
      afterCycle: 93,
      netGain: 12,
    },
    netNitrogenBalanceKgHa: 85,
    organicCarbonGainPercent: 0.32,
    pestCycleInterruptionPercent: 91,
    waterSavedVsMonocultureLiters: 142000,
    cumulativeProjectedRevenueInr: 395000,
    forecastYieldBoostOnAnchorCrop: 21.4,
    kvkAdvisoryNote:
      'Solanaceous shoot and fruit borers thrive in continuous brinjal cultivation. Rotating with yellow mustard bio-fumigation followed by dual-purpose cowpea purges soil-borne Ralstonia bacterial wilt.',
    steps: [
      {
        seasonLabel: 'Season 1: Pre-Kharif Green Manure',
        timing: 'June 20 - August 10 (50 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-cowpea')!,
        roleInSequence: 'Legume Nodulation & Soil Moisture Armor',
        projectedYieldQPerAcre: 22.0,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Adds 80 kg N/ha; covers topsoil preventing monsoonal silt runoff.',
      },
      {
        seasonLabel: 'Season 2: Main Winter Vegetable Harvest',
        timing: 'Nov 01 - March 15 (110 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-brinjal')!,
        roleInSequence: 'Anchor Cash Crop (Multi-flush pickings)',
        projectedYieldQPerAcre: 112.5,
        yieldBoostVsMonoculturePercent: 21.4,
        soilImpactSummary: 'Consistently glossy pest-free fruits; yields +21.4% above mono-cropped plots.',
      },
      {
        seasonLabel: 'Season 3: Post-Harvest Bio-Fumigation',
        timing: 'October 10 - Dec 25 (75 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-mustard')!,
        roleInSequence: 'Soil Sanitizer & High-Oil Micro-Cash Crop',
        projectedYieldQPerAcre: 7.8,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Natural isothiocyanates sterilize soil fungus; brings ₹54,000 cold-pressed oil revenue.',
      },
    ],
  },
  {
    planId: 'plan-rice-wetland-legume',
    title: 'Koraput Highland Rice-Pulse Relay & Soil Rejuvenation',
    targetPlot: 'Terraced Wetland Plot 2',
    district: 'Koraput (Eastern Ghats Bio-Reserve)',
    anchorCropId: 'crop-rice',
    anchorCropName: 'Koraput Aromatic Kala Jeera Rice',
    focusGoal: 'Max Organic Carbon',
    durationYears: 1.0,
    projectedSoilHealthIndex: {
      starting: 88,
      afterCycle: 98,
      netGain: 10,
    },
    netNitrogenBalanceKgHa: 95,
    organicCarbonGainPercent: 0.45,
    pestCycleInterruptionPercent: 88,
    waterSavedVsMonocultureLiters: 260000,
    cumulativeProjectedRevenueInr: 326200,
    forecastYieldBoostOnAnchorCrop: 16.8,
    kvkAdvisoryNote:
      'Utilizes the time-tested Odisha Pyra / Utera relay cropping technique: broadcast desi green gram / lentil seeds directly into standing Kala Jeera rice 12 days prior to harvest. Roots utilize lingering residual wetland moisture without needing secondary plowing or irrigation.',
    steps: [
      {
        seasonLabel: 'Season 1: Main Kharif Monsoon Heirloom',
        timing: 'June 10 - Nov 05 (140 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-rice')!,
        roleInSequence: 'GI Certified Heritage Grain Harvest',
        projectedYieldQPerAcre: 21.8,
        yieldBoostVsMonoculturePercent: 16.8,
        soilImpactSummary: 'Deep root percolation; Azolla floating bio-mass keeps subsoil moisture active.',
      },
      {
        seasonLabel: 'Season 2: Zero-Till Winter Relay (Pyra)',
        timing: 'Nov 01 - Jan 15 (65 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-greengram')!,
        roleInSequence: 'Residual Moisture Nitrogen Fixer',
        projectedYieldQPerAcre: 6.5,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Direct root nodulation injects +65 kg N/ha into rice stubble layer.',
      },
      {
        seasonLabel: 'Season 3: Pre-Monsoon Green Manure',
        timing: 'April 05 - May 25 (50 Days)',
        crop: ROTATION_CROP_CATALOG.find((c) => c.id === 'rot-dhaincha')!,
        roleInSequence: 'Pre-Monsoon Soil Conditioning',
        projectedYieldQPerAcre: 0,
        yieldBoostVsMonoculturePercent: 0,
        soilImpactSummary: 'Rapid summer biomass adds 8 t/ha organic humus ready for the next rice seedling transplant.',
      },
    ],
  },
];
