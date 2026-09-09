'use client';

import { Draggable } from '@hello-pangea/dnd';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2, UserPlus, GripVertical, Calendar, Clock } from 'lucide-react';

export default function TaskCard({ task, index, onEdit, onDelete, onAssignSelf }) {
  const { user } = useAuth();

  const isCreator = task.creator?._id === user?._id || task.creator === user?._id;
  const canDelete = user?.role === 'admin' || isCreator;

  // Format timestamps nicely
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createdAtFormatted = formatDate(task.createdAt);
  const updatedAtFormatted = formatDate(task.updatedAt);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white p-4 rounded-xl border transition shadow-sm hover:shadow-md mb-3 ${
            snapshot.isDragging
              ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-500/20 rotate-1'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-slate-800 text-sm leading-snug break-words flex-1">
              {task.title}
            </h4>
            <div
              {...provided.dragHandleProps}
              className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-0.5 rounded"
              title="Drag to reorder or change status"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Timestamps Section */}
          <div className="flex flex-col gap-1 mb-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            {createdAtFormatted && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Created: {createdAtFormatted}</span>
              </div>
            )}
            {updatedAtFormatted && task.updatedAt !== task.createdAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Updated: {updatedAtFormatted}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-slate-600">
                By: <strong className="text-slate-700">{task.creator?.name || 'Unknown'}</strong>
              </span>
              <span className="text-slate-600">
                Assigned:{' '}
                {task.assignedTo ? (
                  <span className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {task.assignedTo.name || 'User'}
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Unassigned</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {!task.assignedTo && user?.role !== 'admin' && (
                <button
                  onClick={() => onAssignSelf(task._id)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Assign to me"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                title="Edit Task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              {canDelete && (
                <button
                  onClick={() => onDelete(task._id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}