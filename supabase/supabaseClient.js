
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ijhpwkfhbmmrmemdyjrh.supabase.co';  
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaHB3a2ZoYm1tcm1lbWR5anJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDM2OTcsImV4cCI6MjA2OTUxOTY5N30.x7Eo7KonA7VwDzHhc6lbukueR7AwV5gWjLT5zZBrldw';                        

export const supabase = createClient(supabaseUrl, supabaseKey);
