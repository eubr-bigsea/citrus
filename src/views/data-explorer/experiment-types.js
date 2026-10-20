// Single source of icon, color and route per experiment type (cards, table, filter).
export const EXPERIMENT_TYPES = {
    DATA_EXPLORER: { icon: 'fa-table', color: '#2f6fb0', route: 'data-explorer', designRoute: 'data-explorer-panel' },
    SQL: { icon: 'fa-database', color: '#6b4fa3', route: 'data-explorer', query: { sql: true }, designRoute: 'sql-workflow' },
    MODEL_BUILDER: { icon: 'fa-robot', color: '#1f8a70', route: 'choose-task', designRoute: 'model-design' },
    VIS_BUILDER: { icon: 'fa-chart-bar', color: '#c2571a', route: 'new-visualization', designRoute: 'visualization-design' },
};
