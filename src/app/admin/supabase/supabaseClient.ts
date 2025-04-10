import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tysasgfmndcgptbtmzgq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5c2FzZ2ZtbmRjZ3B0YnRtemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTgzNDQsImV4cCI6MjA1OTgzNDM0NH0.-4z3xVY-Ljua-mRhmzezzEzkKdcJpniCgu91tlFwIC8'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
