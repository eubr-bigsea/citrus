export default class DataTableBuilder {
    constructor($t) {
        // Initialize with default options
        this.options = {
            debounce: 800,
            skin: 'table table-hover',
            columnClasses: { actions: 'th-10' },
            preserveState: true,
            saveState: true,
            filterByColumn: false,
            sortIcon: {
                base: 'sort-base',
                is: 'sort-is ml-10',
                up: 'sort-up',
                down: 'sort-down'
            },
            texts: {
                filter: $t('common.filter'),
                count: $t('common.pagerShowing'),
                limit: $t('common.limit'),
                noResults: $t('common.noData'),
                loading: $t('common.loading'),
                filterPlaceholder: $t('common.filterPlaceholder')
            }
        };
        this._columns = [];
    }
    build() {
        return { columns: this._columns, options: this.options };
    }
    columns(...names) {
        this._columns = names;
        return this;
    }
    sortable(...names) {
        this.options.sortable = names;
        return this;
    }
    filterable(...names) {
        this.options.filterable = names;
        return this;
    }
    requestFunction(fn) {
        this.options.requestFunction = fn;
        return this;
    }
    headings(h) {
        this.options.headings = h;
        return this;
    }
    saveState(v) {
        this.options.saveState = v;
        return this;
    }
    perPageValues(v) {
        this.options.perPageValues = v;
        return this;
    }
}