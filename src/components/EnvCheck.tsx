import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EnvCheck({ children }: { children: React.ReactNode }) {
  const [missingEnv, setMissingEnv] = useState<string[]>([]);

  useEffect(() => {
    const missing: string[] = [];
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      missing.push('VITE_SUPABASE_URL');
    }
    
    if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
      missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
    }

    if (missing.length > 0) {
      setMissingEnv(missing);
    }
  }, []);

  if (missingEnv.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Configuration Required</h1>
          <p className="text-muted-foreground mb-4">
            The following environment variables are missing:
          </p>
          <ul className="list-disc list-inside text-left text-muted-foreground mb-6 space-y-2">
            {missingEnv.map((env) => (
              <li key={env} className="font-mono text-sm">{env}</li>
            ))}
          </ul>
          <div className="text-sm text-muted-foreground mb-4">
            <p className="mb-2">To fix this:</p>
            <ol className="list-decimal list-inside text-left space-y-1">
              <li>Go to your Vercel project settings</li>
              <li>Navigate to Environment Variables</li>
              <li>Add the missing variables above</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

