// Mock data for InboxIQ Dashboard

export interface Extraction {
  id: string;
  date: string;
  from: string;
  type: 'OTP' | 'Resi' | 'Invoice' | 'Reservation' | 'Payment';
  value: string;
  confidence: number;
  emailSubject: string;
  courier?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook';
  status: 'connected' | 'paused' | 'error';
  lastSync: string;
  emailsProcessed: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  requests: number;
}

export interface NotificationSettings {
  whatsapp: { enabled: boolean; number: string; verified: boolean };
  telegram: { enabled: boolean; username: string; connected: boolean };
  email: { enabled: boolean; digestTime: string };
  webhook: { enabled: boolean; url: string };
}

export interface UserProfile {
  name: string;
  email: string;
  timezone: string;
  language: 'id' | 'en';
  plan: 'free' | 'starter' | 'pro';
  emailsUsed: number;
  emailsLimit: number;
}

// Dashboard Stats
export const dashboardStats = {
  emailsProcessed: 1234,
  successRate: 96,
  monthlyCost: 99000,
  avgConfidence: 94.5,
};

// Extraction breakdown data for pie chart
export const extractionBreakdown = [
  { name: 'OTP', value: 42, color: '#208096' },
  { name: 'Resi', value: 35, color: '#22C55E' },
  { name: 'Invoice', value: 18, color: '#F59E0B' },
  { name: 'Reservation', value: 5, color: '#EF4444' },
];

// Daily extraction trend for line chart
export const dailyTrend = [
  { date: 'Dec 1', count: 45 },
  { date: 'Dec 2', count: 52 },
  { date: 'Dec 3', count: 38 },
  { date: 'Dec 4', count: 65 },
  { date: 'Dec 5', count: 48 },
  { date: 'Dec 6', count: 72 },
  { date: 'Dec 7', count: 58 },
];

// Recent extractions
export const extractions: Extraction[] = [
  { id: '1', date: '2025-12-07 14:32', from: 'Gojek', type: 'OTP', value: '847291', confidence: 99, emailSubject: 'Kode Verifikasi Gojek Anda' },
  { id: '2', date: '2025-12-07 13:15', from: 'JNE', type: 'Resi', value: 'JNE1234567890', confidence: 100, emailSubject: 'Paket Anda Sedang Dikirim', courier: 'JNE' },
  { id: '3', date: '2025-12-07 11:45', from: 'Shopee', type: 'Resi', value: 'SPXID029384756', confidence: 97, emailSubject: 'Pesanan #SHP123 Telah Dikirim', courier: 'Shopee Express' },
  { id: '4', date: '2025-12-07 10:20', from: 'Tokopedia', type: 'Invoice', value: 'INV/20251207/MPL/3847562', confidence: 95, emailSubject: 'Invoice Pembelian Tokopedia' },
  { id: '5', date: '2025-12-06 16:55', from: 'Google', type: 'OTP', value: '293847', confidence: 100, emailSubject: 'Your Google Verification Code' },
  { id: '6', date: '2025-12-06 15:30', from: 'Traveloka', type: 'Reservation', value: 'TVLK8472910', confidence: 98, emailSubject: 'Konfirmasi Booking Hotel' },
  { id: '7', date: '2025-12-06 14:12', from: 'J&T Express', type: 'Resi', value: 'JT2938475610', confidence: 96, emailSubject: 'Paket Anda Dalam Pengiriman', courier: 'J&T' },
  { id: '8', date: '2025-12-06 11:40', from: 'BCA', type: 'Payment', value: 'TRX847291038', confidence: 94, emailSubject: 'Notifikasi Transfer Berhasil' },
  { id: '9', date: '2025-12-05 17:20', from: 'Grab', type: 'OTP', value: '182736', confidence: 99, emailSubject: 'Kode OTP Grab Anda' },
  { id: '10', date: '2025-12-05 14:55', from: 'Bukalapak', type: 'Invoice', value: 'BL/INV/20251205/9283746', confidence: 93, emailSubject: 'Struk Pembelian Digital' },
  { id: '11', date: '2025-12-05 12:30', from: 'Tiki', type: 'Resi', value: 'TIKI1029384756', confidence: 98, emailSubject: 'Pengiriman Paket Anda', courier: 'TIKI' },
  { id: '12', date: '2025-12-05 10:15', from: 'WhatsApp', type: 'OTP', value: '564738', confidence: 100, emailSubject: 'WhatsApp Registration Code' },
];

// Connected email accounts
export const emailAccounts: EmailAccount[] = [
  { id: '1', email: 'toko.andi@gmail.com', provider: 'gmail', status: 'connected', lastSync: '2025-12-07 14:35', emailsProcessed: 856 },
  { id: '2', email: 'fulfillment@outlook.com', provider: 'outlook', status: 'connected', lastSync: '2025-12-07 14:30', emailsProcessed: 378 },
  { id: '3', email: 'orders.backup@gmail.com', provider: 'gmail', status: 'paused', lastSync: '2025-12-05 09:15', emailsProcessed: 0 },
];

// API Keys
export const apiKeys: ApiKey[] = [
  { id: '1', name: 'Production API', key: 'iq_live_a8f7d9e2c4b6a1f3e5d7c9b2a4f6e8d0', createdAt: '2025-11-15', lastUsed: '2025-12-07 14:20', requests: 2847 },
  { id: '2', name: 'Development', key: 'iq_test_b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2', createdAt: '2025-12-01', lastUsed: '2025-12-06 11:45', requests: 156 },
];

// Notification settings
export const notificationSettings: NotificationSettings = {
  whatsapp: { enabled: true, number: '+6281234567890', verified: true },
  telegram: { enabled: false, username: '', connected: false },
  email: { enabled: true, digestTime: '09:00' },
  webhook: { enabled: true, url: 'https://myapp.com/webhooks/inboxiq' },
};

// User profile
export const userProfile: UserProfile = {
  name: 'Andi Pratama',
  email: 'andi@tokosaya.com',
  timezone: 'Asia/Jakarta',
  language: 'id',
  plan: 'starter',
  emailsUsed: 756,
  emailsLimit: 1000,
};

// Subscription plans
export const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Gratis',
    emails: 100,
    features: ['1 Email Account', 'Basic Extraction', 'Email Notifications', '100 API Requests/day'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 99000,
    priceLabel: 'Rp 99K/bulan',
    emails: 1000,
    features: ['2 Email Accounts', 'AI Extraction', 'WhatsApp + Email', '1,000 API Requests/day', 'CSV Export'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499000,
    priceLabel: 'Rp 499K/bulan',
    emails: 10000,
    features: ['5 Email Accounts', 'Priority AI Extraction', 'All Notifications', '10,000 API Requests/day', 'Webhook Support', 'Priority Support'],
  },
];
