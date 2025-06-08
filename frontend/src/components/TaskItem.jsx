import { useState, useEffect, useRef } from "react"
import { useOutletContext } from "react-router-dom"
import { format, isToday } from "date-fns"
import TaskModal from "./AddTask"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { 
  getPriorityColor, 
  getPriorityBadgeColor, 
  TI_CLASSES, 
  MENU_OPTIONS,
  TASK_STATUS,
  PRIORITY_TAGS
} from "../assets/dummy"
import { CheckCircle2, MoreVertical, Clock, Calendar, ChevronDown } from "lucide-react"

const TaskItem = ({ task, onLogout, showCompleteCheckbox = true }) => {
  const { updateTask, deleteTask } = useOutletContext();
  const [showMenu, setShowMenu] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const statusDropdownRef = useRef(null)
  const priorityDropdownRef = useRef(null)
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    )
  )
  const [taskStatus, setTaskStatus] = useState(task.status || 'PENDING')
  const [taskPriority, setTaskPriority] = useState(task.priority?.toUpperCase() || 'MEDIUM')
  const [showEditModal, setShowEditModal] = useState(false)
  const [subtasks, setSubtasks] = useState(task.subtasks || [])

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
      )
    )
    setTaskStatus(task.status || 'PENDING')
    setTaskPriority(task.priority?.toUpperCase() || 'MEDIUM')
  }, [task.completed, task.status, task.priority])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && 
          menuRef.current && 
          !menuRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowMenu(false)
      }
      if (showStatusDropdown && 
          statusDropdownRef.current && 
          !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false)
      }
      if (showPriorityDropdown && 
          priorityDropdownRef.current && 
          !priorityDropdownRef.current.contains(event.target)) {
        setShowPriorityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu, showStatusDropdown, showPriorityDropdown])

  const handleAction = async (action) => {
    setShowMenu(false)
    switch (action) {
      case "edit":
        setShowEditModal(true)
        break
      case "delete":
        setShowDeleteModal(true)
        break
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus })
      setTaskStatus(newStatus)
      setShowStatusDropdown(false)
    } catch (err) {
      console.error('Error updating status:', err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handlePriorityChange = async (newPriority) => {
    try {
      const formattedPriority = newPriority.charAt(0).toUpperCase() + newPriority.slice(1).toLowerCase()
      await updateTask(task._id, { priority: formattedPriority })
      setTaskPriority(formattedPriority.toUpperCase())
      setShowPriorityDropdown(false)
    } catch (err) {
      console.error('Error updating priority:', err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleComplete = async () => {
    try {
      const newCompleted = !isCompleted
      await updateTask(task._id, { completed: newCompleted ? "Yes" : "No" })
      setIsCompleted(newCompleted)
    } catch (err) {
      console.error('Error updating completion:', err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({ title, description, priority, dueDate, completed, status }) =>
        ({ title, description, priority, dueDate, completed, status }))(updatedTask)
      const response = await updateTask(task._id, payload)
      if (response?.data?.task) {
        // Update local task state with the response data
        setTask(response.data.task)
        setTaskStatus(response.data.task.status)
        setTaskPriority(response.data.task.priority)
        setIsCompleted(response.data.task.completed === "Yes")
        // Notify parent component about the update
        onTaskUpdate?.(response.data.task)
      }
      setShowEditModal(false)
    } catch (err) {
      console.error('Error saving task:', err)
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task._id)
      setShowDeleteModal(false)
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
      <div className={`group p-4 sm:p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:border-[#3b82f6]/20 transition-all duration-300`}>        
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-[#3b82f6]/10 transition-colors duration-300 ${isCompleted ? 'text-[#22c55e]' : 'text-[#64748b]'}`}
            >
              <CheckCircle2
                size={18}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? 'fill-[#22c55e]' : ''}`}
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3 className={`text-base sm:text-lg font-medium truncate ${isCompleted ? 'text-[#64748b] line-through' : 'text-[#1e293b]'}`}>
                {task.title}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {/* Priority Dropdown */}
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowPriorityDropdown(prev => !prev)
                    }}
                    className={`text-xs px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${PRIORITY_TAGS[taskPriority]?.color || PRIORITY_TAGS.MEDIUM.color}`}
                    title="Change priority"
                  >
                    {PRIORITY_TAGS[taskPriority]?.label || 'Medium Priority'}
                    <ChevronDown size={12} className={`opacity-70 transition-transform duration-200 ${showPriorityDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showPriorityDropdown && (
                    <div 
                      className="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(PRIORITY_TAGS).map(([key, { label, color }]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handlePriorityChange(key)
                          }}
                          className={`w-full px-3 py-2 text-left text-xs hover:bg-[#3b82f6]/5 flex items-center gap-2 transition-colors duration-200 ${color} ${taskPriority === key ? 'bg-[#3b82f6]/5' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full ${color.split(' ')[0]}`} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowStatusDropdown(!showStatusDropdown)
                    }}
                    className={`text-xs px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${TASK_STATUS[taskStatus]?.color || TASK_STATUS.PENDING.color}`}
                    title="Change status"
                  >
                    {TASK_STATUS[taskStatus]?.label || 'Pending'}
                    <ChevronDown size={12} className="opacity-70" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                      {Object.entries(TASK_STATUS).map(([key, { label, color }]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleStatusChange(key)
                          }}
                          className={`w-full px-3 py-2 text-left text-xs hover:bg-[#3b82f6]/5 flex items-center gap-2 transition-colors duration-200 ${color}`}
                        >
                          <div className={`w-2 h-2 rounded-full ${color.split(' ')[0]}`} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {task.description && <p className="text-sm text-[#64748b] mt-1 truncate">{task.description}</p>}
            {subtasks.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-[#3b82f6]/5 p-2 sm:p-3 rounded-lg border border-[#3b82f6]/10">
                <div className="flex items-center justify-between text-xs text-[#64748b] font-medium">
                  <span>Subtasks Progress</span><span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-[#3b82f6]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-1 sm:space-y-2 pt-1">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 group/subtask">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => setSubtasks(prev => prev.map((s, idx) => idx === i ? {...s, completed: !s.completed} : s))}
                        className="w-4 h-4 text-[#3b82f6] rounded border-gray-200 focus:ring-[#3b82f6] bg-white"
                      />
                      <span className={`text-sm truncate ${st.completed ? 'text-[#64748b] line-through' : 'text-[#1e293b] group-hover/subtask:text-[#3b82f6]'} transition-colors duration-200`}>{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <div className="relative">
            <button 
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)} 
              className="p-1 sm:p-1.5 hover:bg-[#3b82f6]/10 rounded-lg text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200"
            >
              <MoreVertical size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showMenu && (
              <div 
                ref={menuRef}
                className="absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn"
              >
                {MENU_OPTIONS.map(opt => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-[#3b82f6]/5 flex items-center gap-2 transition-colors duration-200 text-[#1e293b] hover:text-[#3b82f6]"
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${task.dueDate && isToday(new Date(task.dueDate)) ? 'text-[#3b82f6]' : 'text-[#64748b]'}`}>              
              <Calendar className="w-3.5 h-3.5" />
              {task.dueDate ? (isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM dd')) : '—'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748b] whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'No date'}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </>
  )
}

export default TaskItem;