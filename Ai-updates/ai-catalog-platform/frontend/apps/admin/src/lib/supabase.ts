import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ftahafqzsblbojvgovmo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0YWhhZnF6c2JsYm9qdmdvdm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTI5MjUsImV4cCI6MjA4OTUyODkyNX0.SOG5tMov0Xf5KtY6CXZXG5EXaHxn2DN8pmfOiLSk04w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
