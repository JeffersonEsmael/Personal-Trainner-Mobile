// ============================================
// MAIN APPLICATION ENTRY POINT
// ============================================

import './styles/index.css';
import { router } from './lib/router.js';
import { detectAndLoadAcademy } from './lib/theme.js';
import { SplashScreen } from './components/SplashScreen.js';
import { store } from './lib/store.js';

// Import views
import { LoginView } from './views/LoginView.js';
import { HomeView } from './views/HomeView.js';
import { WorkoutView } from './views/WorkoutView.js';
import { ExerciseDetailView } from './views/ExerciseDetailView.js';
import { WorkoutCompleteView } from './views/WorkoutCompleteView.js';
import { HistoryView } from './views/HistoryView.js';
import { ProfileView } from './views/ProfileView.js';

// Define routing layout tree
router.addRoute('/login', LoginView);
router.addRoute('/home', HomeView, ['student', 'trainer', 'academy', 'admin']);
router.addRoute('/workout/:id', WorkoutView, ['student']);
router.addRoute('/exercise/:id', ExerciseDetailView, ['student']);
router.addRoute('/workout-complete/:id', WorkoutCompleteView, ['student']);
router.addRoute('/history', HistoryView, ['student']);
router.addRoute('/profile', ProfileView, ['student', 'trainer', 'academy', 'admin']);

// Initialize application
async function initApp() {
    // 1. Detect active gym brand parameters and load config properties
    detectAndLoadAcademy();

    // 2. Play beautiful branded CSS loading splashscreen animation
    const state = store.getState();
    const splash = new SplashScreen(state.academy);
    await splash.show();

    // 3. Initiate first routing check
    router.handleRouting();
}

// Start application
window.addEventListener('DOMContentLoaded', initApp);
