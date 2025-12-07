import { useState } from 'react';
import { Plus, Mail, RefreshCw, Pause, Play, Trash2, Search, Filter, Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import { emailAccounts, extractions, EmailAccount } from '../data/mockData';

export default function Emails() {
  const [accounts, setAccounts] = useState<EmailAccount[]>(emailAccounts);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTogglePause = (id: string) => {
    setAccounts(accounts.map(acc =>
      acc.id === id
        ? { ...acc, status: acc.status === 'paused' ? 'connected' : 'paused' }
        : acc
    ));
  };

  const filteredExtractions = extractions.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = searchQuery === '' ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getProviderIcon = (provider: string) => {
    if (provider === 'gmail') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6Z" fill="#EA4335"/>
          <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="2" fill="#0078D4"/>
        <path d="M4 8L12 13L20 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="4" y="6" width="16" height="12" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Email Accounts</h1>
        <p className="text-gray-500 mt-1">Manage your connected email accounts and view extracted data</p>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#208096] text-white text-sm rounded-lg hover:bg-[#165A69] transition-colors">
            <Plus className="w-4 h-4" />
            Connect Account
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {accounts.map((account) => (
            <div key={account.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {getProviderIcon(account.provider)}
                <div>
                  <div className="font-medium text-gray-900">{account.email}</div>
                  <div className="text-sm text-gray-500">
                    Last sync: {account.lastSync} · {account.emailsProcessed} emails processed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                  account.status === 'connected' ? 'bg-green-50 text-green-700' :
                  account.status === 'paused' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    account.status === 'connected' ? 'bg-green-500' :
                    account.status === 'paused' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} />
                  {account.status === 'connected' ? 'Connected' : account.status === 'paused' ? 'Paused' : 'Error'}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Sync now">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleTogglePause(account.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={account.status === 'paused' ? 'Resume' : 'Pause'}
                  >
                    {account.status === 'paused' ? (
                      <Play className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Pause className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Disconnect">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Data */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Extracted Data</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by value..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="OTP">OTP</option>
                <option value="Resi">Resi</option>
                <option value="Invoice">Invoice</option>
                <option value="Reservation">Reservation</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
            {/* Export */}
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <DataTable data={filteredExtractions} pageSize={10} />
      </div>
    </div>
  );
}
