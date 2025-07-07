'use client';
import { ToastContainer } from '@/hooks/use-toast';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Flame,
  LogOut,
  MoreVertical,
  Plus,
  Rocket,
  Trash2,
  Trophy,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import type { Project, User } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { getLoggedInUser, logout, getProjectsForUser, addProject, deleteProject, addCheckInToProject } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { TodoBoard } from '@/components/dashboard/todo-board';
import { CalendarView } from '@/components/dashboard/calendar-view';

const StatCard = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: React.ElementType;
}) => (
  <Card className="flex flex-col justify-between rounded-2xl bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
    <CardHeader className="flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ProjectCard = ({
  project,
  onProjectUpdate,
  onProjectDelete,
}: {
  project: Project;
  onProjectUpdate: () => void;
  onProjectDelete: (projectId: string) => void;
}) => {
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(project.progress);
  const [message, setMessage] = React.useState('');
  const { toast } = useToast();
  const user = getLoggedInUser();

  const handleSaveCheckIn = () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'error' });
      return;
    }
    addCheckInToProject(user.id, project.id, progress, message);
    toast({ title: 'Check-in Saved!', description: `Progress for "${project.name}" is now ${progress}%.` });
    onProjectUpdate();
    setIsCheckInOpen(false);
  };

  React.useEffect(() => {
    if (isCheckInOpen) {
      setProgress(project.progress);
      setMessage('');
    }
  }, [isCheckInOpen, project.progress]);

  return (
    <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
      <Card className="rounded-2xl bg-card transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
                <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                 <div
                    className={cn(
                        'mt-2 flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                        project.status === 'Completed' ? 'bg-green-500/10 text-green-600'
                        : project.status === 'On Track' ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-red-500/10 text-red-600'
                    )}
                    >
                    {project.status === 'Needs Attention' && <AlertCircle className="h-4 w-4" />}
                    {project.status === 'On Track' && <Activity className="h-4 w-4" />}
                    {project.status === 'Completed' && <CheckCircle2 className="h-4 w-4" />}
                    {project.status}
                </div>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                         <DropdownMenuItem disabled={project.status === 'Completed'}>
                            Check In
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-100 focus:text-red-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Project
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    project and all of its data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onProjectDelete(project.id)} className={buttonVariants({ variant: 'destructive'})}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-foreground">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2 [&>div]:bg-primary" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Last update:{' '}
              <span className="font-semibold text-foreground">
                {formatDistanceToNow(new Date(project.lastUpdate), {
                  addSuffix: true,
                })}
              </span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
              Created:{' '}
              <span className="font-semibold text-foreground">
                {formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true,
                })}
              </span>
          </div>
        </CardContent>
         <CardFooter>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={project.status === 'Completed'}>
                    {project.status === 'Completed' ? 'Completed' : 'Check In Now'}
                    {project.status !== 'Completed' && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
            </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Check In: {project.name}</DialogTitle>
          <DialogDescription>
            Log your progress and accomplishments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="progress-update" className="font-semibold">Progress Update: {progress}%</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="progress-update"
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <p className="text-sm italic text-muted-foreground">
              {progress === 0 ? "Getting started!" : progress === 100 ? "Project complete! 🎉" : "Keep up the great work!"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accomplishment" className="font-semibold">What did you accomplish?</Label>
            <Textarea
              id="accomplishment"
              placeholder="Share your progress, challenges, or wins..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveCheckIn}>Save Check-in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NewProjectDialog = ({ onAddProject, children }: { onAddProject: (name: string) => void, children: React.ReactNode }) => {
    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = React.useState(false);
    const [newProjectName, setNewProjectName] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim() !== '') {
            onAddProject(newProjectName);
            setNewProjectName('');
            setIsNewProjectDialogOpen(false);
        }
    };

    return (
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                Give your new project a name to get started.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    id="name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="col-span-3"
                    placeholder="My awesome project"
                    autoFocus
                />
                </div>
            </div>
            <DialogFooter>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600 transition-colors font-medium px-4 py-2 rounded-md"
                >
                  Create Project
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
};

