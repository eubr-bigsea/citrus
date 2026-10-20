import { differenceInSeconds, parseISO } from 'date-fns';

// Single source of icon and color per pipeline run / step status (badge, steps, notifications).
// Colors keep contrast >= 4.5 with white text; meaning never relies on color alone (icon + label).
export const RUN_STATUS = {
    COMPLETED: { icon: 'fa-check-circle', color: '#1f7a3d' },
    CANCELED: { icon: 'fa-ban', color: '#5f6b76' },
    ERROR: { icon: 'fa-times-circle', color: '#b02a37' },
    INTERRUPTED: { icon: 'fa-pause-circle', color: '#a15c00' },
    PENDING: { icon: 'fa-clock', color: '#4a6fa5' },
    RUNNING: { icon: 'fa-spinner', color: '#5b3fd1', spin: true },
    WAITING: { icon: 'fa-hourglass-half', color: '#0f7b8a' },
    WAITING_INTERVENTION: { icon: 'fa-hand-paper', color: '#8e3b8e' },
};

export const statusOf = (status) => RUN_STATUS[status] || { icon: 'fa-clock', color: '#5f6b76' };

// Same UTC parsing as $filters.formatJsonDate; a run without finish is measured up to now.
export const formatDuration = (start, finish) => {
    if (!start) return '—';
    const end = finish ? parseISO(`${finish}.000Z`) : new Date();
    const total = Math.max(0, differenceInSeconds(end, parseISO(`${start}.000Z`)));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h) return `${h}h ${String(m).padStart(2, '0')}m`;
    return m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
};
