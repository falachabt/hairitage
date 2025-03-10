
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://znyvlzpirrdhorduemnv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueXZsenBpcnJkaG9yZHVlbW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODk0NDIsImV4cCI6MjA1NTQ2NTQ0Mn0.bMqrsv85AtNCnSrnqL5UPVSWUAzV4ftYXuLznThF8HI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
