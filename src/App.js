import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, Plus, Trash2, Edit2 } from 'lucide-react';

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(task, priority) {
    this.values.push({ task, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => b.priority - a.priority);
  }
}

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, title: "Update user authentication", priority: 3, status: "urgent", dueDate: "2024-12-01" },
      { id: 2, title: "Optimize database queries", priority: 2, status: "high", dueDate: "2024-12-05" },
      { id: 3, title: "Fix mobile responsiveness", priority: 1, status: "normal", dueDate: "2024-12-10" }
    ];
  });

  const [newTask, setNewTask] = useState({
    title: '',
    priority: 2,
    status: 'normal',
    dueDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');

  // Sort tasks by priority (high to low)
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  // Group tasks by priority
  const groupedTasks = {
    high: sortedTasks.filter(task => task.priority === 3),
    medium: sortedTasks.filter(task => task.priority === 2),
    low: sortedTasks.filter(task => task.priority === 1)
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 3: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 1: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 3: return 'High Priority';
      case 2: return 'Medium Priority';
      case 1: return 'Low Priority';
      default: return 'Unknown Priority';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'normal': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      showNotification('Please fill in all required fields');
      return;
    }

    if (editingId !== null) {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...newTask, id: editingId } : task
      ));
      showNotification('Task updated successfully');
      setEditingId(null);
    } else {
      const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
      setTasks([...tasks, { ...newTask, id: newId }]);
      showNotification('Task added successfully');
    }

    setNewTask({
      title: '',
      priority: 2,
      status: 'normal',
      dueDate: ''
    });
  };

  const handleEdit = (task) => {
    setNewTask(task);
    setEditingId(task.id);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    showNotification('Task deleted successfully');
  };

  const TaskList = ({ tasks, priority }) => (
    <div className="mb-8">
      <div className={`mb-4 p-2 ${getPriorityColor(priority)} text-white rounded-t-lg font-semibold`}>
        {getPriorityLabel(priority)} ({tasks.length})
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} 
               className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow
                          ${editingId === task.id ? 'border-2 border-blue-500' : ''}`}>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(task.status)}
                <span className="font-medium">{task.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{task.dueDate}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => handleEdit(task)}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
          <h2 className="text-2xl font-bold">Task Priority Queue</h2>
          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
            Priority Sorted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>High Priority</option>
            <option value={2}>Medium Priority</option>
            <option value={1}>Low Priority</option>
          </select>
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({...newTask, status: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          onClick={handleAddTask}
          className="w-full md:w-auto mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {editingId !== null ? 'Update Task' : 'Add Task'}
        </button>

        {notification && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
            {notification}
          </div>
        )}

        {/* Display tasks grouped by priority */}
        {groupedTasks.high.length > 0 && <TaskList tasks={groupedTasks.high} priority={3} />}
        {groupedTasks.medium.length > 0 && <TaskList tasks={groupedTasks.medium} priority={2} />}
        {groupedTasks.low.length > 0 && <TaskList tasks={groupedTasks.low} priority={1} />}
      </div>
    </div>
  );
};

export default TaskManager;