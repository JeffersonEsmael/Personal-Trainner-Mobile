// ============================================
// STORE — Simple Global State Management
// ============================================

import { mockAcademies, mockWorkouts, mockHistory, mockProfile, mockStudents } from './mockData.js';

class Store {
    constructor() {
        this.state = {
            user: null,
            profile: null,
            academy: null,
            workouts: [],
            history: [],
            activeWorkout: null, // { workoutId, letter, name, exercises: [...], startTime, completedCount }
            toasts: [],
            useMock: true, // Use mock by default, can be toggled if Supabase config is loaded
            trainerStudents: mockStudents,
            isImpersonating: false,
            originalTrainerProfile: null
        };
        this.listeners = [];
        this.loadLocalState();
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        
        // Auto-save changes back to the trainer's student list when impersonating
        if (this.state.isImpersonating && this.state.profile) {
            const studentId = this.state.profile.id;
            this.state.trainerStudents = this.state.trainerStudents.map(student => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        full_name: this.state.profile.full_name,
                        avatar_url: this.state.profile.avatar_url,
                        student_details: this.state.profile.student_details,
                        workouts: this.state.workouts
                    };
                }
                return student;
            });
        }

        this.saveLocalState();
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    loadLocalState() {
        const saved = localStorage.getItem('trainer_app_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state.user = parsed.user || null;
                this.state.profile = parsed.profile || null;
                this.state.academy = parsed.academy || null;
                this.state.activeWorkout = parsed.activeWorkout || null;
                this.state.useMock = parsed.useMock !== undefined ? parsed.useMock : true;
                this.state.workouts = parsed.workouts || [];
                this.state.history = parsed.history || [];
                this.state.trainerStudents = parsed.trainerStudents || mockStudents;
                this.state.isImpersonating = parsed.isImpersonating || false;
                this.state.originalTrainerProfile = parsed.originalTrainerProfile || null;
            } catch (e) {
                console.error("Error parsing local state", e);
            }
        }
    }

    saveLocalState() {
        const toSave = {
            user: this.state.user,
            profile: this.state.profile,
            academy: this.state.academy,
            activeWorkout: this.state.activeWorkout,
            useMock: this.state.useMock,
            workouts: this.state.workouts,
            history: this.state.history,
            trainerStudents: this.state.trainerStudents,
            isImpersonating: this.state.isImpersonating,
            originalTrainerProfile: this.state.originalTrainerProfile
        };
        localStorage.setItem('trainer_app_state', JSON.stringify(toSave));
    }

    clearState() {
        this.state = {
            user: null,
            profile: null,
            academy: null,
            workouts: [],
            history: [],
            activeWorkout: null,
            toasts: [],
            useMock: true,
            trainerStudents: mockStudents,
            isImpersonating: false,
            originalTrainerProfile: null
        };
        localStorage.removeItem('trainer_app_state');
        this.notify();
    }

    // Helper functions for mock integration
    initializeMockData(academySlug = 'alpha') {
        const academy = mockAcademies[academySlug] || mockAcademies['alpha'];
        const profile = this.state.profile || { ...mockProfile, academy_id: academy.id };
        
        const workouts = (this.state.workouts && this.state.workouts.length > 0)
            ? this.state.workouts
            : mockWorkouts.map(w => ({ ...w, academy_id: academy.id }));
            
        const history = (this.state.history && this.state.history.length > 0)
            ? this.state.history
            : mockHistory.map(h => ({ ...h, academy_id: academy.id }));

        this.setState({
            user: this.state.user || { id: profile.id, email: 'aluno@academia.com' },
            profile,
            academy,
            workouts,
            history,
            useMock: true
        });
    }

    initializeEmptyStudentData(academySlug = 'alpha') {
        const academy = mockAcademies[academySlug] || mockAcademies['alpha'];
        const profile = {
            id: 'user-gabriel-uuid',
            full_name: 'Gabriel Novato',
            avatar_url: '',
            phone: '(11) 99999-8888',
            role: 'student',
            student_details: {
                age: 20,
                weight: 70.0,
                height: 1.75,
                goal: 'conditioning',
                experience: 'beginner',
                trainer_name: 'Prof. Lucas Ribeiro',
                gender: 'male'
            }
        };
        const workouts = [
            { id: 'w-empty-a', name: 'Treino Geral', letter: 'A', exercises: [] },
            { id: 'w-empty-b', name: 'Treino Geral', letter: 'B', exercises: [] },
            { id: 'w-empty-c', name: 'Treino Geral', letter: 'C', exercises: [] }
        ];

        this.setState({
            user: { id: profile.id, email: 'novato@academia.com' },
            profile,
            academy,
            workouts,
            history: [],
            useMock: true
        });
    }

    impersonateStudent(student) {
        // Save current trainer profile so we can restore it later
        const originalTrainerProfile = this.state.originalTrainerProfile || this.state.profile;
        
        this.setState({
            isImpersonating: true,
            originalTrainerProfile,
            profile: {
                id: student.id,
                full_name: student.full_name,
                avatar_url: student.avatar_url,
                role: 'student',
                student_details: student.student_details
            },
            workouts: student.workouts || []
        });
    }

    stopImpersonation() {
        if (!this.state.isImpersonating || !this.state.originalTrainerProfile) return;
        
        // Restore trainer profile
        const original = this.state.originalTrainerProfile;
        
        // Load trainer's basic state (students list is already in state.trainerStudents)
        this.setState({
            isImpersonating: false,
            originalTrainerProfile: null,
            profile: original,
            workouts: [],
            history: []
        });
    }
}

export const store = new Store();
