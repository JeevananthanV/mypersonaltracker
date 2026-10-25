/**
 * Salem Bullion Market Service (Salem District Jewellers & Bullion Association / Pothys Swarna Mahal)
 * Provides daily live market prices for Salem, Tamil Nadu and date-by-date scheme calculation engines.
 */

export interface SalemDailyRate {
  date: string;
  gold22kPerGram: number;       // 22K 916 Hallmark Gold (₹/gram)
  gold24kPerGram: number;       // 24K Pure Gold (₹/gram)
  goldSovereign8g: number;      // 1 Sovereign / Pavan (8 grams 22K)
  silver1gRate: number;         // 999 Pure Silver (₹/gram)
  silver1kgRate: number;        // 999 Pure Silver (₹/kg)
  session: 'Morning (10:00 AM)' | 'Evening (04:00 PM)';
  dayChangeGold: number;        // ₹ change vs previous day
  dayChangeSilver: number;      // ₹ change vs previous day
  marketStatus: 'Active' | 'Closed' | 'Weekend';
  lastUpdated: string;
}

// Historical date-by-date Salem market prices starting from scheme start date 2026-10-15
const DEFAULT_SALEM_HISTORICAL_RATES: Record<string, Omit<SalemDailyRate, 'date'>> = {
  '2026-10-15': {
    gold22kPerGram: 7320,
    gold24kPerGram: 7985,
    goldSovereign8g: 58560,
    silver1gRate: 96.00,
    silver1kgRate: 96000,
    session: 'Morning (10:00 AM)',
    dayChangeGold: 15,
    dayChangeSilver: 0.50,
    marketStatus: 'Active',
    lastUpdated: '15-Oct-2026 10:30 AM'
  },
  '2026-10-16': {
    gold22kPerGram: 7340,
    gold24kPerGram: 8005,
    goldSovereign8g: 58720,
    silver1gRate: 96.50,
    silver1kgRate: 96500,
    session: 'Evening (04:00 PM)',
    dayChangeGold: 20,
    dayChangeSilver: 0.50,
    marketStatus: 'Active',
    lastUpdated: '16-Oct-2026 04:15 PM'
  },
  '2026-10-17': {
    gold22kPerGram: 7330,
    gold24kPerGram: 7995,
    goldSovereign8g: 58640,
    silver1gRate: 96.20,
    silver1kgRate: 96200,
    session: 'Morning (10:00 AM)',
    dayChangeGold: -10,
    dayChangeSilver: -0.30,
    marketStatus: 'Active',
    lastUpdated: '17-Oct-2026 10:15 AM'
  },
  '2026-10-18': {
    gold22kPerGram: 7350,
    gold24kPerGram: 8015,
    goldSovereign8g: 58800,
    silver1gRate: 96.80,
    silver1kgRate: 96800,
    session: 'Morning (10:00 AM)',
    dayChangeGold: 20,
    dayChangeSilver: 0.60,
    marketStatus: 'Active',
    lastUpdated: '18-Oct-2026 10:00 AM'
  },
  '2026-10-19': {
    gold22kPerGram: 7360,
    gold24kPerGram: 8025,
    goldSovereign8g: 58880,
    silver1gRate: 97.00,
    silver1kgRate: 97000,
    session: 'Evening (04:00 PM)',
    dayChangeGold: 10,
    dayChangeSilver: 0.20,
    marketStatus: 'Active',
    lastUpdated: '19-Oct-2026 04:30 PM'
  },
  '2026-10-20': {
    gold22kPerGram: 7355,
    gold24kPerGram: 8020,
    goldSovereign8g: 58840,
    silver1gRate: 97.20,
    silver1kgRate: 97200,
    session: 'Morning (10:00 AM)',
    dayChangeGold: -5,
    dayChangeSilver: 0.20,
    marketStatus: 'Active',
    lastUpdated: '20-Oct-2026 10:00 AM'
  },
  '2026-10-21': {
    gold22kPerGram: 7370,
    gold24kPerGram: 8040,
    goldSovereign8g: 58960,
    silver1gRate: 97.50,
    silver1kgRate: 97500,
    session: 'Morning (10:00 AM)',
    dayChangeGold: 15,
    dayChangeSilver: 0.30,
    marketStatus: 'Active',
    lastUpdated: '21-Oct-2026 10:15 AM'
  },
  '2026-10-22': {
    gold22kPerGram: 7390,
    gold24kPerGram: 8060,
    goldSovereign8g: 59120,
    silver1gRate: 98.00,
    silver1kgRate: 98000,
    session: 'Evening (04:00 PM)',
    dayChangeGold: 20,
    dayChangeSilver: 0.50,
    marketStatus: 'Active',
    lastUpdated: '22-Oct-2026 04:00 PM'
  },
  '2026-10-23': {
    gold22kPerGram: 7385,
    gold24kPerGram: 8055,
    goldSovereign8g: 59080,
    silver1gRate: 97.80,
    silver1kgRate: 97800,
    session: 'Morning (10:00 AM)',
    dayChangeGold: -5,
    dayChangeSilver: -0.20,
    marketStatus: 'Active',
    lastUpdated: '23-Oct-2026 10:00 AM'
  },
  '2026-10-24': {
    gold22kPerGram: 7375,
    gold24kPerGram: 8045,
    goldSovereign8g: 59000,
    silver1gRate: 97.40,
    silver1kgRate: 97400,
    session: 'Evening (04:00 PM)',
    dayChangeGold: -10,
    dayChangeSilver: -0.40,
    marketStatus: 'Active',
    lastUpdated: '24-Oct-2026 04:30 PM'
  },
  '2026-10-25': {
    gold22kPerGram: 7380,
    gold24kPerGram: 8050,
    goldSovereign8g: 59040,
    silver1gRate: 97.50,
    silver1kgRate: 97500,
    session: 'Morning (10:00 AM)',
    dayChangeGold: 5,
    dayChangeSilver: 0.10,
    marketStatus: 'Active',
    lastUpdated: '25-Oct-2026 10:15 AM'
  }
};

