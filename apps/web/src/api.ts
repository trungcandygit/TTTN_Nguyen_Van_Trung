export interface View {
  assets: string[];
  weights: number[];
  expected_return: number;
  confidence: number;
}

export interface BlackLittermanRequest {
  tickers: string[];
  lookback_days?: number;
  market_caps: Record<string, number>;
  risk_free_rate?: number;
  tau?: number;
  views: View[];
}

export interface BlackLittermanResponse {
  tickers: string[];
  implied_equilibrium_returns: number[];
  posterior_returns: number[];
  weights_market: number[];
  weights_optimal: number[];
  delta: number;
  delta_is_fallback: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8822';

export async function runDemo(req: BlackLittermanRequest): Promise<BlackLittermanResponse> {
  const res = await fetch(`${API_BASE}/api/black-litterman/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API loi ${res.status}: ${detail}`);
  }
  return res.json();
}
