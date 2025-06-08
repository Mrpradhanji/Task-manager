import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus } from "lucide-react"
import TaskModal from "../components/AddTask"
import TaskItem from "../components/TaskItem"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const handleTaskUpdate = (updatedTask) => {
    refreshTasks()
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task List */}
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

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedTask(null)
          refreshTasks()
        }}
        taskToEdit={selectedTask}
        onSave={() => {
          setShowModal(false)
          setSelectedTask(null)
          refreshTasks()
        }}
      />
    </div>
  )
}

export default Dashboard
