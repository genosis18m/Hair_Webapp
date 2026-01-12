import axios from 'axios';

// In production, use relative path (same domain), in dev use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  // Sync user with backend after Clerk login
  syncUser: async (userData: {
    clerkId: string;
    email: string;
    name?: string;
    imageUrl?: string;
  }) => {
    const response = await api.post('/api/users/sync', userData);
    return response.data;
  },

  // Get user profile with analysis history
  getUser: async (clerkId: string) => {
    const response = await api.get(`/api/users/${clerkId}`);
    return response.data;
  },

  // Update user credits
  updateCredits: async (clerkId: string, amount: number) => {
    const response = await api.patch(`/api/users/${clerkId}/credits`, { amount });
    return response.data;
  },
};

// Analysis API
export const analysisApi = {
  // Save analysis result
  saveAnalysis: async (data: {
    clerkId: string;
    imageUrl?: string;
    predictions: Array<{ className: string; probability: number }>;
  }) => {
    const response = await api.post('/api/analyses', data);
    return response.data;
  },

  // Get analysis history
  getHistory: async (clerkId: string, limit = 10) => {
    const response = await api.get(`/api/analyses/${clerkId}?limit=${limit}`);
    return response.data;
  },
};

// Payment API
export const paymentApi = {
  // Create Stripe checkout session
  createCheckoutSession: async (data: {
    planId: string;
    planAmount: number;
    planCurrency?: string;
    clerkId: string;
  }) => {
    const response = await api.post('/api/create-checkout-session', data);
    return response.data;
  },

  // Purchase credits
  purchaseCredits: async (clerkId: string, credits: number) => {
    const response = await api.post('/api/credits/purchase', { clerkId, credits });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
