import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, ListTodo, CheckCircle2 } from "lucide-react"
import TaskModal from "../components/AddTask"
import TaskItem from "../components/TaskItem"
import Toast from "../components/Toast"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [toast, setToast] = useState(null)

  const handleTaskUpdate = (updatedTask) => {
    // Update the task in the local state
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    )
    // Show success toast
    showToast('Task updated successfully!')
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleTaskSave = async (task) => {
    setShowModal(false)
    setSelectedTask(null)
    await refreshTasks() // Wait for tasks to refresh
    showToast(
      task._id 
        ? 'Task updated successfully!' 
        : 'Task created successfully!'
    )
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Simple Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ListTodo className="text-[#3b82f6] w-5 h-5 md:w-6 md:h-6" />
          My Tasks
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task List or Empty State */}
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onLogout={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <ListTodo className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Tasks Yet</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Get started by adding your first task. Click the "Add Task" button above to create one.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Your First Task
          </button>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedTask(null)
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default Dashboard
