import { useState, useEffect } from "react"
import axios from "axios"
import { format, isToday } from "date-fns"
import TaskModal from "./AddTask"
import { getPriorityColor, getPriorityBadgeColor, TI_CLASSES, MENU_OPTIONS, } from "../assets/dummy"
import { CheckCircle2, MoreVertical, Clock, Calendar } from "lucide-react"

const API_BASE = "http://localhost:4000/api/tasks"

const TaskItem = ({ task, onRefresh, onLogout, showCompleteCheckbox = true }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    )
  )
  const [showEditModal, setShowEditModal] = useState(false)
  const [subtasks, setSubtasks] = useState(task.subtasks || [])

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
      )
    )
  }, [task.completed])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")
    return { Authorization: `Bearer ${token}` }
  }

  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task.priority).split(" ")[0]

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes"
    try {
      await axios.put(`${API_BASE}/${task._id}/gp`, { completed: newStatus }, { headers: getAuthHeaders() })
      setIsCompleted(!isCompleted)
      onRefresh?.()
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleAction = (action) => {
    setShowMenu(false)
    if (action === 'edit') setShowEditModal(true)
    if (action === 'delete') handleDelete()
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${task._id}/gp`, { headers: getAuthHeaders() })
      onRefresh?.()
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({ title, description, priority, dueDate, completed }) =>
        ({ title, description, priority, dueDate, completed }))(updatedTask)
      await axios.put(`${API_BASE}/${task._id}/gp`, payload, { headers: getAuthHeaders() })
      setShowEditModal(false)
      onRefresh?.()
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const progress = subtasks.length
    ? (subtasks.filter(st => st.completed).length / subtasks.length) * 100
    : 0

  return (
    <>
      <div className={`group p-4 sm:p-5 rounded-xl shadow-sm bg-[#0A0A0A]/80 backdrop-blur-sm border-l-4 hover:shadow-lg hover:shadow-[#00FFFF]/5 transition-all duration-300 border border-[#00FFFF]/10 ${borderColor}`}>        
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-[#00FFFF]/10 transition-colors duration-300 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}
            >
              <CheckCircle2
                size={18}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? 'fill-green-500' : ''}`}
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3 className={`text-base sm:text-lg font-medium truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                {task.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
            </div>
            {task.description && <p className="text-sm text-gray-400 mt-1 truncate">{task.description}</p>}
            {subtasks.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-[#00FFFF]/5 p-2 sm:p-3 rounded-lg border border-[#00FFFF]/10">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>Subtasks Progress</span><span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-[#00FFFF]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FFFF] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-1 sm:space-y-2 pt-1">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 group/subtask">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => setSubtasks(prev => prev.map((s, idx) => idx === i ? {...s, completed: !s.completed} : s))}
                        className="w-4 h-4 text-[#00FFFF] rounded border-[#00FFFF]/20 focus:ring-[#00FFFF] bg-[#0A0A0A]"
                      />
                      <span className={`text-sm truncate ${st.completed ? 'text-gray-500 line-through' : 'text-gray-300 group-hover/subtask:text-[#00FFFF]'} transition-colors duration-200`}>{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <div className="relative">
            <button onClick={()=>setShowMenu(!showMenu)} className="p-1 sm:p-1.5 hover:bg-[#00FFFF]/10 rounded-lg text-gray-400 hover:text-[#00FFFF] transition-colors duration-200">
              <MoreVertical size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 sm:w-48 bg-[#0A0A0A] border border-[#00FFFF]/10 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                {MENU_OPTIONS.map(opt => (
                  <button
                    key={opt.action}
                    onClick={()=>handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-[#00FFFF]/5 flex items-center gap-2 transition-colors duration-200 text-gray-300 hover:text-[#00FFFF]"
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${task.dueDate && isToday(new Date(task.dueDate)) ? 'text-[#00FFFF]' : 'text-gray-400'}`}>              
              <Calendar className="w-3.5 h-3.5" />
              {task.dueDate ? (isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM dd')) : '—'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'No date'}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showEditModal}
        onClose={()=>setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  )
}

export default TaskItem;