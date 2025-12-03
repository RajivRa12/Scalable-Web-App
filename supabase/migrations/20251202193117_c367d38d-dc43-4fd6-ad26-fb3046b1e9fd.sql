-- Add category column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN category text DEFAULT 'general';

-- Create index for better filtering performance
CREATE INDEX idx_tasks_category ON public.tasks(category);