export interface MarketIndex {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  lastUpdated: string;
}

export interface MarketIndicesResponse {
  indices: MarketIndex[];
  lastUpdated: string;
}

export interface IndexDisplayProps {
  name: string;
  value: string;
  delta: string;
  negative?: boolean;
}