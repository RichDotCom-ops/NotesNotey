"use client";

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Todo, Task } from '@/types';

const defaultTodos: Todo[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
];

const TaskCard = ({ task, isOverlay }: { task: Task, isOverlay?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className={`mb-2 bg-card/80 backdrop-blur-sm ${isOverlay ? 'shadow-lg' : ''}`}>
      <CardContent className="flex items-center gap-2 p-3">
        <button {...listeners} className="cursor-grab p-1" aria-describedby={`task-${task.id}`}>
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        <span id={`task-${task.id}`} className="flex-1">{task.content}</span>
      </CardContent>
    </Card>
  );
};

const TodoColumn = ({ todo, tasks, addTask }: { todo: Todo; tasks: Task[]; addTask: (todoId: string, content: string) => void }) => {
  const [newTaskContent, setNewTaskContent] = React.useState('');

  const { setNodeRef } = useSortable({ 
    id: todo.id,
    data: {
      type: 'Column',
      todo,
    }
  });
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskContent.trim()) {
      addTask(todo.id, newTaskContent);
      setNewTaskContent('');
    }
  };

  return (
    <Card ref={setNodeRef} className="w-80 flex-shrink-0 border-dashed bg-muted/50">
      <CardHeader>
        <CardTitle>{todo.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <div className="w-full">
            <Input
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Add a new task..."
              className="h-9"
            />
          </div>
          <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex min-h-[50px] flex-col gap-2 p-1">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
};

export function TodoBoard() {
  // Use the current user for namespacing todos
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUser(localStorage.getItem('notey-current-user'));
    }
  }, []);
  const storageKey = currentUser ? `notey-todos-${currentUser}` : 'notey-todos-guest';
  const [todos, setTodos] = useLocalStorage<Todo[]>(storageKey, defaultTodos);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTask = (todoId: string, content: string) => {
    const newTask: Task = { id: `task-${Date.now()}`, content };
    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, tasks: [...todo.tasks, newTask] } : todo
      )
    );
  };

  const findContainer = (id: UniqueIdentifier) => {
    if (todos.some(c => c.id === id)) {
      return todos.find(c => c.id === id);
    }
    return todos.find(todo => todo.tasks.some(task => task.id === id));
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    if (activeId === overId) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
  
    if (!isActiveATask) return;
  
    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTodos((todos) => {
        const activeIndex = todos.findIndex((t) => t.tasks.some(task => task.id === activeId));
        const overIndex = todos.findIndex((t) => t.tasks.some(task => task.id === overId));
        const activeColumn = todos[activeIndex];
        const overColumn = todos[overIndex];
  
        if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
          const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
          const overTaskIndex = overColumn.tasks.findIndex(t => t.id === overId);
          
          let newIndex: number;
          if(over.data.current?.task) {
            newIndex = overColumn.tasks.length > 0 ? overTaskIndex : 0;
          } else {
            newIndex = overColumn.tasks.length;
          }

          const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
          overColumn.tasks.splice(newIndex, 0, movedTask);
  
          return [...todos];
        }
        return todos;
      });
    }
  
    // Im dropping a Task over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
       setTodos((todos) => {
        const activeIndex = todos.findIndex((t) => t.tasks.some(task => task.id === activeId));
        const overIndex = todos.findIndex((t) => t.id === overId);
        const activeColumn = todos[activeIndex];
        const overColumn = todos[overIndex];

        if(activeColumn && overColumn && activeColumn.id !== overColumn.id) {
          const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
          const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
          overColumn.tasks.push(movedTask);
          return [...todos];
        }

        return todos;
      });
    }
  };
  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;
    
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    
    if (!activeContainer || !overContainer || activeContainer.id !== overContainer.id) {
      return;
    }

    const activeIndex = activeContainer.tasks.findIndex(t => t.id === active.id);
    const overIndex = overContainer.tasks.findIndex(t => t.id === over.id);

    if (activeIndex !== overIndex) {
      setTodos(prev => {
        const newTodos = [...prev];
        const todoIndex = newTodos.findIndex(t => t.id === activeContainer.id);
        const newTasks = [...newTodos[todoIndex].tasks];
        const [removed] = newTasks.splice(activeIndex, 1);
        newTasks.splice(overIndex, 0, removed);
        newTodos[todoIndex].tasks = newTasks;
        return newTodos;
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd} 
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-6 flex-wrap md:flex-nowrap justify-center md:justify-start w-full">
        {todos.map(todo => (
          <TodoColumn key={todo.id} todo={todo} tasks={todo.tasks} addTask={addTask} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
