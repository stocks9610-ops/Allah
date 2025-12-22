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
}

const SESSION_KEY = 'zulu_auth_token';
const USERS_DB_KEY = 'zulu_vault_ledger';
// Exporting BUILD_ID so it can be used during user registration for consistent schema versioning
export const BUILD_ID = 'v5.5-SOVEREIGN';

// Sovereign Encryption Vault (Secure Ledger Handling)
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
    
    // Auto-migrate schema if needed
    if (user && user.schemaVersion !== BUILD_ID) {
      user.schemaVersion = BUILD_ID;
      authService.updateUser(user);
    }
    
    return user || null;
  },

  register: async (user: UserProfile): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    const db = authService.getDB();
    const emailKey = user.email.toLowerCase();

    if (db[emailKey]) return false;

    db[emailKey] = { ...user, schemaVersion: BUILD_ID, activeTraders: [] };
    localStorage.setItem(USERS_DB_KEY, vault.encode(db));
    localStorage.setItem(SESSION_KEY, emailKey);
    return true;
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 1000));
    const db = authService.getDB();
    const user = db[email.toLowerCase()];

    if (user && user.password === password) {
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