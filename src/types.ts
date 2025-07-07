export type User = {
  id: string;
  email: string;
  plan?: 'free' | 'pro';
};

export type ProjectNote = {
  message: string;
  date: string;
  progress: number;
};

export type Project = {
  id: string;
  name: string;
  progress: number;
  status: 'On Track' | 'Needs Attention' | 'Completed';
  lastUpdate: string;
  createdAt: string;
  notes?: ProjectNote[];
  completedAt?: string;
  checkIns?: { date: string }[];
};

export type Task = {
  id: string;
  content: string;
};

export type Todo = {
  id: string;
  title: string;
  tasks: Task[];
};
