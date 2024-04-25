<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom">
            <h1 v-if="fromPipelineEdit" class="runsList-title">
                Execuções - {{$route.params.name}}
            </h1>
            <h1 v-else class="runsList-title">
                {{$t('titles.pipelineRuns', 2)}}
            </h1>
            <router-link v-if="fromPipelineEdit"
                         :to="{name: 'pipelineEdit', params: {id: $route.params.id}}"
                         class="btn btn-outline-primary d-print-none float-right btn-sm">
                <font-awesome-icon icon="fa-chevron-left" />
                &nbsp; {{$t('actions.back')}} -
                Pipeline #{{$route.params.id}}
            </router-link>
        </div> 

        <div class="runsList-body">
            <div class="runsList-container">
                <v-client-table ref="runsList" 
                                :data="tableData" 
                                :columns="columns" 
                                :options="options" 
                                name="runsList">
                    <template #id="props">
                        <router-link :to="{ name: 'pipelineRunDetail', params: { id: props.row.id } }">
                            {{props.row.id}}
                        </router-link>
                    </template>
                    <template #pipeline_id="props">
                        <router-link :to="{ name: 'pipelineEdit', params: { id: props.row.id } }">
                            {{props.row.pipeline_id}}
                        </router-link>
                    </template>
                    <template #status="props">
                        <div class="runsList-status" :class="props.row.status.toLowerCase()">
                            {{props.row.status}}
                        </div>
                    </template>
                </v-client-table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            fromPipelineEdit: false,
            columns: [
                'id',
                'pipeline_id',
                'period',
                'updated',
                'last_step',
                'status',
            ],
            tableData: getData(),
            options: {
                skin: 'table-sm table table-hover',
                dateColumns: [],
                columnsClasses: {
                    id: 'text-start',
                    pipeline_id: 'text-start',
                    period: 'text-start',
                    status: 'text-center',
                },
                headings: {
                    id: 'ID',
                    pipeline_id: 'Pipeline',
                    period: 'Período',
                    updated: 'Atualizado Em',
                    last_step: 'Última Etapa',
                    status: 'Status',
                },
                sortable: ['id','pipeline_id'],
                filterable: ['id','pipeline_id'],
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ml-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                texts: {
                    filter: this.$tc('common.filter'),
                    count: this.$t('common.pagerShowing'),
                    limit: this.$t('common.limit'),
                    noResults: this.$t('common.noData'),
                    loading: this.$t('common.loading'),
                    filterPlaceholder: this.$t('common.filterPlaceholder')
                },
            }
        };
    },
    mounted() {
        if (this.$route.params.from === 'PipelineEdit') this.fromPipelineEdit = true;
        else this.fromPipelineEdit = false;
    }
};

