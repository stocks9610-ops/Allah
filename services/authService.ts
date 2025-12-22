
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
  activeTraders: Trader[]; // NEW: Array of active connections
}

const SESSION_KEY = 'copytrade_active_session';
const USERS_DB_KEY = 'copytrade_users_db'; // Stores all registered users locally

export const authService = {
  // Helper to get the full user database from local storage
  getDB: (): Record<string, UserProfile> => {
    try {
      const data = localStorage.getItem(USERS_DB_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getUser: (): UserProfile | null => {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    
    const db = authService.getDB();
    return db[email.toLowerCase()] || null;
  },

  register: async (user: UserProfile): Promise<boolean> => {
    // Simulate network delay for realistic feel
    await new Promise(r => setTimeout(r, 800));
    
    const db = authService.getDB();
    const emailKey = user.email.toLowerCase();

    if (db[emailKey]) {
      return false; // User already exists
    }

    // Save user to local "Database"
    db[emailKey] = { ...user, activeTraders: [] }; // Ensure activeTraders init
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    
    // Set active session
    localStorage.setItem(SESSION_KEY, emailKey);
    return true;
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 800));
    
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
    
    // Update the record in the local DB
    db[current.email.toLowerCase()] = updatedUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    
    return updatedUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(SESSION_KEY) !== null;
  }
};
