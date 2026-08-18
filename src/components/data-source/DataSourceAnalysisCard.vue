<template>
    <b-card class="analysis_card border">
        <template #header>
            <div class="float-start">
                <h6 class="mb-0">
                    {{info.attr.name}}
                </h6>
            </div>
            <div class="float-end text-end">
                <button class="btn btn-link btn-sm m-0 p-0 pe-1" @click="deleteCard">
                    <font-awesome-icon icon="edit"
                                       :title="$t('actions.edit')" />
                </button>
                <button class="btn btn-link btn-sm m-0 p-0 pe-1" @click="deleteCard">
                    <font-awesome-icon icon="trash"
                                       :title="$t('actions.delete')" />
                </button>
                <button class="btn btn-link btn-sm m-0 p-0 pe-1" @click="deleteCard">
                    <font-awesome-icon icon="refresh"
                                       :title="$t('actions.refresh')" />
                </button>
                <button class="btn btn-link btn-sm m-0 p-0" @click="deleteCard">
                    <font-awesome-icon icon="maximize"
                                       :title="$t('actions.maximize')" />
                </button>
            </div>
            <!--
            <b-dropdown id="dropdown-right" right class="m-2 float-end" variant="outline-dark" size="sm">
                <b-dropdown-item href="#" @click="deleteCard">
                    <font-awesome-icon icon="trash" /> {{ $t('actions.delete') }}
                </b-dropdown-item>
                <b-dropdown-item href="#">
                    <font-awesome-icon icon="edit" /> {{ $t('actions.edit') }}
                </b-dropdown-item>
                <b-dropdown-item href="#">
                    <font-awesome-icon icon="refresh" /> {{ $t('actions.refresh') }}
                </b-dropdown-item>
                <b-dropdown-item href="#">
                    <font-awesome-icon icon="maximize" /> {{ $t('actions.maximize') }}
                </b-dropdown-item>
            </b-dropdown>
        -->
        </template>
        <div v-for="analysis, inx in info.value" :key="inx" class="bg-light border-bottom mb-2">
            <strong>{{$t(`dataSource.analysis.${analysis.analysis}`)}}</strong>
            <ul class="measurements">
                <li>Max:</li>
                <li>Min:</li>
                <li>Avg:</li>
                <li>Std:</li>
                <li>Median:</li>
            </ul>
        </div>
    </b-card>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    emits: ['action'],
    methods: {
        editCard() {

        },
        deleteCard() {
            this.$emit('action', this.info);
        }
    }
};

</script>

<style scoped>
.analysis_card {
    display: flex;
    flex-direction: column;
    min-width: 350px;
    max-width: 400px;
    border-right: 1px solid #d9dadb;
    margin: 10px 5px;
}

.analysis_card>h6 {
    text-align: center;
}

.analysis_card_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.measurements {
    height: fit-content;
    width: 100%;
    text-decoration: none;
    list-style: none;
    text-align: start;
    padding: 0 0 0 0;
}</style>
