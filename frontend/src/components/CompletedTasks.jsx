import { useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { CheckCircle2, Filter } from "lucide-react"
import TaskItem from "../components/TaskItem"
import { SORT_OPTIONS, CT_CLASSES } from "../assets/dummy"

const CompletedTasks = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState("newest")

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task => [true, 1, "yes"].includes(
        typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
      ))
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 }
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()]
          }
          default:
            return 0
        }
      })
  }, [tasks, sortBy])

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="text-[#00FFFF] w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 ml-7">
            {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && "s"} marked as complete
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 bg-[#0A0A0A]/80 backdrop-blur-sm p-3 rounded-xl border border-[#00FFFF]/10 shadow-lg shadow-[#00FFFF]/5">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <Filter className="w-4 h-4 text-[#00FFFF]" />
            <span className="text-sm">Sort by:</span>
          </div>

          {/* Mobile Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-white md:hidden text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label} {opt.id === 'newest' ? 'First' : ''}</option>
            ))}
          </select>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-1 bg-[#00FFFF]/5 p-1 rounded-lg">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === opt.id 
                    ? "bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5" 
                    : "text-gray-400 hover:text-[#00FFFF] hover:bg-[#00FFFF]/5"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedCompletedTasks.length === 0 ? (
          <div className="p-6 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl border border-[#00FFFF]/10 text-center shadow-lg shadow-[#00FFFF]/5">
            <div className="w-16 h-16 bg-[#00FFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#00FFFF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No completed tasks yet!</h3>
            <p className="text-sm text-gray-400 mb-4">Complete some tasks and they'll appear here</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletedTasks;