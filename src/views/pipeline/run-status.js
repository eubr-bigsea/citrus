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
