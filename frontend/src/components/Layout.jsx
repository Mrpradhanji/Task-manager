import { useState, useEffect, useCallback, useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Circle, TrendingUp, Zap, Clock } from "lucide-react"
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

  useEffect(() => { fetchTasks() }, [fetchTasks])

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

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    }
  }, [tasks])

  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#00FFFF]/10 hover:border-[#00FFFF]/20 transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF]">
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFFF]"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 flex items-center justify-center">
      <div className="bg-[#0A0A0A]/80 backdrop-blur-sm text-red-400 p-4 rounded-xl border border-red-500/20 max-w-md">
        <p className="font-medium mb-2">Error loading tasks</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-4 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks}/>

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg shadow-[#00FFFF]/5 border border-[#00FFFF]/10">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FFFF]" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard 
                  title="Total Tasks" 
                  value={stats.totalCount} 
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00FFFF]" />} 
                />
                <StatCard 
                  title="Completed" 
                  value={stats.completedTasks} 
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />} 
                />
                <StatCard 
                  title="Pending" 
                  value={stats.pendingCount} 
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00FFFF]" />} 
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00FFFF]" />}
                />
              </div>

              <hr className="my-3 sm:my-4 border-[#00FFFF]/10" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00FFFF] fill-[#00FFFF]" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-[#00FFFF]/10 text-[#00FFFF] px-1.5 py-0.5 sm:px-2 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-2 sm:h-3 bg-[#00FFFF]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00FFFF] transition-all duration-500"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg shadow-[#00FFFF]/5 border border-[#00FFFF]/10">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FFFF]" />
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-[#00FFFF]/5 rounded-lg transition-colors duration-200 border border-transparent hover:border-[#00FFFF]/10"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 break-words whitespace-normal">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                      task.completed 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20'
                    }`}>
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-4 sm:py-6 px-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#00FFFF]/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#00FFFF]" />
                    </div>
                    <p className="text-sm text-gray-400">No recent activity</p>
                    <p className="text-xs text-gray-500 mt-1">Tasks will appear here</p>
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