import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raxymdcljwtvkswidvme.supabase.co';
const supabaseAnonKey = 'PASTE_YOUR_COPIED_PUBLISHABLE_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);