import React, { useState } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  MoreVertical, 
  GripVertical, 
  Box, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Paperclip, 
  X,
  User as UserIcon,
  Send,
  Search,
  Users,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swipeable } from '../../components/Swipeable';

interface Task {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  assignee: string;
  resource: {
    type: 'docker' | 'vm' | 's3';
    name: string;
  };
  columnId: string;
}

interface Column {
  id: string;
  title: string;
}

const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'completed', title: 'Completed' },
];

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Rotate Postgres Credentials', priority: 'P0', assignee: 'Mohammed', resource: { type: 'docker', name: 'db-prod-1' }, columnId: 'backlog' },
  { id: '2', title: 'Scale Kubernetes Cluster', priority: 'P1', assignee: 'Sarah', resource: { type: 'vm', name: 'k8s-worker-pool' }, columnId: 'in-progress' },
  { id: '3', title: 'Fix SSL Handshake Error', priority: 'P0', assignee: 'Admin', resource: { type: 'docker', name: 'nginx-gateway' }, columnId: 'blocked' },
  { id: '4', title: 'Update S3 Bucket Policy', priority: 'P2', assignee: 'Bot', resource: { type: 's3', name: 'assets-prod' }, columnId: 'completed' },
];

const TaskCard: React.FC<{ task: Task; onClick: () => void }> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    P0: 'bg-red-50 text-red-600 border-red-100',
    P1: 'bg-amber-50 text-amber-600 border-amber-100',
    P2: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  const cardContent = (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          {...attributes} 
          {...listeners}
          className="hidden md:flex p-1 -ml-2 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} />
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <h4 className="text-sm font-bold text-slate-900 mb-4 leading-tight">{task.title}</h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
          <Box size={10} className="text-primary" />
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter">{task.resource.name}</span>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} alt={task.assignee} className="w-full h-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <div className="hidden md:block">
        {cardContent}
      </div>
      <div className="md:hidden">
        <Swipeable 
          onLeftSwipe={() => console.log('Stop', task.id)} 
          onRightSwipe={() => console.log('Restart', task.id)}
        >
          {cardContent}
        </Swipeable>
      </div>
    </div>
  );
};

export const OpsBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dropping over a column
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn) {
      if (activeTask.columnId !== overColumn.id) {
        setTasks((prev) => 
          prev.map((t) => t.id === activeId ? { ...t, columnId: overColumn.id } : t)
        );
      }
      return;
    }

    // If dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((prev) => 
        prev.map((t) => t.id === activeId ? { ...t, columnId: overTask.columnId } : t)
      );
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      
      if (overIndex !== -1) {
        setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <Users size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">All Members</span>
          </div>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus size={14} />
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-full md:w-80 shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{column.title}</h3>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                    {tasks.filter((t) => t.columnId === column.id).length}
                  </span>
                </div>
                <button className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400">
                  <MoreVertical size={14} />
                </button>
              </div>

              <div className="flex-1 bg-slate-100/50 border border-slate-200 rounded-2xl p-3 space-y-3 overflow-y-auto custom-scrollbar min-h-[200px]">
                <SortableContext
                  id={column.id}
                  items={tasks.filter((t) => t.columnId === column.id).map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks
                    .filter((t) => t.columnId === column.id)
                    .map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={() => setSelectedTask(task)} 
                      />
                    ))}
                </SortableContext>
              </div>
            </div>
          ))}

          <DragOverlay>
            {activeTask ? (
              <div className="w-80">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Slide-over Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full"
            >
              <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                    selectedTask.priority === 'P0' ? 'bg-red-50 text-red-600 border-red-100' :
                    selectedTask.priority === 'P1' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {selectedTask.priority}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTask.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assignee</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTask.assignee}`} alt={selectedTask.assignee} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{selectedTask.assignee}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Linked Resource</label>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:bg-primary/10 transition-all">
                      <Box size={18} className="text-primary" />
                      <span className="text-sm font-bold text-primary">{selectedTask.resource.name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    Description
                  </h3>
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-600 leading-relaxed">
                    This task involves rotating the credentials for the production Postgres database. 
                    Ensure that all application services are updated with the new connection string 
                    to avoid downtime. Follow the standard security protocol for credential rotation.
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-400" />
                    Sub-tasks
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Generate new database password',
                      'Update Vault secrets',
                      'Restart application containers',
                      'Verify connection health',
                    ].map((step, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-primary/30 transition-all cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{step}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={16} className="text-slate-400" />
                    Activity & Comments
                  </h3>
                  <div className="space-y-4">
                    {[
                      { user: 'Sarah', text: 'I have prepared the new credentials in the staging environment.', time: '2 hours ago' },
                      { user: 'Mohammed', text: 'Great, let me know when you are ready for the production sync.', time: '1 hour ago' },
                    ].map((c, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user}`} alt={c.user} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-900">{c.user}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                            {c.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-200 bg-slate-50/50">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Write a comment... use @ to tag" 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-16"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
