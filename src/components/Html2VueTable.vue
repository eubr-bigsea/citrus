<template>
    <div>
        <div v-if="useDefaultSlot">
            <slot name="body">
            </slot>
        </div>
        <div v-else>
            <v-client-table :data="tableData" :columns="columns" :filterable="false"></v-client-table>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                useDefaultSlot: true,
                tableData: [],
                columns: [],
                xtableData: [
                    { '#': 1, name: "John", age: "20" },
                    { '#': 2, name: "Jane", age: "24" },
                    { '#': 3, name: "Susan", age: "16" },
                    { '#': 4, name: "Chris", age: "55" },
                    { '#': 5, name: "Dan", age: "40" }
                ],
                xcolumns: ['#', 'name', 'age'],
            }
        },
        methods: {
            _tableToJson(table) {
                // From https://gist.github.com/johannesjo/6b11ef072a0cb467cc93a885b5a1c19f
                const data = [];
                // first row needs to be headers
                const headers = Array.from(table.rows[0].cells)
                    .map((cell) => cell.innerHTML.toLowerCase().replace(/ /gi, ''));

                // go through cells
                for (var i = 1; i < table.rows.length; i++) {
                    const tableRow = table.rows[i];
                    const rowData = {};

                    for (var j = 0; j < tableRow.cells.length; j++) {
                        rowData[headers[j]] = tableRow.cells[j].innerHTML;
                    }
                    data.push(rowData);
                }
                return { headers, data };
            }
        },
        mounted() {
            if (this.$slots.body[0]) {
                const table = this.$slots.body[0].elm.querySelector('table.table-bordered');
                if (table) {
                    const json = this._tableToJson(table);
                    console.debug(json);
                    this.useDefaultSlot = false;
                    this.columns = json.headers;
                    this.tableData = json.data;
                }
            }
        }
    };
</script>