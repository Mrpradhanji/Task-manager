import React, { useState, useMemo, useCallback } from 'react';
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
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    const filtered = tasks.filter(
      (t) => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    );
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden bg-[#0A0A0A]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2">
            <ListChecks className="text-[#00FFFF] w-5 h-5 md:w-6 md:h-6" /> Pending Tasks
          </h1>
          <p className="text-sm text-gray-400 mt-1 ml-7">
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} needing your attention
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#0A0A0A]/80 backdrop-blur-sm p-3 rounded-xl border border-[#00FFFF]/10 shadow-lg shadow-[#00FFFF]/5">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <Filter className="w-4 h-4 text-[#00FFFF]" />
            <span className="text-sm">Sort by:</span>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-white md:hidden text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
          <div className="hidden md:flex space-x-1 bg-[#00FFFF]/5 p-1 rounded-lg">
            {sortOptions.map(opt => (
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

      <div 
        onClick={() => setShowModal(true)} 
        className="mb-6 p-4 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl border border-[#00FFFF]/10 hover:border-[#00FFFF]/20 transition-all cursor-pointer shadow-lg shadow-[#00FFFF]/5"
      >
        <div className="flex items-center justify-center gap-3 text-[#00FFFF]">
          <div className="w-8 h-8 rounded-full bg-[#00FFFF]/10 flex items-center justify-center">
            <Plus size={18} />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className="p-6 bg-[#0A0A0A]/80 backdrop-blur-sm rounded-xl border border-[#00FFFF]/10 text-center shadow-lg shadow-[#00FFFF]/5">
            <div className="w-16 h-16 bg-[#00FFFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#00FFFF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
            <p className="text-sm text-gray-400 mb-4">No pending tasks - great work!</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="px-4 py-2 bg-[#00FFFF]/10 text-[#00FFFF] rounded-lg text-sm font-medium border border-[#00FFFF]/20 hover:bg-[#00FFFF]/20 transition-all shadow-lg shadow-[#00FFFF]/5"
            >
              Create New Task
            </button>
          </div>
        ) : (
          sortedPendingTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleComplete={() => handleToggleComplete(
                task._id || task.id,
                !task.completed
              )}
              onEdit={() => { setSelectedTask(task); setShowModal(true); }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default PendingTasks;