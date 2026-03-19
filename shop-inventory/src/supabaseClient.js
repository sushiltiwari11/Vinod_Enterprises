import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ijvyymyhxjqgihtnnykv.supabase.co';
const supabaseKey = 'sb_publishable_apMzkhyGQcOTo5zUB3RPgg_5Euhufz0';

export const supabase = createClient(supabaseUrl, supabaseKey);