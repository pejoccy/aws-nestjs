import { TimeUnits } from "src/common/interfaces";

export const planSeedData = [
  {
    name: 'Regular',
    price: 0,
    currency: 'USD',
    ranking: 1,
    validity: 9999,
    isDefault: true,
    recurring: false,
  },
  {
    name: 'Premium',
    price: 10000,
    currency: 'USD',
    ranking: 2,
    recurring: true,
    validity: 1,
    timeUnit: TimeUnits.MONTH,
    trialPeriod: 1,
    trialTimeUnit: TimeUnits.MONTH
  },
];