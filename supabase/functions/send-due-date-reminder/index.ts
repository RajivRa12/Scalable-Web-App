import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TaskResult {
  id: string;
  title: string;
  due_date: string;
  user_id: string;
  profiles: {
    email: string;
    full_name: string;
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get tasks due within the next 24 hours that aren't completed
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log("Checking for tasks due between", today.toISOString(), "and", tomorrow.toISOString());

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        due_date,
        user_id,
        profiles!inner(email, full_name)
      `)
      .gte("due_date", today.toISOString())
      .lte("due_date", tomorrow.toISOString())
      .neq("status", "completed");

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    console.log(`Found ${tasks?.length || 0} tasks due soon`);

    const emailResults = [];

    for (const task of (tasks as TaskResult[]) || []) {
      const profile = task.profiles?.[0];
      if (!profile?.email) {
        console.log(`Skipping task ${task.id} - no email found`);
        continue;
      }

      const dueDate = new Date(task.due_date);
      const formattedDate = dueDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      try {
        const emailResponse = await resend.emails.send({
          from: "Task Reminder <onboarding@resend.dev>",
          to: [profile.email],
          subject: `⏰ Task Due Soon: ${task.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .card { background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 16px; padding: 32px; border: 1px solid #334155; }
                .header { text-align: center; margin-bottom: 24px; }
                .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #14b8a6, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .title { font-size: 20px; margin: 16px 0 8px; color: #f1f5f9; }
                .task-name { font-size: 28px; font-weight: bold; color: #14b8a6; margin: 16px 0; }
                .due-date { background: #14b8a6; color: #0f172a; padding: 12px 24px; border-radius: 8px; display: inline-block; font-weight: 600; }
                .footer { text-align: center; margin-top: 24px; color: #64748b; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="card">
                  <div class="header">
                    <div class="logo"></div>
                    <h1 class="title">⏰ Task Reminder</h1>
                  </div>
                  <p>Hi ${profile.full_name || "there"},</p>
                  <p>This is a friendly reminder that you have a task due soon:</p>
                  <div class="task-name">${task.title}</div>
                  <p style="margin-top: 24px;"><strong>Due Date:</strong></p>
                  <div class="due-date">${formattedDate}</div>
                  <div class="footer">
                    <p>Stay productive! 🚀</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Email sent to ${profile.email} for task ${task.id}:`, emailResponse);
        emailResults.push({ taskId: task.id, email: profile.email, status: "sent" });
      } catch (emailError) {
        console.error(`Failed to send email for task ${task.id}:`, emailError);
        emailResults.push({ taskId: task.id, email: profile.email, status: "failed", error: emailError });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksProcessed: tasks?.length || 0,
        emailResults 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-due-date-reminder:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
