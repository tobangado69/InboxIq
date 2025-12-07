import { useState } from 'react';
import { Plus, Copy, Check, Eye, EyeOff, Trash2, ExternalLink, Key } from 'lucide-react';
import { apiKeys, ApiKey } from '../data/mockData';

export default function Api() {
  const [keys, setKeys] = useState<ApiKey[]>(apiKeys);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: String(Date.now()),
      name: newKeyName,
      key: `iq_live_${Math.random().toString(36).substring(2, 34)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      requests: 0,
    };
    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setKeys(keys.filter(k => k.id !== id));
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 10) + '••••••••••••••••••••••';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">API Access</h1>
        <p className="text-gray-500 mt-1">Manage your API keys and integrate InboxIQ with your applications</p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-[#208096] to-[#165A69] rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Quick Start Guide</h2>
        <p className="text-white/80 mb-4">Use your API key to access extracted data programmatically.</p>
        <div className="bg-black/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <code>
            curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
            &nbsp;&nbsp;https://api.inboxiq.id/v1/extracted-data
          </code>
        </div>
        <a href="#" className="inline-flex items-center gap-2 mt-4 text-white/90 hover:text-white text-sm">
          View full documentation
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#208096] text-white text-sm rounded-lg hover:bg-[#165A69] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate New Key
          </button>
        </div>

        {keys.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
            <p className="text-gray-500 mb-4">Create an API key to start integrating InboxIQ.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#208096] text-white text-sm rounded-lg hover:bg-[#165A69] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generate New Key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{apiKey.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={showKey[apiKey.id] ? 'Hide key' : 'Show key'}
                      >
                        {showKey[apiKey.id] ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(apiKey.key, apiKey.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy key"
                      >
                        {copiedId === apiKey.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Created: {apiKey.createdAt} · Last used: {apiKey.lastUsed || 'Never'} · {apiKey.requests.toLocaleString()} requests
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(apiKey.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-500">Free Plan</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">100</div>
            <div className="text-sm text-gray-500">requests/day</div>
          </div>
          <div className="p-4 border-2 border-[#208096] rounded-lg bg-[#E9F2F4]">
            <div className="text-sm text-[#208096] font-medium">Starter Plan (Current)</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">1,000</div>
            <div className="text-sm text-gray-500">requests/day</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-500">Pro Plan</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">10,000</div>
            <div className="text-sm text-gray-500">requests/day</div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New API Key</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API, Development"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#208096] focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-[#208096] text-white text-sm rounded-lg hover:bg-[#165A69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