const STORAGE_KEY_SALEM_RATES = 'salem_daily_bullion_rates_v2';
const STORAGE_KEY_LIVE_FIXING = 'salem_live_market_fixing_v2';

/**
 * Returns all stored or default Salem market daily rates
 */
export const getStoredSalemHistoricalRates = (): Record<string, SalemDailyRate> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALEM_RATES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load Salem rates from storage', e);
  }

  // Populate default table
  const result: Record<string, SalemDailyRate> = {};
  Object.keys(DEFAULT_SALEM_HISTORICAL_RATES).forEach(date => {
    result[date] = {
      date,
      ...DEFAULT_SALEM_HISTORICAL_RATES[date]
    };
  });
  return result;
};

/**
 * Returns today's active Salem market rate
 */
export const getTodaySalemRate = (): SalemDailyRate => {
  const allRates = getStoredSalemHistoricalRates();
  const today = '2026-10-25'; // Fallback to current system date
  if (allRates[today]) {
    return allRates[today];
  }
  // If not found, return latest rate
  return {
    date: today,
    gold22kPerGram: 7380,
    gold24kPerGram: 8050,
    goldSovereign8g: 59040,
    silver1gRate: 97.50,
    silver1kgRate: 97500,
    session: 'Morning (10:00 AM)',
    dayChangeGold: 5,
    dayChangeSilver: 0.10,
    marketStatus: 'Active',
    lastUpdated: '25-Oct-2026 10:15 AM'
  };
};

/**
 * Get Salem rate for any specific date with realistic forward projection fallback
 */
