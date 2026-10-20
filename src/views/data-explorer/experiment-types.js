// SQL color is the sql-workflow cell color (assets/main.scss); all others keep contrast >= 4.5 with white text.
// Single source of icon, color and route per experiment type (cards, table, filter).
export const EXPERIMENT_TYPES = {
    DATA_EXPLORER: { icon: 'fa-table', color: '#3b5ba5', route: 'data-explorer', designRoute: 'data-explorer-panel' },
    SQL: { icon: 'fa-database', color: 'var(--cell-sql)', route: 'data-explorer', query: { sql: true }, designRoute: 'sql-workflow' },
    MODEL_BUILDER: { icon: 'fa-robot', color: '#a8527a', route: 'choose-task', designRoute: 'model-design' },
    VIS_BUILDER: { icon: 'fa-chart-bar', color: '#b5501a', route: 'new-visualization', designRoute: 'visualization-design' },
};
