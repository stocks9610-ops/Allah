
import { Trader } from '../types';

export interface UserProfile {
  username: string;
  email: string;
  password?: string;
  phone: string;
  joinDate: string;
  balance: number;
  hasDeposited: boolean;
  wins: number;
  losses: number;
  totalInvested: number;
  activeTraders: Trader[];
  schemaVersion: string;
  // Referral Data
  nodeId: string;
  referralCount: number;
  referralEarnings: number;
  pendingClaims: number;
}

const SESSION_KEY = 'zulu_auth_token';
const USERS_DB_KEY = 'zulu_vault_ledger';
export const BUILD_ID = 'v7.0-PLATINUM-LAUNCH';

// SECURITY UPDATE: SHA-256 Hashing
const hashPassword = async (pwd: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(pwd);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const vault = {
  encode: (data: any) => btoa(JSON.stringify(data)),
  decode: (str: string) => {
    try {
      return JSON.parse(atob(str));
    } catch (e) {
      return {};
    }
  }
};

export const authService = {
  getDB: (): Record<string, UserProfile> => {
    try {
      const data = localStorage.getItem(USERS_DB_KEY);
      return data ? vault.decode(data) : {};
    } catch {
      return {};
    }
  },

  getUser: (): UserProfile | null => {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    
    const db = authService.getDB();
    const user = db[email.toLowerCase()];
    
    if (user && user.schemaVersion !== BUILD_ID) {
      user.schemaVersion = BUILD_ID;
      // Initialize referral fields if missing
      if (!user.nodeId) {
        user.nodeId = `NODE-${Math.floor(100 + Math.random() * 899)}-${user.username.substring(0, 1).toUpperCase()}`;
        user.referralCount = user.referralCount || 0;
        user.referralEarnings = user.referralEarnings || 0;
        user.pendingClaims = user.pendingClaims || 0;
      }
      authService.updateUser(user);
    }
    
    return user || null;
  },

  register: async (user: UserProfile): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const db = authService.getDB();
    const emailKey = user.email.toLowerCase();

    if (db[emailKey]) return false;

    // Hash password before storage
    const hashedPassword = user.password ? await hashPassword(user.password) : undefined;

    const nodeId = `NODE-${Math.floor(100 + Math.random() * 899)}-${user.username.substring(0, 1).toUpperCase()}`;
    db[emailKey] = { 
      ...user, 
      password: hashedPassword,
      schemaVersion: BUILD_ID, 
      activeTraders: [],
      nodeId,
      referralCount: 0,
      referralEarnings: 0,
      pendingClaims: 0
    };
    localStorage.setItem(USERS_DB_KEY, vault.encode(db));
    localStorage.setItem(SESSION_KEY, emailKey);
    return true;
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 1000));
    const db = authService.getDB();
    const user = db[email.toLowerCase()];

    if (!user) return null;

    const inputHash = await hashPassword(password);

    // Check hash
    if (user.password === inputHash) {
      localStorage.setItem(SESSION_KEY, user.email.toLowerCase());
      return user;
    }
    return null;
  },

  updateUser: (updates: Partial<UserProfile>) => {
    const current = authService.getUser();
    if (!current) return null;

    const db = authService.getDB();
    const updatedUser = { ...current, ...updates };
    
    db[current.email.toLowerCase()] = updatedUser;
    localStorage.setItem(USERS_DB_KEY, vault.encode(db));
    
    return updatedUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