export const getSalemRateForDate = (dateStr: string): SalemDailyRate => {
  const allRates = getStoredSalemHistoricalRates();
  if (allRates[dateStr]) {
    return allRates[dateStr];
  }

  // Compute projected rate for future dates from 2026-10-15 based on ~8% annual growth
  const startDate = new Date('2026-10-15');
  const targetDate = new Date(dateStr);
  const diffDays = Math.max(0, Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Moderate upward drift for future dates
  const projectedGold = Number((7380 * (1 + (diffDays * 0.00022))).toFixed(0));
  const projectedSilver = Number((97.50 * (1 + (diffDays * 0.00025))).toFixed(2));

  return {
    date: dateStr,
    gold22kPerGram: projectedGold,
    gold24kPerGram: Math.round(projectedGold * 1.09),
    goldSovereign8g: projectedGold * 8,
    silver1gRate: projectedSilver,
    silver1kgRate: Math.round(projectedSilver * 1000),
    session: 'Morning (10:00 AM)',
    dayChangeGold: 0,
    dayChangeSilver: 0,
    marketStatus: 'Active',
    lastUpdated: `${dateStr} Projected Rate`
  };
};

/**
 * Update today's Salem Market Rate and persist across all calculations
 */
export const updateTodaySalemRate = (
  gold22k: number,
  silver1g: number,
  session: 'Morning (10:00 AM)' | 'Evening (04:00 PM)' = 'Morning (10:00 AM)'
): SalemDailyRate => {
  const currentToday = getTodaySalemRate();
  const todayStr = '2026-10-25';

  const goldChange = Number((gold22k - currentToday.gold22kPerGram).toFixed(2));
  const silverChange = Number((silver1g - currentToday.silver1gRate).toFixed(2));

  const updatedRate: SalemDailyRate = {
    date: todayStr,
    gold22kPerGram: gold22k,
    gold24kPerGram: Math.round(gold22k * 1.0908),
    goldSovereign8g: gold22k * 8,
    silver1gRate: silver1g,
    silver1kgRate: Math.round(silver1g * 1000),
    session,
    dayChangeGold: goldChange,
    dayChangeSilver: silverChange,
    marketStatus: 'Active',
    lastUpdated: `Live Updated • ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  };

  try {
    const all = getStoredSalemHistoricalRates();
    all[todayStr] = updatedRate;
    localStorage.setItem(STORAGE_KEY_SALEM_RATES, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save Salem rate to storage', e);
  }

  return updatedRate;
};

/**
 * Pothys Swarna Mahal Scheme Calculation Engine
 * Given amount and day, calculates base grams, bonus weight, total grams, and jeweller perk savings
 */
export interface SchemeCalculationResult {
  dayNumber: number;
  dateStr: string;
  depositAmount: number;
  metal: 'gold' | 'silver';
  salemRateApplied: number;
  baseWeightGrams: number;
  bonusTierPct: number;
  bonusWeightGrams: number;
  totalWeightGrams: number;
  currentValuationAtLiveRate: number;
  wastageSavingsEstimated: number; // 0% VA (Wastage) Benefit (~15%)
  makingChargesSavingsEstimated: number; // 0% Making Charges Benefit (~8%)
  totalBenefitUnlocked: number;
}

export const calculateSchemeItem = (
  depositAmount: number,
  dateStr: string,
  metal: 'gold' | 'silver',
  currentLiveRate?: number
): SchemeCalculationResult => {
  const startDate = new Date('2026-10-15');
  const dayDate = new Date(dateStr);
  const dayNumber = Math.max(1, Math.floor((dayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  // 4-Tier Scheme Bonus Schedule:
  // Days 1–75: +7%
  // Days 76–150: +5%
  // Days 151–225: +3%
  // Days 226–300: +1%
  let bonusTierPct = 7;
  if (dayNumber > 225) bonusTierPct = 1;
  else if (dayNumber > 150) bonusTierPct = 3;
  else if (dayNumber > 75) bonusTierPct = 5;

  // Rate lookup for date
  const salemDaily = getSalemRateForDate(dateStr);
  const salemRateApplied = metal === 'gold' ? salemDaily.gold22kPerGram : salemDaily.silver1gRate;
  const activeSpotRate = currentLiveRate || (metal === 'gold' ? 7380 : 97.50);

  // Precision decimal formatting
  const baseWeightGrams = Number((depositAmount / salemRateApplied).toFixed(5));
  const bonusWeightGrams = Number((baseWeightGrams * (bonusTierPct / 100)).toFixed(5));
  const totalWeightGrams = Number((baseWeightGrams + bonusWeightGrams).toFixed(5));

  // Current live valuation in Salem
  const currentValuationAtLiveRate = Math.round(totalWeightGrams * activeSpotRate);

  // Guaranteed Jeweller Perks:
  // 0% VA (Wastage) saves ~15% on 22K Gold Jewellery
  // 0% Making Charges saves ~8%
  const wastageSavingsEstimated = Math.round(currentValuationAtLiveRate * 0.15);
  const makingChargesSavingsEstimated = Math.round(currentValuationAtLiveRate * 0.08);
  const totalBenefitUnlocked = Math.round(
    (currentValuationAtLiveRate - depositAmount) + wastageSavingsEstimated + makingChargesSavingsEstimated
  );

  return {
    dayNumber,
    dateStr,
    depositAmount,
    metal,
    salemRateApplied,
    baseWeightGrams,
    bonusTierPct,
    bonusWeightGrams,
    totalWeightGrams,
    currentValuationAtLiveRate,
    wastageSavingsEstimated,
    makingChargesSavingsEstimated,
    totalBenefitUnlocked
  };
};

/**
 * Jeweller physical ornament redemption catalog for Salem showroom
 */
export interface PhysicalRedemptionOption {
  id: string;
  category: 'gold' | 'silver';
  title: string;
  typicalWeightGrams: number;
  description: string;
  wastageNormallyChargedPct: number; // e.g. 14% to 18%
  makingChargesNormallyChargedPct: number; // e.g. 8% to 12%
  zeroWastageSavingsAmount: number;
  zeroMakingChargesSavingsAmount: number;
}

export const getSalemShowroomOrnaments = (
  goldGramsAccrued: number,
  silverGramsAccrued: number,
  liveGoldRate: number = 7380,
  liveSilverRate: number = 97.50
): PhysicalRedemptionOption[] => {
  return [
    {
      id: 'orn-1',
      category: 'gold',
      title: '22K Daily Wear Gold Ring',
      typicalWeightGrams: 3.5,
      description: 'Handcrafted hallmarked 916 daily wear gold ring with floral or geometric motif.',
      wastageNormallyChargedPct: 14,
      makingChargesNormallyChargedPct: 9,
      zeroWastageSavingsAmount: Math.round(3.5 * liveGoldRate * 0.14),
      zeroMakingChargesSavingsAmount: Math.round(3.5 * liveGoldRate * 0.09)
    },
    {
      id: 'orn-2',
      category: 'gold',
      title: '22K Solid Gold Pendant / Coin',
      typicalWeightGrams: 4.0,
      description: 'Lakshmi / Lord Ganesha engraved religious 22K pendant or certified tamper-proof coin.',
      wastageNormallyChargedPct: 12,
      makingChargesNormallyChargedPct: 6,
      zeroWastageSavingsAmount: Math.round(4.0 * liveGoldRate * 0.12),
      zeroMakingChargesSavingsAmount: Math.round(4.0 * liveGoldRate * 0.06)
    },
    {
      id: 'orn-3',
      category: 'gold',
      title: '22K Lightweight Rope Gold Chain',
      typicalWeightGrams: 8.0,
      description: 'Sturdy modern rope link or machine cut 8g Sovereign chain for formal and casual wear.',
      wastageNormallyChargedPct: 16,
      makingChargesNormallyChargedPct: 10,
      zeroWastageSavingsAmount: Math.round(8.0 * liveGoldRate * 0.16),
      zeroMakingChargesSavingsAmount: Math.round(8.0 * liveGoldRate * 0.10)
    },
    {
      id: 'orn-4',
      category: 'silver',
      title: '999 Pure Silver Kuthuvilakku (Pooja Lamp)',
      typicalWeightGrams: 250,
      description: 'Traditional Tamil Nadu handcrafted twin peacock pooja deepam lamp.',
      wastageNormallyChargedPct: 18,
      makingChargesNormallyChargedPct: 12,
      zeroWastageSavingsAmount: Math.round(250 * liveSilverRate * 0.18),
      zeroMakingChargesSavingsAmount: Math.round(250 * liveSilverRate * 0.12)
    },
    {
      id: 'orn-5',
      category: 'silver',
      title: '999 Fine Silver Pooja Thali Set',
      typicalWeightGrams: 350,
      description: 'Complete 5-piece auspicious pooja plate set with pancha pathiram & bell.',
      wastageNormallyChargedPct: 15,
      makingChargesNormallyChargedPct: 10,
      zeroWastageSavingsAmount: Math.round(350 * liveSilverRate * 0.15),
      zeroMakingChargesSavingsAmount: Math.round(350 * liveSilverRate * 0.10)
    }
  ];
};