function getData() {
    return [
        {
            "id": 1,
            "updated": "19/04/2024 01:04",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend",
            "status": "COMPLETED",
            "period": "01/04/2024 a 08/04/2024",
            "last_step": "6ª de 7"
        },
        {
            "id": 2,
            "updated": "26/02/2025 02:02",
            "pipeline_id": "Pipeline Teste",
            "comment": "erat vitae risus. Duis a mi fringilla mi lacinia mattis.",
            "status": "COMPLETED",
            "period": "15/01/2024 a 22/01/2024",
            "last_step": "2ª de 5"
        },
        {
            "id": 3,
            "updated": "20/09/2023 21:09",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "quam dignissim pharetra. Nam ac nulla. In tincidunt congue turpis.",
            "status": "COMPLETED",
            "period": "30/11/2023 a 30/12/2023",
            "last_step": "3ª de 4"
        },
        {
            "id": 4,
            "updated": "08/04/2024 11:04",
            "pipeline_id": "Pipeline Anac",
            "comment": "Nunc ut erat. Sed nunc est, mollis non, cursus non,",
            "status": "COMPLETED",
            "period": "30/11/2023 a 30/12/2023",
            "last_step": "3ª de 4"
        },
        {
            "id": 5,
            "updated": "18/04/2024 22:04",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare,",
            "status": "WAITING",
            "period": "01/04/2024 a 08/04/2024",
            "last_step": "6ª de 7"
        },
        {
            "id": 6,
            "updated": "16/08/2023 04:08",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "Nunc quis arcu vel quam dignissim pharetra. Nam ac nulla.",
            "status": "RUNNING",
            "period": "15/01/2024 a 22/01/2024",
            "last_step": "6ª de 7"
        },
        {
            "id": 7,
            "updated": "15/04/2023 17:04",
            "pipeline_id": "Pipeline Anac",
            "comment": "diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec,",
            "status": "WAITING",
            "period": "06/06/2023 a 06/07/2023",
            "last_step": "2ª de 5"
        },
        {
            "id": 8,
            "updated": "31/05/2023 09:05",
            "pipeline_id": "Pipeline Anac",
            "comment": "in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu",
            "status": "INTERRUPTED",
            "period": "06/06/2023 a 06/07/2023",
            "last_step": "6ª de 7"
        },
        {
            "id": 9,
            "updated": "20/12/2024 01:12",
            "pipeline_id": "Pipeline Teste",
            "comment": "a, auctor non, feugiat nec, diam. Duis mi enim, condimentum",
            "status": "PENDING",
            "period": "15/01/2024 a 22/01/2024",
            "last_step": "1ª de 4"
        },
        {
            "id": 10,
            "updated": "08/04/2024 19:04",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "consectetuer euismod est arcu ac orci. Ut semper pretium neque.",
            "status": "ERROR",
            "period": "06/06/2023 a 06/07/2023",
            "last_step": "1ª de 4"
        },
        {
            "id": 11,
            "updated": "07/06/2023 10:06",
            "pipeline_id": "Pipeline Teste",
            "comment": "metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh.",
            "status": "PENDING",
            "period": "06/06/2023 a 06/07/2023",
            "last_step": "3ª de 4"
        },
        {
            "id": 12,
            "updated": "23/02/2025 11:02",
            "pipeline_id": "Pipeline Anac",
            "comment": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur",
            "status": "ERROR",
            "period": "12/10/2022 a 13/10/2022",
            "last_step": "2ª de 5"
        },
        {
            "id": 13,
            "updated": "12/08/2024 01:08",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum.",
            "status": "RUNNING",
            "period": "15/01/2024 a 22/01/2024",
            "last_step": "6ª de 7"
        },
        {
            "id": 14,
            "updated": "09/12/2023 01:12",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc",
            "status": "INTERRUPTED",
            "period": "01/04/2024 a 08/04/2024",
            "last_step": "1ª de 4"
        },
        {
            "id": 15,
            "updated": "15/10/2024 11:10",
            "pipeline_id": "Pipeline Anac",
            "comment": "dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel,",
            "status": "ERROR",
            "period": "15/01/2024 a 22/01/2024",
            "last_step": "6ª de 7"
        },
        {
            "id": 16,
            "updated": "27/03/2023 08:03",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac",
            "status": "COMPLETED",
            "period": "25/08/2023 a 26/08/2023",
            "last_step": "1ª de 4"
        },
        {
            "id": 17,
            "updated": "31/12/2024 20:12",
            "pipeline_id": "Pipeline Teste",
            "comment": "eleifend. Cras sed leo. Cras vehicula aliquet libero. Integer in",
            "status": "WAITING",
            "period": "30/11/2023 a 30/12/2023",
            "last_step": "3ª de 4"
        },
        {
            "id": 18,
            "updated": "30/03/2024 16:03",
            "pipeline_id": "Pipeline Anac",
            "comment": "Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor",
            "status": "COMPLETED",
            "period": "25/08/2023 a 26/08/2023",
            "last_step": "1ª de 4"
        },
        {
            "id": 19,
            "updated": "13/10/2023 14:10",
            "pipeline_id": "Nova Pipeline Para Testes",
            "comment": "et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus",
            "status": "INTERRUPTED",
            "period": "01/04/2024 a 08/04/2024",
            "last_step": "2ª de 5"
        },
        {
            "id": 20,
            "updated": "24/03/2024 09:03",
            "pipeline_id": "Pipeline Teste",
            "comment": "purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula",
            "status": "INTERRUPTED",
            "period": "06/06/2023 a 06/07/2023",
            "last_step": "2ª de 5"
        }
    ];
}


</script>

<style lang="scss" scoped>

.runsList-body {
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
}

.runsList-container {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 3px;
}

.runsList-title {
    color: #333;
    margin: 10px 0px;
}
</style>