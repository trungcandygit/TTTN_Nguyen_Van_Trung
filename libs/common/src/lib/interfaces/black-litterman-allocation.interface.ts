export interface BlackLittermanAllocationEntry {
  blackLittermanWeight: number;
  currentWeight: number;
  name: string;
  symbol: string;
}

export interface BlackLittermanAllocationResponse {
  asOf: string;
  holdings: BlackLittermanAllocationEntry[];
}
