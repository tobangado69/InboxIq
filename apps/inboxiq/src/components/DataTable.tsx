import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Eye, Copy, Check } from 'lucide-react';
import { Extraction } from '../data/mockData';

interface DataTableProps {
  data: Extraction[];
  pageSize?: number;
  showPagination?: boolean;
}

const typeColors: Record<string, string> = {
  OTP: 'bg-[#E9F2F4] text-[#165A69]',
  Resi: 'bg-green-50 text-green-700',
  Invoice: 'bg-amber-50 text-amber-700',
  Reservation: 'bg-purple-50 text-purple-700',
  Payment: 'bg-blue-50 text-blue-700',
};

export default function DataTable({ data, pageSize = 10, showPagination = true }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Extraction>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Extraction) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const SortHeader = ({ field, children }: { field: keyof Extraction; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader field="date">Date</SortHeader>
              <SortHeader field="from">From</SortHeader>
              <SortHeader field="type">Type</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <SortHeader field="confidence">Confidence</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-[#E9F2F4] transition-colors">
                <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{item.date}</td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.from}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.emailSubject}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{item.value}</code>
                    <button
                      onClick={() => handleCopy(item.value, item.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy value"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.confidence >= 95 ? 'bg-green-500' : item.confidence >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{item.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View details">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
