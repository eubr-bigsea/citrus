<template>
    <div>
        <h5>{{visualizationData.title}}</h5>
        <v-client-table :data="data"
                        :columns="columns"
                        :options="options"
                        @row-click="onClick">
            <!-- eslint-disable -->
            <template v-for="col in columns" :slot="col" slot-scope="props">
                <a href="javascript:void(0)">{{props.row[col]}}</a>
            </template>
            <!-- eslint-enable -->
        </v-client-table>
    </div>
</template>

<script>
export default {
    name: "CaipirinhaVisualizationScatter",
    props: {
        visualizationData: {type: Object, default: () => null},
    },
    data: function () {
        return {
            options: {
                filterable: false,
                perPage: 10,
                perPageValues: [],
                skin: 'table-smallest table vis-table',
                sortIcon: {
                    base: 'fa fas',
                    is: 'fa-sort ml-10',
                    up: 'fa-sort-amount-up',
                    down: 'fa-sort-amount-down'
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                }
            },
            columns: this.visualizationData.data.attributes,
            data: this.visualizationData.data.rows.map(row => {
                const columns = this.visualizationData.data.attributes;

                return row.reduce((data, column, i) => {
                    return {
                        ...data,
                        [columns[i]]: column,
                    };
                }, {});
            })
        };
    },
    methods: {
        onClick(data){
            const target = data.event.target;
            console.debug(target.innerText);
            console.debug(data.index);
            console.debug(Array.from(target.parentNode.children).indexOf(target));
        }
    },
};
</script>
<style>
    .vis-table a{
        color: #222 !important;
    }
</style>
