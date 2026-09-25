import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { fetchAnalyticsFromApi, exportExecutiveReportToCSV } from '../services/reportsApi'
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  CreditCard,
  Calendar,
  DollarSign,
  Users,
  BedDouble,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'

const Reports = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('this-month')

  const loadData = async (range = timeRange) => {
    setLoading(true)
    try {
      const data = await fetchAnalyticsFromApi(range)
      setAnalytics(data)
    } catch (err) {
      toast.error('Failed to load executive analytics report.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(timeRange)
  }, [timeRange])

  const handleExport = () => {
    if (analytics) {
      exportExecutiveReportToCSV(analytics)
      toast.success('Exported executive analytics report to CSV!')
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-600 rounded-2xl shadow-lg shadow-orange-600/30">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-stone-800/80 px-2.5 py-0.5 rounded-full text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Module 9 Active • Executive Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Reports & Analytics Intelligence</h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Real-time revenue growth, occupancy distribution, ADR, RevPAR, and gateway share insights.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500"
          >
            <option value="this-month">This Month (Sep 2026)</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year (2026)</option>
          </select>

          <button
            onClick={() => loadData(timeRange)}
            title="Refresh Analytics"
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-colors border border-stone-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleExport}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {loading || !analytics ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3 shadow-2xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
          <p className="text-xs font-medium text-stone-500">Generating executive analytics insights...</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Gross Revenue */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  +14.2% Growth
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Gross Revenue</span>
                <span className="text-2xl font-extrabold text-stone-900">${analytics.totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* KPI 2: ADR */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  Per Night
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Average Daily Rate (ADR)</span>
                <span className="text-2xl font-extrabold text-stone-900">${analytics.adr}</span>
              </div>
            </div>

            {/* KPI 3: RevPAR */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BedDouble className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Per Avail. Room
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">RevPAR</span>
                <span className="text-2xl font-extrabold text-stone-900">${analytics.revPar}</span>
              </div>
            </div>

            {/* KPI 4: Occupancy Rate */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <PieChartIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  {analytics.occupiedRoomsCount} / {analytics.totalRoomsCount} Rooms
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Occupancy Rate</span>
                <span className="text-2xl font-extrabold text-stone-900">{analytics.occupancyRate}%</span>
              </div>
            </div>

          </div>

          {/* 4-Chart Interactive Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CHART 1: Monthly Revenue Curve Trend (SVG Curve) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-stone-900">12-Month Revenue Growth Curve</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Target Exceeded
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-4">Monthly gross revenue vs target projections ($k)</p>
              </div>

              <div className="h-48 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGradReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="320" y2="30" stroke="#f5f5f4" strokeWidth="1" />
                  <line x1="0" y1="70" x2="320" y2="70" stroke="#f5f5f4" strokeWidth="1" />
                  <line x1="0" y1="110" x2="320" y2="110" stroke="#f5f5f4" strokeWidth="1" />

                  {/* Area fill */}
                  <path
                    d="M 0,110 L 0,85 Q 80,45 160,55 T 320,15 L 320,110 Z"
                    fill="url(#revenueGradReports)"
                  />
                  {/* Curve line */}
                  <path
                    d="M 0,85 Q 80,45 160,55 T 320,15"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Target line */}
                  <path
                    d="M 0,90 Q 80,55 160,65 T 320,25"
                    fill="none"
                    stroke="#d6d3d1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="160" cy="55" r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="320" cy="15" r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                </svg>

                <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-2">
                  {analytics.monthlyRevenueCurve.map((m) => (
                    <span key={m.month}>{m.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* CHART 2: Room Type Revenue & Occupancy Share (SVG Donut) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                      <PieChartIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-stone-900">Room Type Revenue Share</h3>
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    4 Categories
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-2">Revenue contribution by room category</p>
              </div>

              <div className="flex items-center justify-center my-3 relative">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-600"
                    strokeDasharray="40, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-40"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-70"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray="10, 100"
                    strokeDashoffset="-90"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-stone-900">${analytics.totalRevenue.toLocaleString()}</span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Total Revenue</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-stone-600 pt-1">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-600 flex-shrink-0" />
                  <span className="truncate">Deluxe Suite (40%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="truncate">Exec Room (30%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="truncate">Standard Room (20%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="truncate">Presidential (10%)</span>
                </div>
              </div>
            </div>

            {/* CHART 3: Payment Method Distribution (Progress Bars) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-stone-900">Payment Gateway Distribution</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  5 Gateways
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {analytics.paymentMethodBreakdown.map((pm) => (
                  <div key={pm.method} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800">{pm.method}</span>
                      <span className="text-stone-500 font-semibold">${pm.amount.toLocaleString()} ({pm.sharePct}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pm.sharePct, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHART 4: Arrival vs Departure Trend (Dual Bar Chart) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-stone-900">Check-Ins vs Check-Outs Trend</h3>
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-bold">
                  <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-orange-600 mr-1" /> Check-Ins</span>
                  <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-stone-400 mr-1" /> Check-Outs</span>
                </div>
              </div>

              <div className="h-44 flex items-end justify-between space-x-2 pt-4">
                {analytics.monthlyRevenueCurve.slice(6).map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center space-x-1 h-32">
                      <div
                        className="bg-orange-600 rounded-t-md w-3 transition-all"
                        style={{ height: `${(m.checkIns / 120) * 100}%` }}
                        title={`Check-Ins: ${m.checkIns}`}
                      />
                      <div
                        className="bg-stone-300 rounded-t-md w-3 transition-all"
                        style={{ height: `${(m.checkOuts / 120) * 100}%` }}
                        title={`Check-Outs: ${m.checkOuts}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Executive Summary Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">Room Category Financial Breakdown</h3>
                <p className="text-xs text-stone-500">Itemized revenue & ADR matrix per room type</p>
              </div>
              <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl">
                Comprehensive Audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Room Category</th>
                    <th className="py-3.5 px-6">Reservations Sold</th>
                    <th className="py-3.5 px-6">Nights Billed</th>
                    <th className="py-3.5 px-6">Avg Daily Rate (ADR)</th>
                    <th className="py-3.5 px-6">Total Revenue</th>
                    <th className="py-3.5 px-6">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium">
                  {analytics.roomTypeBreakdown.map((r) => (
                    <tr key={r.roomType} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-stone-900">{r.roomType}</td>
                      <td className="py-4 px-6 text-stone-700">{r.unitsSold} Bookings</td>
                      <td className="py-4 px-6 text-stone-700">{r.nightsSold} Nights</td>
                      <td className="py-4 px-6 font-bold text-stone-900">${r.avgRate} / night</td>
                      <td className="py-4 px-6 font-extrabold text-orange-600">${r.revenue.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-stone-100 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${r.revenueSharePct}%` }}
                            />
                          </div>
                          <span className="font-bold text-stone-800 text-[11px]">{r.revenueSharePct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Reports
