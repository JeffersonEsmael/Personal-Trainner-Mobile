// ============================================
// SUPABASE CLIENT — Configuration & Initialization
// ============================================

import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

/**
 * Check if Supabase is properly configured
 */
export function isConfigured() {
    return !SUPABASE_URL.includes('your-project') && !SUPABASE_ANON_KEY.includes('your-anon-key');
}
