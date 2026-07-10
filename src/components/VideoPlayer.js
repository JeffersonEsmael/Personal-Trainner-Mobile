// ============================================
// VIDEO PLAYER COMPONENT
// ============================================

import { formatTime } from '../lib/utils.js';

export class VideoPlayer {
    /**
     * @param {object} exercise Exercise database item with name, video_url
     */
    constructor(exercise) {
        this.exercise = exercise;
        this.overlay = null;
        this.videoEl = null;
        this.playBtn = null;
        this.progressFill = null;
        this.currentTimeEl = null;
        this.totalTimeEl = null;
        this.isPlaying = false;
    }

    /**
     * Mounts the player and starts playback
     */
    open() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'video-player-overlay';
        
        this.overlay.innerHTML = `
            <div class="video-player-header">
                <button class="btn btn-icon btn-secondary btn-back-player" style="background:rgba(0,0,0,0.5); border:none; color:white;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div style="color:white; font-weight:600; font-size:16px; text-shadow:0 1px 4px rgba(0,0,0,0.8);">${this.exercise.name}</div>
                <div style="width:40px;"></div> <!-- Spacer -->
            </div>

            <!-- Native HTML5 Video Element -->
            <video class="video-player-video" playsinline webkit-playsinline>
                <source src="${this.exercise.video_url}" type="video/mp4">
                Seu navegador não suporta vídeos HTML5.
            </video>

            <!-- Video Controls Bar -->
            <div class="video-player-controls">
                <div class="video-progress-bar">
                    <div class="video-progress-fill" style="width: 0%"></div>
                </div>
                <div class="video-time">
                    <span class="video-current-time">00:00</span>
                    <button class="btn-play-toggle" style="background:none; border:none; color:white;">
                        <svg class="play-svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                    <span class="video-total-time">00:00</span>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.videoEl = this.overlay.querySelector('.video-player-video');
        this.progressFill = this.overlay.querySelector('.video-progress-fill');
        this.progressBar = this.overlay.querySelector('.video-progress-bar');
        this.currentTimeEl = this.overlay.querySelector('.video-current-time');
        this.totalTimeEl = this.overlay.querySelector('.video-total-time');
        this.playBtn = this.overlay.querySelector('.btn-play-toggle');
        this.closeBtn = this.overlay.querySelector('.btn-back-player');

        this.setupListeners();
        
        // Start playing automatically
        this.play();
    }

    setupListeners() {
        // Play/Pause tap on video
        this.videoEl.addEventListener('click', () => {
            if (this.isPlaying) this.pause();
            else this.play();
        });

        // Play/Pause button
        this.playBtn.addEventListener('click', () => {
            if (this.isPlaying) this.pause();
            else this.play();
        });

        // Close player
        this.closeBtn.addEventListener('click', () => this.destroy());

        // Update progress bar
        this.videoEl.addEventListener('timeupdate', () => {
            if (this.videoEl.duration) {
                const pct = (this.videoEl.currentTime / this.videoEl.duration) * 100;
                this.progressFill.style.width = `${pct}%`;
                this.currentTimeEl.textContent = formatTime(this.videoEl.currentTime);
            }
        });

        // Set duration when metadata loads
        this.videoEl.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = formatTime(this.videoEl.duration);
        });

        // Loop execution videos automatically (exercise demos should loop)
        this.videoEl.addEventListener('ended', () => {
            this.videoEl.currentTime = 0;
            this.play();
        });

        // Support clicking on the progress bar to seek
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (this.videoEl.duration) {
                this.videoEl.currentTime = pos * this.videoEl.duration;
            }
        });
    }

    play() {
        this.isPlaying = true;
        this.videoEl.play().catch(e => {
            console.log("Auto-play blocked by browser. Awaiting tap.", e);
            this.isPlaying = false;
            this.updatePlayIcon();
        });
        this.updatePlayIcon();
    }

    pause() {
        this.isPlaying = false;
        this.videoEl.pause();
        this.updatePlayIcon();
    }

    updatePlayIcon() {
        if (this.isPlaying) {
            this.playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            `;
        } else {
            this.playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            `;
        }
    }

    destroy() {
        this.pause();
        this.overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
        this.overlay.addEventListener('animationend', () => {
            this.overlay.remove();
        });
    }
}
