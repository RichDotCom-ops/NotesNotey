import type { User, Project } from '../types';




export function getProjectsForUser(userId?: string): Project[] {
  const currentUser =
    userId || (typeof window !== 'undefined' ? localStorage.getItem('notey-current-user') : null);
  if (!currentUser) return [];
  return loadProjects(currentUser);
}

// Remove demo user and demo projects. Use localStorage for all project data.

function getProjectsKey(userId: string) {
  return `notey-projects-${userId}`;
}

function loadProjects(userId: string): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(getProjectsKey(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProjects(userId: string, projects: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getProjectsKey(userId), JSON.stringify(projects));
}

export function getLoggedInUser(): User | null {
  if (typeof window !== 'undefined') {
    const auth = localStorage.getItem('notey-auth');
    const email = localStorage.getItem('notey-current-user');
    if (auth === 'true' && email && email !== 'demo') {
      return { id: email, email, plan: 'free' };
    }
  }
  return null;
}


export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('notey-auth');
    localStorage.removeItem('notey-user');
    localStorage.removeItem('notey-current-user');
  }
}


export function addProject(userId: string, name: string): Project | null {
  const currentUser = userId || (typeof window !== 'undefined' ? localStorage.getItem('notey-current-user') : null);
  if (!currentUser) return null;
  const projects = loadProjects(currentUser);
  const newProject: Project = {
    id: Math.random().toString(36).slice(2),
    name,
    progress: 0,
    status: 'On Track',
    lastUpdate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  saveProjects(currentUser, projects);
  return newProject;
}

export function addCheckInToProject(userId: string, projectId: string, progress: number, message: string) {
  const currentUser = userId || (typeof window !== 'undefined' ? localStorage.getItem('notey-current-user') : null);
  if (!currentUser) return;
  const projects = loadProjects(currentUser);
  const project = projects.find(p => p.id === projectId);
  if (project) {
    project.progress = progress;
    project.lastUpdate = new Date().toISOString();

    if (!Array.isArray(project.notes)) project.notes = [];
    project.notes.push({ message, date: new Date().toISOString(), progress });

    // Add to checkIns array for calendar
    if (!('checkIns' in project) || !Array.isArray(project.checkIns)) {
      project.checkIns = [];
    }
    project.checkIns.push({ date: new Date().toISOString() });

    // Set completedAt if completed for the first time
    if (progress >= 100) {
      project.status = 'Completed';
      if (!project.completedAt) {
        project.completedAt = new Date().toISOString();
      }
    } else if (progress < 50) {
      project.status = 'Needs Attention';
    } else {
      project.status = 'On Track';
    }

    saveProjects(currentUser, projects);
  }
}

export function deleteProject(userId: string, projectId: string): boolean {
  const currentUser = userId || (typeof window !== 'undefined' ? localStorage.getItem('notey-current-user') : null);
  if (!currentUser) return false;
  const projects = loadProjects(currentUser);
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx !== -1) {
    projects.splice(idx, 1);
    saveProjects(currentUser, projects);
    return true;
  }
  return false;
}
