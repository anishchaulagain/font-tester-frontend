import { useTheme } from "@/context/ThemeContext"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts"
import { useState, useMemo } from "react"
import { Calendar, TrendingUp, BarChart3, LineChart as LineChartIcon } from "lucide-react"

type Font = {
  id: number
  name: string
  createdAt: string // ISO string
}

type Props = {
  fonts: Font[]
}

export default function FontAddedChart({ fonts }: Props) {
  const { theme } = useTheme()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')
  
  // Filter fonts based on time range
  const filteredFonts = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return fonts.filter(font => new Date(font.createdAt) >= cutoffDate)
  }, [fonts, timeRange])

  // Group fonts by date
  const chartData = useMemo(() => {
    const dateCountMap: Record<string, number> = {}
    
    filteredFonts.forEach((font) => {
      const date = new Date(font.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(timeRange === '90d' && { year: 'numeric' })
      })
      dateCountMap[date] = (dateCountMap[date] || 0) + 1
    })

    const data = Object.entries(dateCountMap).map(([date, count]) => ({
      date,
      count,
      displayDate: date
    }))

    // Sort chronologically
    data.sort((a, b) => {
      const dateA = new Date(a.date + (timeRange === '90d' ? '' : `, ${new Date().getFullYear()}`))
      const dateB = new Date(b.date + (timeRange === '90d' ? '' : `, ${new Date().getFullYear()}`))
      return dateA.getTime() - dateB.getTime()
    })

    return data
  }, [filteredFonts, timeRange])

  // Calculate stats
  const stats = useMemo(() => {
    const totalFonts = filteredFonts.length
    const totalDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const avgDaily = totalFonts / totalDays
    const todayCount = chartData[chartData.length - 1]?.count || 0
    
    return {
      total: totalFonts,
      avgDaily: Math.round(avgDaily * 10) / 10,
      today: todayCount,
      peak: Math.max(...chartData.map(d => d.count), 0)
    }
  }, [filteredFonts, chartData, timeRange])

  const isDark = theme === "dark"

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`font-medium mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {label}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <span style={{ color: payload[0].color }}>●</span> 
            {` ${payload[0].value} font${payload[0].value !== 1 ? 's' : ''} added`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      
      {/* Chart */}
      <div className="p-6 rounded-2xl border shadow-sm bg-background">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">Fonts Added Over Time</h3>
          
          <div className="flex items-center gap-3">
            {/* Chart Type Toggle */}
            <div className="flex items-center rounded-lg border bg-background p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartType === 'bar'
                    ? `${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartType === 'line'
                    ? `${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Line
              </button>
            </div>

            {/* Time Range Selector */}
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className={`px-3 py-1 text-xs font-medium rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 ${
                isDark ? 'focus:ring-blue-400' : 'focus:ring-blue-500'
              }`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                stroke={isDark ? "#374151" : "#E5E7EB"} 
                strokeDasharray="3 3" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? "#9CA3AF" : "#6B7280"} 
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke={isDark ? "#9CA3AF" : "#6B7280"} 
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill={isDark ? "#3B82F6" : "#2563EB"} 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                stroke={isDark ? "#374151" : "#E5E7EB"} 
                strokeDasharray="3 3" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? "#9CA3AF" : "#6B7280"} 
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke={isDark ? "#9CA3AF" : "#6B7280"} 
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={isDark ? "#3B82F6" : "#2563EB"} 
                strokeWidth={3}
                dot={{ fill: isDark ? "#3B82F6" : "#2563EB", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: isDark ? "#3B82F6" : "#2563EB", strokeWidth: 2, fill: isDark ? "#1F2937" : "#FFFFFF" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}