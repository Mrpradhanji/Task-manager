import { useState, useMemo, useCallback, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { CheckCircle2, Filter } from "lucide-react"
import TaskItem from "../components/TaskItem"
import TaskModal from "../components/AddTask"
import { SORT_OPTIONS, CT_CLASSES } from "../assets/dummy"

const CompletedTasks = () => {
  const { tasks = [] } = useOutletContext()
  const [localTasks, setLocalTasks] = useState(tasks)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Update local tasks when tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  // Handle task updates
  const handleTaskUpdate = useCallback((updatedTask) => {
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    )
  }, [])

  const sortedCompletedTasks = useMemo(() => {
    return localTasks
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
  }, [localTasks, sortBy])

  const handleEdit = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-[#1e293b] flex items-center gap-2">
            <CheckCircle2 className="text-[#3b82f6] w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className="text-sm text-[#64748b] mt-1 ml-7">
            {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && "s"} marked as complete
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-[#1e293b] font-medium">
            <Filter className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm">Sort by:</span>
          </div>

          {/* Mobile Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-[#1e293b] md:hidden text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label} {opt.id === 'newest' ? 'First' : ''}</option>
            ))}
          </select>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-1 bg-[#3b82f6]/5 p-1 rounded-lg">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === opt.id 
                    ? "bg-[#3b82f6] text-white shadow-sm" 
                    : "text-[#64748b] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10"
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
          <div className="p-6 bg-white rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">No completed tasks yet!</h3>
            <p className="text-sm text-[#64748b] mb-4">Complete some tasks and they'll appear here</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onEdit={handleEdit}
              showCompleteCheckbox={false}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); }}
        taskToEdit={selectedTask}
        onSave={handleTaskUpdate}
      />
    </div>
  )
}

export default CompletedTasks;