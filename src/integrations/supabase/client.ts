// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cnbvqcwksesyqzvazuvw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYnZxY3drc2VzeXF6dmF6dXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1ODQ3MDksImV4cCI6MjA0OTE2MDcwOX0.DuGepzp44IIzrBmltKR-eB_NqwJDzwndDsVJAr9q-q8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);