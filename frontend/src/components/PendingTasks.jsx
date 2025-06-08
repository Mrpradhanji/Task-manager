import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Filter, SortDesc, SortAsc, Award, Plus, ListChecks, Clock } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/AddTask';
import { layoutClasses } from '../assets/dummy';

const API_BASE = 'http://localhost:4000/api/tasks';
const sortOptions = [
  { id: 'newest', label: 'Newest', icon: <SortDesc className="w-3 h-3" /> },
  { id: 'oldest', label: 'Oldest', icon: <SortAsc className="w-3 h-3" /> },
  { id: 'priority', label: 'Priority', icon: <Award className="w-3 h-3" /> },
];

const PendingTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [localTasks, setLocalTasks] = useState(tasks);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleTaskUpdate = useCallback((updatedTask) => {
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  };

  const handleDelete = useCallback(async (id) => {
    await fetch(`${API_BASE}/${id}/gp`, { method: 'DELETE', headers: getHeaders() });
    refreshTasks();
  }, [refreshTasks]);

  const handleToggleComplete = useCallback(async (id, completed) => {
    await fetch(`${API_BASE}/${id}/gp`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ completed: completed ? 'Yes' : 'No' }),
    });
    refreshTasks();
  }, [refreshTasks]);

  const sortedPendingTasks = useMemo(() => {
    return localTasks
      .filter(task => ![true, 1, "yes"].includes(
        typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
      ))
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 };
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
          }
          default:
            return 0;
        }
      });
  }, [localTasks, sortBy]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#1e293b] flex items-center gap-2">
            <ListChecks className="text-[#3b82f6] w-5 h-5 md:w-6 md:h-6" /> Pending Tasks
          </h1>
          <p className="text-sm text-[#64748b] mt-1 ml-7">
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} needing your attention
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-[#1e293b] font-medium">
            <Filter className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm">Sort by:</span>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-[#1e293b] md:hidden text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
          <div className="hidden md:flex space-x-1 bg-[#3b82f6]/5 p-1 rounded-lg">
            {sortOptions.map(opt => (
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

      <div 
        onClick={() => setShowModal(true)} 
        className="mb-6 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#3b82f6]/20 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center justify-center gap-3 text-[#3b82f6]">
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
            <Plus size={18} />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-gray-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">All caught up!</h3>
            <p className="text-sm text-[#64748b] mb-4">No pending tasks - great work!</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all shadow-sm"
            >
              Create New Task
            </button>
          </div>
        ) : (
          sortedPendingTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); }}
        taskToEdit={selectedTask}
        onSave={handleTaskUpdate}
      />
    </div>
  );
};

export default PendingTasks;