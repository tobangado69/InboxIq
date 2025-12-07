import { Mail, TrendingUp, CreditCard, Target, Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import {
  dashboardStats,
  extractionBreakdown,
  dailyTrend,
  extractions,
} from "../data/mockData";

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Monitor your email extraction activity
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#208096] text-white rounded-lg hover:bg-[#165A69] transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Emails Processed"
          value={dashboardStats.emailsProcessed.toLocaleString()}
          icon={<Mail className="w-5 h-5" />}
          trend={{ value: 12, positive: true }}
          subtitle="this month"
        />
        <StatCard
          title="Success Rate"
          value={`${dashboardStats.successRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 2, positive: true }}
        />
        <StatCard
          title="Monthly Cost"
          value={formatCurrency(dashboardStats.monthlyCost)}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Starter Plan"
        />
        <StatCard
          title="Avg Confidence"
          value={`${dashboardStats.avgConfidence}%`}
          icon={<Target className="w-5 h-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extraction Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Extraction Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={extractionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }: { name: string; value: number }) =>
                    `${name} (${value}%)`
                  }
                  labelLine={false}
                >
                  {extractionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {extractionBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Extraction Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Extractions"
                  stroke="#208096"
                  strokeWidth={2}
                  dot={{ fill: "#208096", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  name="Avg Confidence"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Extractions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Extractions
          </h2>
          <a href="/emails" className="text-sm text-[#208096] hover:underline">
            View all
          </a>
        </div>
        <DataTable data={extractions.slice(0, 5)} showPagination={false} />
      </div>
    </div>
  );
}
