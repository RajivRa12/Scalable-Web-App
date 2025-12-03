import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Calendar, Edit2, Trash2, Clock, AlertTriangle, CheckCircle2, Bell, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task } from './TaskList';
import { TASK_CATEGORIES } from './TaskList';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  in_progress: {
    label: 'In Progress',
    icon: AlertTriangle,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success border-success/20',
  },
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
};

function getDueDateAlert(dueDate: string | null, status: string) {
  if (!dueDate || status === 'completed') return null;
  
  const due = new Date(dueDate);
  const now = new Date();
  
  if (isPast(due) && !isToday(due)) {
    return { type: 'overdue', label: 'Overdue', className: 'bg-destructive text-destructive-foreground animate-pulse' };
  }
  if (isToday(due)) {
    return { type: 'today', label: 'Due Today', className: 'bg-warning text-warning-foreground' };
  }
  if (isTomorrow(due)) {
    return { type: 'tomorrow', label: 'Due Tomorrow', className: 'bg-warning/80 text-warning-foreground' };
  }
  const daysUntil = differenceInDays(due, now);
  if (daysUntil <= 3) {
    return { type: 'soon', label: `${daysUntil} days left`, className: 'bg-primary/80 text-primary-foreground' };
  }
  return null;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const dueDateAlert = getDueDateAlert(task.due_date, task.status);
  const category = TASK_CATEGORIES.find(c => c.value === task.category) || TASK_CATEGORIES[0];

  return (
    <div className={cn(
      "glass rounded-xl p-5 transition-all duration-300 animate-scale-in group hover:shadow-glow hover:-translate-y-1",
      dueDateAlert?.type === 'overdue' && "border-destructive/50 shadow-[0_0_20px_hsl(var(--destructive)/0.2)]"
    )}>
      {/* Due Date Alert Banner */}
      {dueDateAlert && (
        <div className={cn(
          "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md mb-3 -mx-1",
          dueDateAlert.className
        )}>
          <Bell className="w-3 h-3" />
          {dueDateAlert.label}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-foreground truncate",
            task.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10"
            onClick={() => onEdit(task)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="outline" className={status.className}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
        <Badge variant="secondary" className={priority.className}>
          {priority.label}
        </Badge>
        <Badge variant="secondary" className={cn("gap-1", category.color)}>
          <Tag className="w-3 h-3" />
          {category.label}
        </Badge>
      </div>

      {task.due_date && (
        <div className={cn(
          "flex items-center gap-2 text-sm",
          dueDateAlert ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          <Calendar className="w-4 h-4" />
          <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
}