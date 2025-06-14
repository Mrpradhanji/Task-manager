import { Circle, TrendingUp, Zap, Clock, CheckCircle2, AlertCircle, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Analytics = ({ stats }) => {
  const data = [
    { name: 'Completed', value: stats.completedTasks, color: '#22c55e' },
    { name: 'Pending', value: stats.pendingCount, color: '#3b82f6' },
    { name: 'Overdue', value: stats.overdueCount || 0, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b82f6]" />
          Task Analytics
        </h3>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#3b82f6]/5 to-[#3b82f6]/10 border border-[#3b82f6]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#3b82f6]/10">
                <Circle className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <span className="text-sm font-medium text-[#64748b]">Total Tasks</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1e293b]">{stats.totalCount}</span>
              {stats.totalTrend !== 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stats.totalTrend > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stats.totalTrend > 0 ? '↑' : '↓'} {Math.abs(stats.totalTrend)}%
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#22c55e]/5 to-[#22c55e]/10 border border-[#22c55e]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#22c55e]/10">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              </div>
              <span className="text-sm font-medium text-[#64748b]">Completed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1e293b]">{stats.completedTasks}</span>
              {stats.completedTrend !== 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stats.completedTrend > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stats.completedTrend > 0 ? '↑' : '↓'} {Math.abs(stats.completedTrend)}%
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#f59e0b]/5 to-[#f59e0b]/10 border border-[#f59e0b]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#f59e0b]/10">
                <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <span className="text-sm font-medium text-[#64748b]">Pending</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1e293b]">{stats.pendingCount}</span>
              {stats.pendingTrend !== 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stats.pendingTrend > 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {stats.pendingTrend > 0 ? '↑' : '↓'} {Math.abs(stats.pendingTrend)}%
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#8b5cf6]/5 to-[#8b5cf6]/10 border border-[#8b5cf6]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#8b5cf6]/10">
                <Zap className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <span className="text-sm font-medium text-[#64748b]">Completion Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1e293b]">{stats.completionPercentage}%</span>
              {stats.completionTrend !== 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stats.completionTrend > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stats.completionTrend > 0 ? '↑' : '↓'} {Math.abs(stats.completionTrend)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-sm font-medium text-[#1e293b]">Task Progress</span>
            </div>
            <div className="relative">
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 rounded-full blur-sm" />
              <div className="relative bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                    {stats.completionPercentage}
                  </span>
                  <span className="text-sm font-medium text-gray-500">%</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">Completion</div>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 shadow-sm border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="text-[#64748b]">Completed</span>
              <span className="font-medium text-[#1e293b]">{stats.completedTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
              <span className="text-[#64748b]">Pending</span>
              <span className="font-medium text-[#1e293b]">{stats.pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-[#64748b]">Overdue</span>
              <span className="font-medium text-[#1e293b]">{stats.overdueCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b82f6]" />
          Recent Activity
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {stats.recentTasks?.slice(0, 3).map((task) => (
            <div
              key={task._id || task.id}
              className="flex items-center justify-between p-2 sm:p-3 hover:bg-[#3b82f6]/5 rounded-lg transition-colors duration-200 border border-transparent hover:border-[#3b82f6]/20"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1e293b] break-words whitespace-normal">
                  {task.title}
                </p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No date"}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                task.completed 
                  ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20' 
                  : 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
              }`}>
                {task.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}
          {(!stats.recentTasks || stats.recentTasks.length === 0) && (
            <div className="text-center py-4 sm:py-6 px-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#3b82f6]" />
              </div>
              <p className="text-sm text-[#64748b]">No recent activity</p>
              <p className="text-xs text-[#64748b] mt-1">Tasks will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 