import React from 'react'
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react'

const DashboardCharts = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Key Performance Charts
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Visual analytics overview of monthly revenue growth and room occupancy
          </p>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-xl border border-orange-200">
          2 Core Charts
        </span>
      </div>

      {/* Clean 2-Chart Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* CHART 1: Monthly Revenue Growth (Smooth Area Curve) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-800">Monthly Revenue Trend</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +14.2% Growth
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mb-3">6-month revenue trajectory ($k)</p>
          </div>

          <div className="h-44 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orangeGradLine2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="300" y2="30" stroke="#f5f5f4" strokeWidth="1" />
              <line x1="0" y1="70" x2="300" y2="70" stroke="#f5f5f4" strokeWidth="1" />
              <line x1="0" y1="110" x2="300" y2="110" stroke="#f5f5f4" strokeWidth="1" />

              <path
                d="M 0,110 L 0,80 Q 60,40 120,65 T 240,30 L 300,15 L 300,110 Z"
                fill="url(#orangeGradLine2)"
              />
              <path
                d="M 0,80 Q 60,40 120,65 T 240,30 L 300,15"
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="120" cy="65" r="4" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
              <circle cx="300" cy="15" r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-2">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* CHART 2: Room Occupancy Rate (Donut Chart) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <PieChartIcon className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-800">Room Occupancy Share</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                48 Total Rooms
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mb-2">Live occupancy status breakdown</p>
          </div>

          <div className="flex items-center justify-center my-2 relative">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-600"
                strokeDasharray="62.5, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="37.5, 100"
                strokeDashoffset="-62.5"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-stone-900">62.5%</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase">Occupied</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[11px] font-semibold text-stone-600 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
              <span>Occupied (30)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Available (18)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardCharts
