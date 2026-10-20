export const CELL_STATUS_LABELS = {
    RUNNING: 'Executando', COMPLETED: 'Concluído', ERROR: 'Erro',
    PENDING: 'Pendente', WAITING: 'Aguardando',
};

export const getCellStatusLabel = (cell) => CELL_STATUS_LABELS[cell.status] || cell.status || 'Sem execução';

export const CELL_TYPE_ICONS = {
    'execute-sql': 'fa fa-database',
    'execute-python': 'fa fa-code',
    'execute-script': 'fa fa-file-code',
};
