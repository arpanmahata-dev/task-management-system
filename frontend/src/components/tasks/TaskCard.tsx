'use client';

import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Trash2, Edit, Clock, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function TaskCard({ task, onDelete, onEdit, onStatusChange }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${priorityColors[task.priority]} hover:shadow-lg transition`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ').toUpperCase()}
        </span>
        {isOverdue && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            OVERDUE
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        </div>
        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      <select
      value={task.status}
      onChange={(e) => {
        e.preventDefault();
        onStatusChange(task._id, e.target.value);
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      onClick={(e) => e.stopPropagation()}
      >
      <option value="todo">To Do</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
    </div>
  );
}