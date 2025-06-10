import { useState, useEffect, useCallback, useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Circle, TrendingUp, Zap, Clock, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Analytics from "./Analytics"
import axios from "axios"

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnalytics, setShowAnalytics] = useState(true)

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
    
    // Optimistically update the task
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
        return response; // Return the response for the caller to use
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
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.delete(
        `http://localhost:4000/api/tasks/${taskId}/gp`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      if (err.response?.status === 401) onLogout();
      throw err;
    }
  }, [onLogout]);

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

    // Sort tasks by creation date for recent activity
    const recentTasks = [...tasks].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
      totalTrend,
      completedTrend,
      pendingTrend,
      completionTrend,
      recentTasks
    }
  }, [tasks])

  const contextValue = useMemo(() => ({
    tasks,
    refreshTasks: fetchTasks,
    updateTask,
    deleteTask,
    user
  }), [tasks, fetchTasks, updateTask, deleteTask, user]);

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
      <Sidebar user={user} tasks={tasks} />
      <div className="md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2 space-y-3 sm:space-y-4">
              <Outlet context={contextValue} />
            </div>

            {/* Analytics Toggle Button */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="fixed left-4 bottom-20 z-40 p-3 bg-[#3b82f6] text-white rounded-full shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30 transition-all duration-300 md:hidden"
            >
              <BarChart2 className="w-5 h-5" />
            </button>

            {/* Analytics Panel */}
            <div className={`xl:col-span-1 space-y-4 sm:space-y-6 transition-all duration-300 ${
              showAnalytics ? 'block' : 'hidden'
            }`}>
              <Analytics stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout