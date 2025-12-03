import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export function SubtaskList({ taskId, subtasks, onSubtasksChange }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    setIsAdding(true);
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title: newSubtask.trim(),
        position: subtasks.length,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add subtask');
      console.error(error);
    } else if (data) {
      onSubtasksChange([...subtasks, data as Subtask]);
      setNewSubtask('');
      toast.success('Subtask added');
    }
    setIsAdding(false);
  };

  const toggleSubtask = async (subtask: Subtask) => {
    const { error } = await supabase
      .from('subtasks')
      .update({ completed: !subtask.completed })
      .eq('id', subtask.id);

    if (error) {
      toast.error('Failed to update subtask');
    } else {
      onSubtasksChange(
        subtasks.map(s => 
          s.id === subtask.id ? { ...s, completed: !s.completed } : s
        )
      );
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) {
      toast.error('Failed to delete subtask');
    } else {
      onSubtasksChange(subtasks.filter(s => s.id !== subtaskId));
      toast.success('Subtask deleted');
    }
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{completedCount}/{subtasks.length} completed</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask items */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg group transition-all duration-200",
              "hover:bg-muted/50",
              subtask.completed && "opacity-60"
            )}
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab" />
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(subtask)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <span className={cn(
              "flex-1 text-sm transition-all duration-200",
              subtask.completed && "line-through text-muted-foreground"
            )}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => deleteSubtask(subtask.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new subtask */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a subtask..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
          className="h-8 text-sm"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={addSubtask}
          disabled={!newSubtask.trim() || isAdding}
          className="h-8 px-3"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
