/**
 * Demo data for local development and manual testing of the administration
 * features: 1 admin + 15 users with many kinds of activities (stocks, ETFs,
 * crypto, gold, bond fund, dividends, fees, interest, liability) from 2021 up
 * to today.
 *
 * IMPORTANT: prices are SYNTHETIC (seeded random walk anchored to plausible
 * price levels), stored with the MANUAL data source, so the data works offline
 * and never mixes with real market data. Do not use it for real investment
 * decisions. Usernames/tokens are for development only (see
 * docs/DEMO_ACCOUNTS.md).
 *
 * Run: npm run database:seed:demo   (then restart the API to reload FX rates)
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { createHmac, randomUUID } from 'node:crypto';

const DATABASE_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
const ACCESS_TOKEN_SALT = process.env.ACCESS_TOKEN_SALT;

if (!DATABASE_URL || !ACCESS_TOKEN_SALT) {
  console.error('DATABASE_URL and ACCESS_TOKEN_SALT must be set (see .env)');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL })
});

// ---------------------------------------------------------------------------
// Deterministic random numbers
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260929);

function normal() {
  const u = Math.max(rng(), 1e-12);
  const v = rng();

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const pick = <T,>(items: T[]) => items[Math.floor(rng() * items.length)];
const between = (min: number, max: number) => min + rng() * (max - min);

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000;
const START = Date.UTC(2021, 0, 4);
const now = new Date();
const END = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10);
const isWeekend = (time: number) => [0, 6].includes(new Date(time).getUTCDay());

const calendar: number[] = [];

for (let time = START; time <= END; time += DAY) {
  calendar.push(time);
}

// ---------------------------------------------------------------------------
// Assets (all MANUAL data source, synthetic prices)
// ---------------------------------------------------------------------------

type Group = 'VN' | 'US' | 'CRYPTO' | 'GOLD' | 'BOND';

interface AssetDefinition {
  assetClass: string;
  assetSubClass: string;
  countries?: { code: string; weight: number }[];
  currency: 'USD' | 'VND';
  drift: number;
  feeRate: number;
  group: Group;
  lot: number;
  name: string;
  price0: number;
  sectors?: { name: string; weight: number }[];
  symbol: string;
  vol: number;
  yearlyDividendYield?: number;
}

const vn = [{ code: 'VN', weight: 1 }];
const us = [{ code: 'US', weight: 1 }];

const ASSETS: AssetDefinition[] = [
  // Vietnamese stocks
  {
    symbol: 'VNM',
    name: 'Vinamilk (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 85000,
    drift: 0.04,
    vol: 0.28,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Consumer Defensive', weight: 1 }],
    yearlyDividendYield: 0.05
  },
  {
    symbol: 'FPT',
    name: 'FPT Corp (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 52000,
    drift: 0.28,
    vol: 0.34,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Technology', weight: 1 }],
    yearlyDividendYield: 0.02
  },
  {
    symbol: 'VCB',
    name: 'Vietcombank (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 95000,
    drift: 0.1,
    vol: 0.27,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Financial Services', weight: 1 }],
    yearlyDividendYield: 0.01
  },
  {
    symbol: 'HPG',
    name: 'Hòa Phát (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 42000,
    drift: -0.02,
    vol: 0.42,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Basic Materials', weight: 1 }],
    yearlyDividendYield: 0.015
  },
  {
    symbol: 'MWG',
    name: 'Thế Giới Di Động (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 71000,
    drift: 0.0,
    vol: 0.4,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Consumer Cyclical', weight: 1 }],
    yearlyDividendYield: 0.01
  },
  {
    symbol: 'VIC',
    name: 'Vingroup (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 98000,
    drift: -0.05,
    vol: 0.45,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Real Estate', weight: 1 }]
  },
  {
    symbol: 'ACB',
    name: 'Ngân hàng ACB (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 28000,
    drift: 0.12,
    vol: 0.3,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Financial Services', weight: 1 }],
    yearlyDividendYield: 0.03
  },
  {
    symbol: 'MBB',
    name: 'Ngân hàng MB (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 22000,
    drift: 0.14,
    vol: 0.33,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Financial Services', weight: 1 }],
    yearlyDividendYield: 0.02
  },
  {
    symbol: 'SSI',
    name: 'Chứng khoán SSI (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 30000,
    drift: 0.08,
    vol: 0.45,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: vn,
    sectors: [{ name: 'Financial Services', weight: 1 }]
  },
  {
    symbol: 'E1VFVN30',
    name: 'ETF VN30 (dữ liệu mẫu)',
    group: 'VN',
    currency: 'VND',
    price0: 17500,
    drift: 0.09,
    vol: 0.22,
    lot: 1,
    feeRate: 0.0015,
    assetClass: 'EQUITY',
    assetSubClass: 'ETF',
    countries: vn,
    yearlyDividendYield: 0.0
  },
  // US stocks / ETF
  {
    symbol: 'AAPL',
    name: 'Apple (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 130,
    drift: 0.16,
    vol: 0.28,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: us,
    sectors: [{ name: 'Technology', weight: 1 }],
    yearlyDividendYield: 0.005
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 222,
    drift: 0.2,
    vol: 0.27,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: us,
    sectors: [{ name: 'Technology', weight: 1 }],
    yearlyDividendYield: 0.008
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 13,
    drift: 0.55,
    vol: 0.55,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: us,
    sectors: [{ name: 'Technology', weight: 1 }]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 243,
    drift: 0.05,
    vol: 0.62,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: us,
    sectors: [{ name: 'Consumer Cyclical', weight: 1 }]
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 87,
    drift: 0.17,
    vol: 0.31,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'STOCK',
    countries: us,
    sectors: [{ name: 'Communication Services', weight: 1 }]
  },
  {
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF (dữ liệu mẫu)',
    group: 'US',
    currency: 'USD',
    price0: 335,
    drift: 0.11,
    vol: 0.17,
    lot: 0.01,
    feeRate: 0.0025,
    assetClass: 'EQUITY',
    assetSubClass: 'ETF',
    countries: us,
    yearlyDividendYield: 0.013
  },
  // Crypto (24/7)
  {
    symbol: 'BTC',
    name: 'Bitcoin (dữ liệu mẫu)',
    group: 'CRYPTO',
    currency: 'USD',
    price0: 32000,
    drift: 0.35,
    vol: 0.65,
    lot: 0.000001,
    feeRate: 0.002,
    assetClass: 'LIQUIDITY',
    assetSubClass: 'CRYPTOCURRENCY'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum (dữ liệu mẫu)',
    group: 'CRYPTO',
    currency: 'USD',
    price0: 1000,
    drift: 0.3,
    vol: 0.8,
    lot: 0.000001,
    feeRate: 0.002,
    assetClass: 'LIQUIDITY',
    assetSubClass: 'CRYPTOCURRENCY'
  },
  {
    symbol: 'SOL',
    name: 'Solana (dữ liệu mẫu)',
    group: 'CRYPTO',
    currency: 'USD',
    price0: 3,
    drift: 0.5,
    vol: 1.1,
    lot: 0.0001,
    feeRate: 0.002,
    assetClass: 'LIQUIDITY',
    assetSubClass: 'CRYPTOCURRENCY'
  },
  {
    symbol: 'BNB',
    name: 'BNB (dữ liệu mẫu)',
    group: 'CRYPTO',
    currency: 'USD',
    price0: 38,
    drift: 0.4,
    vol: 0.75,
    lot: 0.0001,
    feeRate: 0.002,
    assetClass: 'LIQUIDITY',
    assetSubClass: 'CRYPTOCURRENCY'
  },
  // Gold and bond fund
  {
    symbol: 'SJC',
    name: 'Vàng SJC (lượng, dữ liệu mẫu)',
    group: 'GOLD',
    currency: 'VND',
    price0: 56000000,
    drift: 0.12,
    vol: 0.14,
    lot: 0.1,
    feeRate: 0.0,
    assetClass: 'COMMODITY',
    assetSubClass: 'PRECIOUS_METAL'
  },
  {
    symbol: 'VFMVFB',
    name: 'Quỹ trái phiếu VFMVFB (dữ liệu mẫu)',
    group: 'BOND',
    currency: 'VND',
    price0: 10500,
    drift: 0.06,
    vol: 0.03,
    lot: 1,
    feeRate: 0.0,
    assetClass: 'FIXED_INCOME',
    assetSubClass: 'MUTUALFUND',
    countries: vn
  }
];

const assetBySymbol = new Map(ASSETS.map((asset) => [asset.symbol, asset]));

// ---------------------------------------------------------------------------
// Synthetic prices (one-factor-per-group model with a small global factor)
// ---------------------------------------------------------------------------

const groupFactor: Record<Group, number[]> = {
  VN: [],
  US: [],
  CRYPTO: [],
  GOLD: [],
  BOND: []
};
const globalFactor: number[] = [];

for (let i = 0; i < calendar.length; i++) {
  globalFactor.push(normal());

  for (const group of Object.keys(groupFactor) as Group[]) {
    groupFactor[group].push(normal());
  }
}

const prices = new Map<string, Map<number, number>>();

function generatePrices(
  symbol: string,
  price0: number,
  drift: number,
  vol: number,
  group: Group
) {
  const series = new Map<number, number>();
  const crypto = group === 'CRYPTO';
  const dt = crypto ? 1 / 365 : 1 / 252;
  const beta = crypto ? 0.7 : 0.6;
  const betaGlobal = 0.2;
  const idio = Math.sqrt(1 - beta * beta - betaGlobal * betaGlobal);
  let price = price0;

  calendar.forEach((time, i) => {
    if (!crypto && isWeekend(time)) {
      return;
    }

    if (series.size > 0) {
      const shock =
        beta * groupFactor[group][i] +
        betaGlobal * globalFactor[i] +
        idio * normal();

      price *= Math.exp(
        (drift - 0.5 * vol * vol) * dt + vol * Math.sqrt(dt) * shock
      );
    }

    series.set(time, price);
  });

  prices.set(symbol, series);
}

for (const asset of ASSETS) {
  generatePrices(
    asset.symbol,
    asset.price0,
    asset.drift,
    asset.vol,
    asset.group
  );
}

// USD/VND exchange rate (stored as Yahoo pair, like the real FX data)
generatePrices('USDVND', 23100, 0.025, 0.03, 'BOND');

function priceOn(symbol: string, time: number): number {
  const series = prices.get(symbol);
  let t = time;

  // walk back to the last day with a price (weekends / before listing)
  while (series && !series.has(t) && t > START) {
    t -= DAY;
  }

  return series?.get(t) ?? series?.get(START) ?? 0;
}

const fxOn = (time: number) => priceOn('USDVND', time);

// ---------------------------------------------------------------------------
// Personas
// ---------------------------------------------------------------------------

interface Persona {
  accounts: string[];
  budget: number; // monthly investment budget in VND
  interestOnSavings?: boolean;
  liability?: boolean;
  role?: 'ADMIN' | 'USER';
  sellEveryMonths?: number;
  sellFraction?: number;
  start: string;
  title: string;
  token: string;
  weights: Record<string, number>;
}

const PERSONAS: Persona[] = [
  {
    token: 'admin-bl-advisor',
    role: 'ADMIN',
    title: 'Quản trị viên (danh mục hỗn hợp)',
    start: '2021-03-01',
    budget: 20_000_000,
    sellEveryMonths: 9,
    sellFraction: 0.2,
    accounts: ['Tài khoản chứng khoán', 'Ví crypto'],
    weights: { VNM: 2, FPT: 3, VCB: 2, AAPL: 2, BTC: 2, SJC: 1 }
  },
  {
    token: 'demo-user-01',
    title: 'Cổ phiếu Việt Nam dài hạn',
    start: '2021-02-01',
    budget: 15_000_000,
    accounts: ['Tài khoản SSI'],
    weights: { VNM: 3, FPT: 3, VCB: 3, HPG: 1 }
  },
  {
    token: 'demo-user-02',
    title: 'Lướt sóng cổ phiếu VN',
    start: '2021-06-01',
    budget: 30_000_000,
    sellEveryMonths: 1,
    sellFraction: 0.35,
    accounts: ['Tài khoản VPS'],
    weights: { MWG: 2, SSI: 3, HPG: 3, VIC: 2, ACB: 2 }
  },
  {
    token: 'demo-user-03',
    title: 'Nắm giữ Bitcoin, Ethereum',
    start: '2021-01-15',
    budget: 12_000_000,
    sellEveryMonths: 12,
    sellFraction: 0.15,
    accounts: ['Ví Binance'],
    weights: { BTC: 6, ETH: 4 }
  },
  {
    token: 'demo-user-04',
    title: 'Trader altcoin',
    start: '2021-09-01',
    budget: 18_000_000,
    sellEveryMonths: 2,
    sellFraction: 0.4,
    accounts: ['Ví Binance', 'Ví lạnh'],
    weights: { SOL: 4, BNB: 3, ETH: 2, BTC: 1 }
  },
  {
    token: 'demo-user-05',
    title: 'Cổ phiếu Mỹ',
    start: '2021-04-01',
    budget: 25_000_000,
    accounts: ['Tài khoản IBKR'],
    weights: { AAPL: 3, MSFT: 3, NVDA: 3, GOOGL: 2 }
  },
  {
    token: 'demo-user-06',
    title: 'Cân bằng VN + Mỹ + crypto + vàng',
    start: '2021-05-01',
    budget: 22_000_000,
    sellEveryMonths: 6,
    sellFraction: 0.15,
    accounts: ['Chứng khoán VN', 'Tài khoản Mỹ', 'Ví crypto'],
    weights: { FPT: 2, VCB: 2, VOO: 3, BTC: 2, ETH: 1, SJC: 2 }
  },
  {
    token: 'demo-user-07',
    title: 'Bảo thủ: vàng, trái phiếu, ETF',
    start: '2021-01-20',
    budget: 10_000_000,
    interestOnSavings: true,
    accounts: ['Tài khoản quỹ', 'Vàng SJC'],
    weights: { SJC: 4, VFMVFB: 4, E1VFVN30: 2 }
  },
  {
    token: 'demo-user-08',
    title: 'DCA ETF hàng tháng',
    start: '2021-03-01',
    budget: 8_000_000,
    accounts: ['Tài khoản DCA'],
    weights: { E1VFVN30: 5, VOO: 5 }
  },
  {
    token: 'demo-user-09',
    title: 'Nhóm ngân hàng',
    start: '2021-07-01',
    budget: 14_000_000,
    sellEveryMonths: 8,
    sellFraction: 0.25,
    accounts: ['Tài khoản SSI'],
    weights: { VCB: 4, ACB: 3, MBB: 3 }
  },
  {
    token: 'demo-user-10',
    title: 'Công nghệ VN + Mỹ',
    start: '2021-08-01',
    budget: 20_000_000,
    accounts: ['Tài khoản công nghệ'],
    weights: { FPT: 4, NVDA: 3, MSFT: 2, TSLA: 1 }
  },
  {
    token: 'demo-user-11',
    title: 'Vàng và tiết kiệm',
    start: '2021-02-15',
    budget: 9_000_000,
    interestOnSavings: true,
    accounts: ['Tài khoản tiết kiệm', 'Vàng'],
    weights: { SJC: 7, VFMVFB: 3 }
  },
  {
    token: 'demo-user-12',
    title: 'Đa dạng toàn bộ tài sản',
    start: '2021-04-15',
    budget: 35_000_000,
    sellEveryMonths: 4,
    sellFraction: 0.12,
    accounts: ['Chứng khoán', 'Crypto', 'Vàng & quỹ'],
    weights: {
      VNM: 1,
      FPT: 1,
      VCB: 1,
      HPG: 1,
      AAPL: 1,
      MSFT: 1,
      NVDA: 1,
      VOO: 1,
      BTC: 1,
      ETH: 1,
      SJC: 1,
      VFMVFB: 1
    }
  },
  {
    token: 'demo-user-13',
    title: 'Nhà đầu tư mới (2 năm gần đây)',
    start: '2024-09-01',
    budget: 5_000_000,
    accounts: ['Tài khoản mới'],
    weights: { E1VFVN30: 4, FPT: 3, BTC: 3 }
  },
  {
    token: 'demo-user-14',
    title: 'Sử dụng margin (có khoản vay)',
    start: '2022-01-10',
    budget: 28_000_000,
    liability: true,
    sellEveryMonths: 3,
    sellFraction: 0.3,
    accounts: ['Tài khoản margin'],
    weights: { HPG: 3, VIC: 2, SSI: 3, MWG: 2 }
  },
  {
    token: 'demo-user-15',
    title: 'Bán dần, thu cổ tức',
    start: '2021-01-11',
    budget: 16_000_000,
    sellEveryMonths: 3,
    sellFraction: 0.2,
    accounts: ['Tài khoản cổ tức'],
    weights: { VNM: 4, VCB: 3, ACB: 2, MBB: 2, VOO: 2 }
  }
];

// ---------------------------------------------------------------------------
// Activity generation
// ---------------------------------------------------------------------------

interface ActivityRow {
  accountId: string;
  comment?: string;
  currency: string;
  date: Date;
  fee: number;
  quantity: number;
  symbolKey: string; // asset symbol or "@interest" / "@fee" / "@liability"
  type: 'BUY' | 'DIVIDEND' | 'FEE' | 'INTEREST' | 'LIABILITY' | 'SELL';
  unitPrice: number;
}

const roundTo = (value: number, step: number) => {
  const rounded = Math.floor(value / step) * step;

  return Number(rounded.toFixed(8));
};

function previousBusinessDay(time: number, crypto: boolean) {
  let t = time;

  while (!crypto && isWeekend(t)) {
    t -= DAY;
  }

  return t;
}

function buildActivities(persona: Persona, accountIds: string[]) {
  const rows: ActivityRow[] = [];
  const holdings = new Map<string, number>();
  const symbols = Object.keys(persona.weights);
  const totalWeight = symbols.reduce((s, k) => s + persona.weights[k], 0);
  const start = Date.parse(persona.start);
  const accountFor = (asset: AssetDefinition) => {
    if (accountIds.length === 1) {
      return accountIds[0];
    }

    const index = { VN: 0, US: 1, CRYPTO: 2, GOLD: 2, BOND: 2 }[asset.group];

    return accountIds[Math.min(index, accountIds.length - 1)];
  };

  let month = 0;
  let savings = 0;

  for (let time = start; time <= END; time += 30.4 * DAY, month++) {
    const monthStart = previousBusinessDay(Math.floor(time / DAY) * DAY, false);

    // Monthly buys (dollar-cost averaging with some randomness)
    for (const symbol of symbols) {
      const asset = assetBySymbol.get(symbol)!;
      const budget =
        ((persona.budget * persona.weights[symbol]) / totalWeight) *
        between(0.6, 1.4);

      if (rng() < 0.12 && persona.sellEveryMonths !== 1) {
        continue; // skip some months
      }

      const day = previousBusinessDay(
        monthStart + Math.floor(between(0, 20)) * DAY,
        asset.group === 'CRYPTO'
      );

      if (day > END) {
        continue;
      }

      const unitPrice = priceOn(asset.symbol, day);
      const priceVnd =
        asset.currency === 'USD' ? unitPrice * fxOn(day) : unitPrice;
      const quantity = roundTo(budget / priceVnd, asset.lot);

      if (quantity <= 0) {
        continue;
      }

      rows.push({
        accountId: accountFor(asset),
        currency: asset.currency,
        date: new Date(day),
        fee: Number((quantity * unitPrice * asset.feeRate).toFixed(4)),
        quantity,
        symbolKey: asset.symbol,
        type: 'BUY',
        unitPrice: Number(unitPrice.toFixed(asset.currency === 'VND' ? 0 : 4))
      });
      holdings.set(symbol, (holdings.get(symbol) ?? 0) + quantity);
    }

    // Periodic partial sells
    if (
      persona.sellEveryMonths &&
      month > 0 &&
      month % persona.sellEveryMonths === 0
    ) {
      const held = symbols.filter((symbol) => (holdings.get(symbol) ?? 0) > 0);

      if (held.length > 0) {
        const symbol = pick(held);
        const asset = assetBySymbol.get(symbol)!;
        const day = previousBusinessDay(
          monthStart + Math.floor(between(2, 25)) * DAY,
          asset.group === 'CRYPTO'
        );

        if (day <= END) {
          const quantity = roundTo(
            (holdings.get(symbol) ?? 0) *
              (persona.sellFraction ?? 0.2) *
              between(0.7, 1.2),
            asset.lot
          );
          const unitPrice = priceOn(asset.symbol, day);

          if (quantity > 0 && quantity <= (holdings.get(symbol) ?? 0)) {
            rows.push({
              accountId: accountFor(asset),
              currency: asset.currency,
              date: new Date(day),
              fee: Number(
                (quantity * unitPrice * (asset.feeRate + 0.001)).toFixed(4)
              ),
              quantity,
              symbolKey: asset.symbol,
              type: 'SELL',
              unitPrice: Number(
                unitPrice.toFixed(asset.currency === 'VND' ? 0 : 4)
              )
            });
            holdings.set(symbol, (holdings.get(symbol) ?? 0) - quantity);
          }
        }
      }
    }

    // Savings interest
    if (persona.interestOnSavings) {
      savings += persona.budget * 0.3;

      rows.push({
        accountId: accountIds[0],
        comment: 'Lãi tiền gửi tiết kiệm',
        currency: 'VND',
        date: new Date(previousBusinessDay(monthStart + 27 * DAY, false)),
        fee: 0,
        quantity: 1,
        symbolKey: '@interest',
        type: 'INTEREST',
        unitPrice: Math.round((savings * 0.055) / 12)
      });
    }
  }

  // Dividends (paid in the currency of the asset on the current holding)
  for (const symbol of symbols) {
    const asset = assetBySymbol.get(symbol)!;

    if (!asset.yearlyDividendYield) {
      continue;
    }

    const paymentsPerYear = asset.group === 'US' ? 4 : 2;
    const months = paymentsPerYear === 4 ? [3, 6, 9, 12] : [6, 12];

    for (let year = 2021; year <= now.getUTCFullYear(); year++) {
      for (const m of months) {
        const day = previousBusinessDay(Date.UTC(year, m - 1, 20), false);

        if (day > END || day < Date.parse(persona.start)) {
          continue;
        }

        // quantity held at that date
        const quantityHeld = rows
          .filter(
            (row) => row.symbolKey === symbol && row.date.getTime() <= day
          )
          .reduce(
            (s, row) =>
              s +
              (row.type === 'BUY'
                ? row.quantity
                : row.type === 'SELL'
                  ? -row.quantity
                  : 0),
            0
          );

        if (quantityHeld <= 0) {
          continue;
        }

        const perShare =
          (priceOn(symbol, day) * asset.yearlyDividendYield) / paymentsPerYear;

        rows.push({
          accountId: accountFor(asset),
          currency: asset.currency,
          date: new Date(day),
          fee: 0,
          quantity: Number(quantityHeld.toFixed(6)),
          symbolKey: symbol,
          type: 'DIVIDEND',
          unitPrice: Number(perShare.toFixed(asset.currency === 'VND' ? 0 : 4))
        });
      }
    }
  }

  // Yearly custody / account fee
  for (
    let year = new Date(start).getUTCFullYear();
    year <= now.getUTCFullYear();
    year++
  ) {
    const day = previousBusinessDay(Date.UTC(year, 11, 28), false);

    if (day >= start && day <= END) {
      rows.push({
        accountId: accountIds[0],
        comment: 'Phí lưu ký / quản lý tài khoản',
        currency: 'VND',
        date: new Date(day),
        fee: 0,
        quantity: 1,
        symbolKey: '@fee',
        type: 'FEE',
        unitPrice: 240000
      });
    }
  }

  if (persona.liability) {
    rows.push({
      accountId: accountIds[0],
      comment: 'Khoản vay ký quỹ (margin)',
      currency: 'VND',
      date: new Date(Date.UTC(2023, 2, 1)),
      fee: 0,
      quantity: 1,
      symbolKey: '@liability',
      type: 'LIABILITY',
      unitPrice: 300_000_000
    });
  }

  return rows.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const hashToken = (token: string) =>
  createHmac('sha512', ACCESS_TOKEN_SALT!).update(token).digest('hex');

const userId = (index: number) =>
  `d0000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;

async function main() {
  console.log('Removing previous demo users ...');
  await prisma.user.deleteMany({
    where: { id: { in: PERSONAS.map((_, i) => userId(i)) } }
  });

  console.log('Writing asset profiles and synthetic market data ...');

  const profileIds = new Map<string, string>();

  for (const asset of ASSETS) {
    const profile = await prisma.symbolProfile.upsert({
      create: {
        assetClass: asset.assetClass as never,
        assetSubClass: asset.assetSubClass as never,
        countries: (asset.countries ?? []) as never,
        currency: asset.currency,
        dataSource: 'MANUAL',
        name: asset.name,
        sectors: (asset.sectors ?? []) as never,
        symbol: asset.symbol
      },
      update: {
        assetClass: asset.assetClass as never,
        assetSubClass: asset.assetSubClass as never,
        countries: (asset.countries ?? []) as never,
        currency: asset.currency,
        name: asset.name,
        sectors: (asset.sectors ?? []) as never
      },
      where: {
        dataSource_symbol: { dataSource: 'MANUAL', symbol: asset.symbol }
      }
    });

    profileIds.set(asset.symbol, profile.id);
  }

  await prisma.marketData.deleteMany({
    where: {
      dataSource: 'MANUAL',
      symbol: { in: ASSETS.map(({ symbol }) => symbol) }
    }
  });

  const marketRows: {
    dataSource: 'MANUAL' | 'YAHOO';
    date: Date;
    marketPrice: number;
    symbol: string;
  }[] = [];

  for (const asset of ASSETS) {
    for (const [time, price] of prices.get(asset.symbol)!) {
      marketRows.push({
        dataSource: 'MANUAL',
        date: new Date(time),
        marketPrice: Number(price.toFixed(asset.currency === 'VND' ? 0 : 4)),
        symbol: asset.symbol
      });
    }
  }

  // FX pair: do not overwrite real rates if they exist (skipDuplicates)
  for (const [time, price] of prices.get('USDVND')!) {
    marketRows.push({
      dataSource: 'YAHOO',
      date: new Date(time),
      marketPrice: Number(price.toFixed(2)),
      symbol: 'USDVND'
    });
  }

  for (let i = 0; i < marketRows.length; i += 5000) {
    await prisma.marketData.createMany({
      data: marketRows.slice(i, i + 5000),
      skipDuplicates: true
    });
  }

  console.log(`  ${marketRows.length} market data rows`);

  const summary: string[] = [];

  for (let index = 0; index < PERSONAS.length; index++) {
    const persona = PERSONAS[index];
    const id = userId(index);
    const createdAt = new Date(Date.parse(persona.start) - 20 * DAY);

    await prisma.user.create({
      data: {
        accessToken: hashToken(persona.token),
        createdAt,
        id,
        provider: 'ANONYMOUS',
        role: persona.role ?? 'USER'
      }
    });

    await prisma.settings.create({
      data: {
        settings: {
          baseCurrency: 'VND',
          dateRange: 'max',
          language: 'vi',
          locale: 'vi-VN'
        },
        userId: id
      }
    });

    await prisma.analytics.create({
      data: {
        activityCount: Math.floor(between(20, 400)),
        country: 'VN',
        lastRequestAt: new Date(END - Math.floor(between(0, 60)) * DAY),
        userId: id
      }
    });

    const accountIds: string[] = [];

    for (const name of persona.accounts) {
      const accountId = randomUUID();

      await prisma.account.create({
        data: { currency: 'VND', id: accountId, name, userId: id }
      });
      accountIds.push(accountId);
    }

    const rows = buildActivities(persona, accountIds);

    // Per-user manual profiles for interest / fee / liability
    const specialIds = new Map<string, string>();

    for (const [key, name] of [
      ['@interest', 'Lãi tiền gửi tiết kiệm'],
      ['@fee', 'Phí lưu ký / quản lý tài khoản'],
      ['@liability', 'Khoản vay ký quỹ (margin)']
    ] as const) {
      if (rows.some((row) => row.symbolKey === key)) {
        const profile = await prisma.symbolProfile.create({
          data: {
            assetClass: 'LIQUIDITY',
            assetSubClass: 'CASH',
            currency: 'VND',
            dataSource: 'MANUAL',
            name,
            symbol: randomUUID(),
            userId: id
          }
        });

        specialIds.set(key, profile.id);
      }
    }

    await prisma.order.createMany({
      data: rows.map((row) => ({
        accountId: row.accountId,
        accountUserId: id,
        comment: row.comment,
        currency: row.currency,
        date: row.date,
        fee: row.fee,
        quantity: row.quantity,
        symbolProfileId: (row.symbolKey.startsWith('@')
          ? specialIds.get(row.symbolKey)
          : profileIds.get(row.symbolKey))!,
        type: row.type,
        unitPrice: row.unitPrice,
        userId: id
      }))
    });

    const counts = rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.type] = (acc[row.type] ?? 0) + 1;

      return acc;
    }, {});

    summary.push(
      `${persona.role === 'ADMIN' ? 'ADMIN' : 'USER '}  ${persona.token.padEnd(18)} ${rows.length
        .toString()
        .padStart(4)} giao dịch  (${Object.entries(counts)
        .map(([type, n]) => `${type}:${n}`)
        .join(' ')})  ${persona.title}`
    );
  }

  console.log('\nDemo accounts (token = mật khẩu đăng nhập):\n');
  console.log(summary.join('\n'));
  console.log(
    '\nLưu ý: khởi động lại API để nạp tỷ giá USD/VND, và xoá cache nếu cần: redis-cli FLUSHALL'
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
