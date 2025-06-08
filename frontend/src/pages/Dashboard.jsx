import { useState, useMemo, useCallback } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, Filter, Home as HomeIcon, Calendar as CalendarIcon, Flame } from "lucide-react"
import TaskModal from "../components/AddTask"
import TaskItem from "../components/TaskItem"
import axios from "axios"

import {
  WRAPPER, HEADER, ADD_BUTTON, STATS_GRID, STAT_CARD, ICON_WRAPPER, VALUE_CLASS, LABEL_CLASS,
  STATS, FILTER_OPTIONS, FILTER_LABELS, EMPTY_STATE, FILTER_WRAPPER, SELECT_CLASSES,
  TABS_WRAPPER, TAB_BASE, TAB_ACTIVE, TAB_INACTIVE
} from '../assets/dummy'

// API Base
const API_BASE = "http://localhost:4000/api/tasks"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Calculate stats
  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === "low").length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === "medium").length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === "high").length,
    completed: tasks.filter(t =>
      t.completed === true || t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length,
  }), [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)
    switch (filter) {
      case "today":
        return dueDate.toDateString() === today.toDateString()
      case "week":
        return dueDate >= today && dueDate <= nextWeek
      case "high":
      case "medium":
      case "low":
        return task.priority?.toLowerCase() === filter
      default:
        return true
    }
  }), [tasks, filter])

  // Save tasks
  const handleTaskSave = useCallback(async (taskData) => {
    try {
      if (taskData.id) await axios.put(`${API_BASE}/${taskData.id}/gp`, taskData)
      refreshTasks()
      setShowModal(false)
      setSelectedTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }, [refreshTasks])

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2">
            <HomeIcon className="text-[#00FFFF] w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 ml-7 truncate">Manage your tasks efficiently</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-[#00FFFF]/10 text-[#00FFFF] px-4 py-2 rounded-lg border border-[#00FFFF]/20 hover:bg-[#00FFFF]/20 transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base shadow-lg shadow-[#00FFFF]/5"
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = "border-[#00FFFF]/10", valueKey, textColor, gradient }) => (
          <div key={key} className={`p-3 md:p-4 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-sm border ${borderColor} hover:border-[#00FFFF]/20 transition-all duration-300 min-w-0 shadow-lg shadow-[#00FFFF]/5`}>
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`p-1.5 md:p-2 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF]`}><Icon className="w-4 h-4 md:w-5 md:h-5" /></div>
              <div className="min-w-0">
                <p className={`text-lg md:text-2xl font-bold truncate ${gradient ? "text-[#00FFFF]" : "text-white"}`}>{stats[valueKey]}</p>
                <p className="text-xs text-gray-400 truncate">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-sm p-4 rounded-xl border border-[#00FFFF]/10 shadow-lg shadow-[#00FFFF]/5">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-[#00FFFF] shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-white truncate">{FILTER_LABELS[filter]}</h2>
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="px-3 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-white md:hidden text-sm"
          >
            {FILTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
          <div className="hidden md:flex space-x-1 bg-[#00FFFF]/5 p-1 rounded-lg">
            {FILTER_OPTIONS.map(opt => (
              <button 
                key={opt} 
                onClick={() => setFilter(opt)} 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === opt 
                    ? "bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20 shadow-lg shadow-[#00FFFF]/5" 
                    : "text-gray-400 hover:text-[#00FFFF] hover:bg-[#00FFFF]/5"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-6 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl border border-[#00FFFF]/10 text-center shadow-lg shadow-[#00FFFF]/5">
              <div className="w-16 h-16 bg-[#00FFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-[#00FFFF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-sm text-gray-400 mb-4">{filter === "all" ? "Create your first task to get started" : "No tasks match this filter"}</p>
              <button 
                onClick={() => setShowModal(true)} 
                className="px-4 py-2 bg-[#00FFFF]/10 text-[#00FFFF] rounded-lg text-sm font-medium border border-[#00FFFF]/20 hover:bg-[#00FFFF]/20 transition-all shadow-lg shadow-[#00FFFF]/5"
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => { setSelectedTask(task); setShowModal(true); }}
              />
            ))
          )}
        </div>

        {/* Add Task (Desktop) */}
        <div 
          onClick={() => setShowModal(true)} 
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-[#00FFFF]/20 rounded-xl hover:border-[#00FFFF]/40 bg-[#00FFFF]/5 cursor-pointer transition-colors shadow-lg shadow-[#00FFFF]/5"
        >
          <Plus className="w-5 h-5 text-[#00FFFF] mr-2" />
          <span className="text-[#00FFFF] font-medium">Add New Task</span>
        </div>
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => { setShowModal(false); setSelectedTask(null); }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default Dashboard