function ProjectsView({ user, onUserUpdate }: { user: User; onUserUpdate: () => void }) {
  const { toast } = useToast();
  const projects = getProjectsForUser(user.id);

  const handleAddProject = (name: string) => {
    if (name.trim() === '') {
      toast({ title: 'Error', description: 'Project name cannot be empty.', variant: 'error' });
      return;
    }
    const newProject = addProject(user.id, name);
    if (newProject) {
      onUserUpdate();
      toast({ title: 'Project Created', description: `"${newProject.name}" has been added.` });
    }
  };

  const handleProjectDelete = (projectId: string) => {
    const deleted = deleteProject(user.id, projectId);
    if (deleted) {
      toast({ title: 'Project Deleted', description: 'The project has been removed.' });
      onUserUpdate();
    } else {
      toast({ title: 'Error', description: 'Could not delete the project.', variant: 'error' });
    }
  };

  const stats = {
    active: projects.filter(p => p.status === 'On Track' || p.status === 'Needs Attention').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    thisWeek: projects.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  };

  return (
    <>
      <div className="projects-header mb-8">
        <h2 className="text-3xl font-bold">Your Projects</h2>
        <p className="flex items-center gap-2 text-muted-foreground">
            Keep building, keep growing <Rocket className="h-4 w-4" />
        </p>
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={stats.active}
          Icon={Activity}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          Icon={CheckCircle2}
        />
        <StatCard label="This Week" value={stats.thisWeek} Icon={CalendarClock} />
        <StatCard label="Best Streak" value={1} Icon={Trophy} />
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} onProjectUpdate={onUserUpdate} onProjectDelete={handleProjectDelete} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-card py-20 text-center">
            <Rocket className="mb-4 h-12 w-12 animate-bounce text-muted-foreground" />
            <h3 className="text-xl font-semibold">No projects yet. Ready to launch your first?</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Every great journey starts with a single step. Your future self will thank you.
            </p>
            <div className="mt-6">
                <NewProjectDialog onAddProject={handleAddProject}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </NewProjectDialog>
            </div>
        </div>
      )}
    </>
  )
}

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleUserUpdate = React.useCallback(() => {
    const updatedUser = getLoggedInUser();
    if (updatedUser) {
      setUser(updatedUser);
    } else {
        router.replace('/login');
    }
  }, [router]);

  React.useEffect(() => {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      router.replace('/login');
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    // Reset theme to light in localStorage and DOM
    if (typeof window !== 'undefined') {
      localStorage.setItem('notey-theme', 'light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add('light');
    }
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login'); // Go to login page
  };

  const handleAddProject = (name: string) => {
    if (!user) return;
    const newProject = addProject(user.id, name);
    if (newProject) {
      handleUserUpdate();
      toast({ title: 'Project Created', description: `"${newProject.name}" has been added.` });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Rocket className="h-12 w-12 animate-pulse text-primary" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-6 rounded-b-2xl bg-background/95 py-5 px-9 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-primary shadow-md">
            <AvatarImage src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`} data-ai-hint="person avatar" alt={user.email} />
            <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Welcome, {user.email.split('@')[0]}!</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>1 day streak</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <NewProjectDialog onAddProject={handleAddProject}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </NewProjectDialog>
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} aria-label="Log out">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 p-10">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-10 flex w-full rounded-lg bg-zinc-100/20 dark:bg-zinc-800/20 p-1 shadow-sm sticky top-0 z-30 backdrop-blur-md">
            <TabsTrigger value="projects" >
              <span className="block w-full text-center px-3 py-1 text-sm">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="todo" >
              <span className="block w-full text-center px-3 py-1 text-sm">To-do List</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" >
              <span className="block w-full text-center px-3 py-1 text-sm">Calendar</span>
            </TabsTrigger>
          </TabsList>
          <div className="mt-0">
            <TabsContent value="projects">
              <ProjectsView user={user} onUserUpdate={handleUserUpdate} />
            </TabsContent>
            <TabsContent value="todo">
              <TodoBoard />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarView user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      </div>
    </>
  );
}
