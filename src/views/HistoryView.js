// ============================================
// HISTORY VIEW
// ============================================

import { store } from '../lib/store.js';
import { formatTime, formatDate, formatShortDate } from '../lib/utils.js';

export class HistoryView {
    constructor() {
        this.state = store.getState();
        this.currentDate = new Date();
    }

    async render() {
        const { history } = this.state;

        // Stats calculations
        const totalWorkouts = history.length;
        const totalSeconds = history.reduce((sum, h) => sum + h.duration_seconds, 0);
        
        // Calculate streak of consecutive days (simple mock representation)
        const streak = totalWorkouts > 0 ? Math.min(totalWorkouts * 2 - 1, 5) : 0;

        // Render monthly calendar grid
        const calendarGridHtml = this.generateCalendarHtml(history);

        // Map list of completed workouts to list items
        const historyListHtml = history.length > 0 
            ? history.map(item => `
                <div class="history-item anim-fade-in-up">
                    <div class="history-item-letter">${item.letter}</div>
                    <div class="history-item-info">
                        <div class="history-item-name">${item.name}</div>
                        <div class="history-item-meta">${formatShortDate(item.completed_at)} • ${item.exercises_completed}/${item.exercises_total} ex.</div>
                    </div>
                    <div class="history-item-duration">${formatTime(item.duration_seconds)}</div>
                </div>
            `).join('')
            : `
                <div style="text-align:center; padding:var(--space-8) var(--space-4); color:var(--color-text-secondary);">
                    <span style="font-size:32px; display:block; margin-bottom:12px;">📅</span>
                    <p style="font-size:14px;">Você ainda não realizou nenhum treino este mês.</p>
                </div>
            `;

        const monthName = this.currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        return `
            <div class="view">
                <!-- Header -->
                <div class="view-header">
                    <h1 class="view-title">Histórico</h1>
                    <p class="view-subtitle">Acompanhe sua consistência de treinos</p>
                </div>

                <!-- Stats summary section -->
                <div class="view-padded" style="padding-top: 0;">
                    <div class="stats-row">
                        <div class="stat-item">
                            <span class="stat-value">${totalWorkouts}</span>
                            <span class="stat-label">Treinos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${Math.round(totalSeconds / 60)}m</span>
                            <span class="stat-label">Minutos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${streak}d</span>
                            <span class="stat-label">Sequência</span>
                        </div>
                    </div>
                </div>

                <!-- Calendar Widget Card -->
                <div class="view-padded">
                    <div class="card" style="padding: var(--space-4);">
                        <div class="history-month-nav">
                            <h3 class="history-month" style="text-transform: capitalize;">${capitalizedMonth}</h3>
                        </div>
                        
                        <div class="calendar-grid">
                            <!-- Week Headers -->
                            <div class="calendar-day-header">D</div>
                            <div class="calendar-day-header">S</div>
                            <div class="calendar-day-header">T</div>
                            <div class="calendar-day-header">Q</div>
                            <div class="calendar-day-header">Q</div>
                            <div class="calendar-day-header">S</div>
                            <div class="calendar-day-header">S</div>
                            
                            <!-- Calendar Days -->
                            ${calendarGridHtml}
                        </div>
                    </div>
                </div>

                <!-- Recent Activities list -->
                <div class="home-section" style="padding-top: var(--space-2);">
                    <h3 class="section-title">Atividades Recentes</h3>
                    <div class="history-list">
                        ${historyListHtml}
                    </div>
                </div>
            </div>
        `;
    }

    generateCalendarHtml(history) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Start date of month and length
        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDayDate = new Date(year, month + 1, 0).getDate();

        // Get matching workout days in history for active highlights
        const workoutDates = history.map(h => {
            const date = new Date(h.completed_at);
            return date.getFullYear() === year && date.getMonth() === month ? date.getDate() : -1;
        }).filter(d => d !== -1);

        const today = new Date();
        let daysHtml = '';

        // Fill leading padding empty spaces
        for (let i = 0; i < firstDayIndex; i++) {
            daysHtml += `<div class="calendar-day inactive"></div>`;
        }

        // Fill days of current month
        for (let day = 1; day <= lastDayDate; day++) {
            const hasWorkout = workoutDates.includes(day);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            
            const classes = [
                'calendar-day',
                hasWorkout ? 'has-workout' : '',
                isToday ? 'today' : ''
            ].filter(Boolean).join(' ');

            daysHtml += `<div class="${classes}">${day}</div>`;
        }

        return daysHtml;
    }

    afterRender() {
        // Any hooks required
    }
}
