'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import { toast } from 'sonner';
import { Plus, ListTodo, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

const COLUMNS = [
  { id: 'To Do', title: 'To Do', icon: ListTodo, color: 'border-amber-400 bg-amber-500/10 text-amber-700' },
  { id: 'Doing', title: 'Doing', icon: Clock, color: 'border-blue-400 bg-blue-500/10 text-blue-700' },
  { id: 'Done', title: 'Done', icon: CheckCircle2, color: 'border-emerald-400 bg-emerald-500/10 text-emerald-700' },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tasksRes = await API.get('/tasks');
      setTasks(tasksRes.data);

      if (user?.role === 'admin') {
        const usersRes = await API.get('/users');
        setUsers(usersRes.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const targetStatus = destination.droppableId;
    const previousTasks = [...tasks];

    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === draggableId ? { ...t, status: targetStatus } : t))
    );

    try {
      await API.put(`/tasks/${draggableId}`, { status: targetStatus });
      toast.success(`Task moved to ${targetStatus}`);
    } catch (error) {
      setTasks(previousTasks);
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAssignSelf = async (taskId) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, { assignedTo: user._id });
      toast.success('Task assigned to you');
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  if (authLoading || (loading && tasks.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading board...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kanban Board</h1>
            <p className="text-sm text-slate-600 mt-1">
              Drag and drop cards between columns to update task status in real time.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {COLUMNS.map((col) => {
              const ColumnIcon = col.icon;
              const columnTasks = tasks.filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  className="bg-slate-200/60 rounded-2xl p-4 border border-slate-300/60 flex flex-col min-h-[500px]"
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${col.color}`}>
                        <ColumnIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{col.title}</h3>
                    </div>
                    <span className="text-xs font-semibold bg-slate-300/70 text-slate-700 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-xl transition ${
                          snapshot.isDraggingOver ? 'bg-indigo-50/50 ring-2 ring-indigo-400/30 ring-dashed' : ''
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            index={index}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            onAssignSelf={handleAssignSelf}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={fetchData}
        taskToEdit={taskToEdit}
        users={users}
      />
    </div>
  );
}