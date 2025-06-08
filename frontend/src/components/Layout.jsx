import { useState, useEffect, useCallback, useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Circle, TrendingUp, Zap, Clock, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import axios from "axios"

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No auth token found")

      const { data } = await axios.get("http://localhost:4000/api/tasks/gp", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const arr = Array.isArray(data) ? data : 
        Array.isArray(data?.tasks) ? data.tasks :
        Array.isArray(data?.data) ? data.data : []

      setTasks(arr)
    } catch (err) {
      console.error(err)
      setError(err.message || "Could not load tasks.")
      if (err.response?.status === 401) onLogout()
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  // Initial fetch
  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Optimistic task update function
  const updateTask = useCallback(async (taskId, updates) => {
    // Store the previous state for rollback
    const previousTasks = tasks;
    
    // Optimistically update the tasks
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId ? { ...task, ...updates } : task
      )
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.put(
        `http://localhost:4000/api/tasks/${taskId}/gp`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update with the server response
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? response.data.task : task
          )
        );
      } else {
        // Revert on failure
        setTasks(previousTasks);
        throw new Error("Failed to update task");
      }
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      console.error("Error updating task:", err);
      if (err.response?.status === 401) onLogout();
      throw err;
    }
  }, [tasks, onLogout]);

  // Add deleteTask function
  const deleteTask = useCallback(async (taskId) => {
    // Store the previous state for rollback
    const previousTasks = tasks;
    
    // Optimistically remove the task
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.delete(
        `http://localhost:4000/api/tasks/${taskId}/gp`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        // Revert on failure
        setTasks(previousTasks);
        throw new Error("Failed to delete task");
      }
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      console.error("Error deleting task:", err);
      if (err.response?.status === 401) onLogout();
      throw err;
    }
  }, [tasks, onLogout]);

  // Update context value to include deleteTask
  const contextValue = useMemo(() => ({
    tasks,
    refreshTasks: fetchTasks,
    updateTask,
    deleteTask
  }), [tasks, fetchTasks, updateTask, deleteTask]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => 
      t.completed === true ||
      t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length

    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completionPercentage = totalCount ? 
      Math.round((completedTasks / totalCount) * 100) : 0

    // Calculate trends based on task data
    const calculateTrend = (current, previous) => {
      if (!previous) return 0;
      const change = ((current - previous) / previous) * 100;
      return Math.round(change);
    };

    // For now, we'll use the current values as both current and previous
    // In a real app, you would store historical data to calculate actual trends
    const totalTrend = totalCount > 0 ? 0 : 0;
    const completedTrend = completedTasks > 0 ? 0 : 0;
    const pendingTrend = pendingCount > 0 ? 0 : 0;
    const completionTrend = completionPercentage > 0 ? 0 : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
      totalTrend,
      completedTrend,
      pendingTrend,
      completionTrend
    }
  }, [tasks])

  const StatCard = ({ title, value, icon, color = "blue", trend = null }) => (
    <div className="p-3 rounded-xl bg-white border border-gray-100 hover:border-[#3b82f6]/20 transition-all shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[#1e293b] truncate">{value}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-[#64748b] truncate">{title}</p>
            {trend && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                trend > 0 
                  ? 'bg-green-100 text-green-700' 
                  : trend < 0 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const CompletionChart = ({ completed, total }) => {
    const percentage = total ? Math.round((completed / total) * 100) : 0
    const segments = [
      { label: 'Completed', value: completed, color: 'bg-[#22c55e]' },
      { label: 'Pending', value: total - completed, color: 'bg-[#3b82f6]' }
    ]

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm font-medium text-[#1e293b]">Task Progress</span>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
            {percentage}%
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          {segments.map((segment, index) => (
            <div
              key={segment.label}
              className={`h-full ${segment.color} transition-all duration-500`}
              style={{ 
                width: `${(segment.value / total) * 100}%`,
                marginLeft: index === 0 ? '0' : '-2px'
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          {segments.map(segment => (
            <div key={segment.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${segment.color}`} />
              <span className="text-[#64748b]">{segment.label}</span>
              <span className="font-medium text-[#1e293b]">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
      <div className="bg-white text-[#ef4444] p-4 rounded-xl border border-[#ef4444]/20 max-w-md shadow-sm">
        <p className="font-medium mb-2">Error loading tasks</p>
        <p className="text-sm text-[#64748b]">{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-4 px-4 py-2 bg-[#ef4444]/10 text-[#ef4444] rounded-lg text-sm font-medium hover:bg-[#ef4444]/20 transition-colors border border-[#ef4444]/20"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks}/>

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={contextValue} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b82f6]" />
                Task Analytics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <StatCard 
                  title="Total Tasks" 
                  value={stats.totalCount} 
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  color="blue"
                  trend={stats.totalTrend}
                />
                <StatCard 
                  title="Completed" 
                  value={stats.completedTasks} 
                  icon={<CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  color="green"
                  trend={stats.completedTrend}
                />
                <StatCard 
                  title="Pending" 
                  value={stats.pendingCount} 
                  icon={<AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  color="blue"
                  trend={stats.pendingTrend}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  color="blue"
                  trend={stats.completionTrend}
                />
              </div>

              <hr className="my-4 border-gray-100" />

              <CompletionChart completed={stats.completedTasks} total={stats.totalCount} />
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b82f6]" />
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
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
                {tasks.length === 0 && (
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
        </div>
      </div>
    </div>
  )
}

export default Layout