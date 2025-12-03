import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TaskList } from '@/components/dashboard/TaskList';
import { ProfileSection } from '@/components/dashboard/ProfileSection';
import { Loader2 } from 'lucide-react';

export type DashboardView = 'tasks' | 'profile';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>('tasks');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <DashboardHeader 
          currentView={currentView}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {currentView === 'tasks' && <TaskList />}
            {currentView === 'profile' && <ProfileSection />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
