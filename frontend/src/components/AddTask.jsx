// components/TaskModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, X, Save, Calendar, AlignLeft, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import { baseControlClasses, priorityStyles, DEFAULT_TASK, TASK_STATUS, PRIORITY_TAGS } from '../assets/dummy';

const API_URL = 'https://task-manager-3-3rzq.onrender.com';

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingTasks, setExistingTasks] = useState([]);
  const [isCheckingTitle, setIsCheckingTitle] = useState(false);
  const [titleError, setTitleError] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  // Debounce function for title validation
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Check if title is unique
  const checkTitleUnique = async (title) => {
    if (!title.trim()) {
      setTitleError(null);
      return;
    }
    
    try {
      setIsCheckingTitle(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setTitleError(null);
        return;
      }

      const response = await fetch(`${API_URL}/api/tasks/check-title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: title.trim(),
          taskId: taskData.id // Include taskId if editing
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Don't show error for network issues, just clear any existing error
        setTitleError(null);
        return;
      }

      if (!data.isUnique) {
        setTitleError('This title is already taken');
      } else {
        setTitleError(null);
      }
    } catch (err) {
      // Don't show error for network issues, just clear any existing error
      setTitleError(null);
    } finally {
      setIsCheckingTitle(false);
    }
  };

  // Debounced title check
  const debouncedCheckTitle = useCallback(
    debounce((title) => {
      checkTitleUnique(title);
    }, 500),
    [taskData.id]
  );

  // Fetch existing tasks when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }
        
        console.log('Fetching existing tasks...');
        const response = await fetch(`${API_URL}/api/tasks/gp`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched tasks:', data);
        setExistingTasks(data.data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load existing tasks. Please try again.');
      }
    };

    fetchTasks();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      console.log('Editing task:', taskToEdit);
      const normalized = taskToEdit.completed === 'Yes' || taskToEdit.completed === true ? 'Yes' : 'No';
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Low',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      console.log('Creating new task');
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'title') {
      setError(null);
      setTitleError(null);
      debouncedCheckTitle(value);
    }
  }, [debouncedCheckTitle]);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const isDuplicateTitle = useCallback((title) => {
    if (!title.trim()) return false;
    
    const normalizedTitle = title.toLowerCase().trim();
    console.log('Checking for duplicate title:', normalizedTitle);
    console.log('Existing tasks:', existingTasks);

    // Don't check for duplicates if we're editing the same task
    if (taskData.id) {
      const isDuplicate = existingTasks.some(task => 
        task._id !== taskData.id && 
        task.title.toLowerCase().trim() === normalizedTitle
      );
      console.log('Is duplicate (edit mode):', isDuplicate);
      return isDuplicate;
    }

    const isDuplicate = existingTasks.some(task => 
      task.title.toLowerCase().trim() === normalizedTitle
    );
    console.log('Is duplicate (create mode):', isDuplicate);
    return isDuplicate;
  }, [existingTasks, taskData.id]);

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate title
    if (!taskData.title.trim()) {
      setError('Task title is required');
      return;
    }

    // Final uniqueness check before submission
    if (isDuplicateTitle(taskData.title)) {
      setError('A task with this title already exists. Please choose a different title.');
      return;
    }

    if (titleError) {
      setError('Please choose a different title');
      return;
    }

    if (taskData.dueDate && taskData.dueDate < today) {
      setError('Due date cannot be in the past.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const isEdit = Boolean(taskData.id);
      const url = isEdit ? `${API_URL}/api/tasks/${taskData.id}/gp` : `${API_URL}/api/tasks/gp`;
      
      // Format the due date to include time
      const formattedDueDate = taskData.dueDate ? `${taskData.dueDate}T00:00:00.000Z` : null;
      
      const resp = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...taskData,
          title: taskData.title.trim(),
          priority: taskData.priority, // Keep the capitalized value
          dueDate: formattedDueDate
        }),
      });

      if (!resp.ok) {
        if (resp.status === 401) {
          console.log('Unauthorized - logging out');
          return onLogout?.();
        }
        const err = await resp.json();
        // Check for duplicate title error from backend
        if (err.message && err.message.toLowerCase().includes('duplicate')) {
          setError('A task with this title already exists. Please choose a different title.');
          return;
        }
        throw new Error(err.message || 'Failed to save task');
      }

      const saved = await resp.json();
      
      if (saved.success) {
        // Pass the updated task data to onSave
        onSave?.(saved.task);
        onClose();
      } else {
        throw new Error(saved.message || 'Failed to save task');
      }
    } catch (err) {
      console.error('Task save error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [taskData, today, getHeaders, onLogout, onSave, onClose, titleError, isDuplicateTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-lg border border-gray-100 p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1e293b] flex items-center gap-2">
            {taskData.id ? <Save className="text-[#3b82f6] w-5 h-5" /> : <PlusCircle className="text-[#3b82f6] w-5 h-5" />}
            {taskData.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#3b82f6]/10 rounded-lg transition-colors text-[#64748b] hover:text-[#3b82f6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-[#ef4444] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#1e293b] mb-1">
              Task Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  titleError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20'
                } text-[#1e293b]`}
                placeholder="Enter task title"
              />
              {isCheckingTitle && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
            {titleError && (
              <p className="mt-1 text-sm text-red-500">{titleError}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#1e293b] mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 text-[#1e293b] resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-[#1e293b] mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                min={today}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 text-[#1e293b]"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-[#1e293b] mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 text-[#1e293b]"
              >
                {priorityOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1e293b] mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-[#3b82f6]" /> Status
            </label>
            <div className="flex gap-4">
              {[{ val: 'Yes', label: 'Completed' }, { val: 'No', label: 'In Progress' }].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input 
                    type="radio" 
                    name="completed" 
                    value={val} 
                    checked={taskData.completed === val}
                    onChange={handleChange} 
                    className="h-4 w-4 text-[#3b82f6] focus:ring-[#3b82f6] border-gray-200 bg-white rounded" 
                  />
                  <span className="ml-2 text-sm text-[#1e293b]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-[#64748b] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {taskData.id ? 'Save Changes' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
