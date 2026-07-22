import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raxymdcljwtvkswidvme.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheHltZGNsand0dmtzd2lkdm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Mzk4NjUsImV4cCI6MjEwMDMxNTg2NX0.zY9dMUdRalgxiMmhoHP4n5_pfqIU1WBVcSO9Gpx7A7Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);