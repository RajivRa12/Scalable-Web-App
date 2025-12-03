import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { DashboardView } from '@/pages/Dashboard';

interface DashboardHeaderProps {
  currentView: DashboardView;
  setSidebarOpen: (open: boolean) => void;
}

const viewTitles: Record<DashboardView, string> = {
  tasks: 'Task Management',
  profile: 'Profile Settings',
};

export function DashboardHeader({ currentView, setSidebarOpen }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {viewTitles[currentView]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
