import { useState } from 'react';
import { User, Bell, CreditCard, Shield, Check, MessageCircle, Send, Mail, Globe } from 'lucide-react';
import { userProfile, notificationSettings, subscriptionPlans } from '../data/mockData';

type SettingsTab = 'profile' | 'notifications' | 'subscription' | 'security';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState(userProfile);
  const [notifications, setNotifications] = useState(notificationSettings);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  const usagePercent = (profile.emailsUsed / profile.emailsLimit) * 100;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and subscription</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#E9F2F4] text-[#208096]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
                    >
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value as 'id' | 'en' })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
                    >
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-[#208096] text-white rounded-lg hover:bg-[#165A69] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Receive OTP codes and alerts via WhatsApp</p>
                    {notifications.whatsapp.verified && (
                      <p className="text-sm text-green-600 mt-1">Connected: {notifications.whatsapp.number}</p>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.whatsapp.enabled}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        whatsapp: { ...notifications.whatsapp, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#208096] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#208096]"></div>
                  </label>
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Send className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Telegram</h3>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Receive notifications via Telegram Bot</p>
                    {!notifications.telegram.connected && (
                      <button className="text-sm text-[#208096] hover:underline mt-1">Connect Telegram</button>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.telegram.enabled}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        telegram: { ...notifications.telegram, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#208096] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#208096]"></div>
                  </label>
                </div>
              </div>

              {/* Email Digest */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Email Digest</h3>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Receive daily summary of extractions</p>
                    <p className="text-sm text-gray-500 mt-1">Sent at {notifications.email.digestTime} WIB</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email.enabled}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        email: { ...notifications.email, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#208096] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#208096]"></div>
                  </label>
                </div>
              </div>

              {/* Webhook */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Webhook</h3>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">Send extraction events to your server</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.webhook.enabled}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        webhook: { ...notifications.webhook, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#208096] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#208096]"></div>
                  </label>
                </div>
                {notifications.webhook.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={notifications.webhook.url}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        webhook: { ...notifications.webhook, url: e.target.value }
                      })}
                      placeholder="https://yourapp.com/webhooks/inboxiq"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-[#208096]">{profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</span>
                    <span className="text-gray-500 ml-2">Plan</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Rp 99K/bulan</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Email Usage</span>
                    <span className="text-gray-900 font-medium">{profile.emailsUsed} / {profile.emailsLimit}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-[#208096]'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-xl shadow-sm p-6 relative ${
                      plan.popular ? 'ring-2 ring-[#208096]' : ''
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#208096] text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.priceLabel}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{plan.emails.toLocaleString()} emails/month</p>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full mt-6 py-2 rounded-lg font-medium transition-colors ${
                        profile.plan === plan.id
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-[#208096] text-white hover:bg-[#165A69]'
                      }`}
                      disabled={profile.plan === plan.id}
                    >
                      {profile.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Change Password</h3>
                    <p className="text-sm text-gray-500 mb-4">Update your password to keep your account secure</p>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                  </div>
                  <hr />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                    <button className="px-4 py-2 bg-[#208096] text-white rounded-lg text-sm hover:bg-[#165A69] transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  <hr />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Active Sessions</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your active sessions across devices</p>
                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
                      Log Out All Devices
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h2>
                <p className="text-sm text-gray-500 mb-4">Download all your data in JSON format (GDPR compliance)</p>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Export All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
