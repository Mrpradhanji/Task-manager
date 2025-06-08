import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const { tasks } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Add console.log to debug
  console.log('Calendar Component - Tasks:', tasks);
  console.log('Calendar Component - Current Date:', currentDate);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const getTasksForSelectedDate = () => {
    return getTasksForDate(selectedDate);
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-[#1e293b] flex items-center gap-2">
            <CalendarIcon className="text-[#3b82f6] w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Task Calendar</span>
          </h1>
          <p className="text-sm text-[#64748b] mt-1 ml-7">
            View and track your tasks across time
          </p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1e293b]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#64748b]" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#64748b]" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center py-2 text-sm font-medium text-[#64748b]"
            >
              {day}
            </div>
          ))}
          {days.map((day, dayIdx) => {
            const tasksForDay = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative p-2 h-24 text-left rounded-lg transition-all
                  ${isCurrentMonth ? 'hover:bg-[#3b82f6]/5' : 'opacity-50'}
                  ${isSelected ? 'bg-[#3b82f6]/10 border border-[#3b82f6]' : ''}
                  ${isCurrentDay ? 'font-bold text-[#3b82f6]' : 'text-[#1e293b]'}
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {tasksForDay.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {tasksForDay.slice(0, 2).map(task => (
                      <div
                        key={task._id}
                        className={`
                          text-xs p-1 rounded truncate
                          ${task.completed ? 'bg-green-100 text-green-700' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}
                        `}
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksForDay.length > 2 && (
                      <div className="text-xs text-[#64748b]">
                        +{tasksForDay.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-[#1e293b] mb-4">
          Tasks for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="space-y-3">
          {getTasksForSelectedDate().length > 0 ? (
            getTasksForSelectedDate().map(task => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#3b82f6]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-[#3b82f6]" />
                  )}
                  <div>
                    <h4 className="font-medium text-[#1e293b]">{task.title}</h4>
                    <p className="text-sm text-[#64748b]">{task.description}</p>
                  </div>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
                  {task.priority}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#64748b]">
              No tasks scheduled for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 