// ============================================
// AUTHENTICATION MODULE
// ============================================

import { supabase } from './supabase.js';
import { store } from './store.js';

/**
 * Sign in a user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function login(email, password) {
    const state = store.getState();

    // 1. If using mock data (default or fallback)
    if (state.useMock) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock simple logins matching profiles
                if (email.toLowerCase().includes('admin')) {
                    store.setState({
                        user: { id: 'admin-id', email },
                        profile: { full_name: 'Administrador Global', role: 'admin', academy_id: null }
                    });
                    resolve({ success: true, error: null });
                } else if (email.toLowerCase().includes('professor') || email.toLowerCase().includes('trainer')) {
                    store.setState({
                        user: { id: 'trainer-id', email },
                        profile: { full_name: 'Prof. Lucas Ribeiro', role: 'trainer', academy_id: state.academy?.id }
                    });
                    resolve({ success: true, error: null });
                } else if (email.toLowerCase().includes('academia') || email.toLowerCase().includes('gym')) {
                    store.setState({
                        user: { id: 'academy-admin-id', email },
                        profile: { full_name: 'Gestor ' + (state.academy?.name || 'Academia'), role: 'academy', academy_id: state.academy?.id }
                    });
                    resolve({ success: true, error: null });
                } else if (email.toLowerCase().includes('novato') || email.toLowerCase().includes('new')) {
                    store.initializeEmptyStudentData(state.academy?.slug || 'alpha');
                    resolve({ success: true, error: null });
                } else {
                    // Default to student login
                    store.initializeMockData(state.academy?.slug || 'alpha');
                    resolve({ success: true, error: null });
                }
            }, 600); // realistic network delay
        });
    }

    // 2. Real Supabase auth call
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        store.setState({
            user: data.user,
            profile: profile
        });

        return { success: true, error: null };
    } catch (err) {
        console.error("Login failed:", err);
        return { success: false, error: err.message || "Erro desconhecido ao entrar" };
    }
}

/**
 * Signs out the current user session
 */
export async function logout() {
    const state = store.getState();
    if (!state.useMock) {
        await supabase.auth.signOut();
    }
    store.clearState();
}

/**
 * Returns whether a user session is active
 * @returns {boolean}
 */
export function isAuthenticated() {
    const state = store.getState();
    return !!state.user;
}

/**
 * Resolves permissions and returns the role
 * @returns {string|null}
 */
export function getUserRole() {
    const state = store.getState();
    return state.profile?.role || null;
}
