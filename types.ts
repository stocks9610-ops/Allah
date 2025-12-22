
export interface Trader {
  id: string;
  name: string;
  avatar: string;
  roi: number;
  drawdown: number;
  followers: number;
  weeks: number;
  strategy: string;
  type: 'Trader' | 'Analyst' | 'Educator';
  experienceYears: number;
  markets: string[];
  riskScore: number;
  winRate: number;
  avgDuration: string;
  riskMethods: string[];
  bio: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type NetworkType = 'trc20' | 'erc20' | 'bep20';
