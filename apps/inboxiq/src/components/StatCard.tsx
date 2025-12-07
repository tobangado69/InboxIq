import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  subtitle?: string;
}

export default function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">{icon}</div>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
        {subtitle && (
          <span className="text-sm text-gray-400 ml-2">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
