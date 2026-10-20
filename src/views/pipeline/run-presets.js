import { format, subDays } from 'date-fns';
import { RUN_STATUS } from './run-status.js';

// Quick filters for the runs list. days: null = no date limit, N = last N days including today.
export const RUN_PRESETS = [
    { key: 'problems7d', icon: 'fa-exclamation-triangle', color: RUN_STATUS.ERROR.color,
        statuses: ['ERROR', 'INTERRUPTED'], days: 7 },
    { key: 'running', icon: 'fa-spinner', color: RUN_STATUS.RUNNING.color,
        statuses: ['RUNNING', 'WAITING', 'PENDING'], days: null },
    { key: 'intervention', icon: 'fa-hand-paper', color: RUN_STATUS.WAITING_INTERVENTION.color,
        statuses: ['WAITING_INTERVENTION'], days: null },
    { key: 'today', icon: 'fa-calendar-alt', color: '#5f6b76', statuses: [], days: 1 },
    { key: 'last7d', icon: 'fa-calendar-alt', color: '#5f6b76', statuses: [], days: 7 },
];

const day = (d) => format(d, 'yyyy-MM-dd');

// Filter values (as bound to the form) a preset applies; status is a comma-separated list.
export const presetFilters = (preset, now = new Date()) => ({
    status: preset.statuses.join(','),
    start: preset.days ? day(subDays(now, preset.days - 1)) : null,
    end: preset.days ? day(now) : null,
});
