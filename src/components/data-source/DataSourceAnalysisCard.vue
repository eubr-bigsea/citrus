<template>
    <b-card class="analysis_card border">
        <template #header>
            <div class="float-left">
                <h6 class="mb-0">{{ info.attr }}</h6>
            </div>
            <div class="float-right text-right">
                <a class="text-secondary pr-1" href="#"><font-awesome-icon icon="edit" :title="$t('actions.edit')"/></a>
                <a class="text-secondary pr-1" href="#"><font-awesome-icon icon="trash" :title="$t('actions.delete')"/></a>
                <a class="text-secondary pr-1" href="#"><font-awesome-icon icon="refresh" :title="$t('actions.refresh')"/></a>
                <a class="text-secondary pr-1" href="#"><font-awesome-icon icon="maximize" :title="$t('actions.maximize')"/></a>
            </div>
            <!--
            <b-dropdown id="dropdown-right" right class="m-2 float-right" variant="outline-dark" size="sm">
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
        <div v-for="analysis in info.value" class="bg-light border-bottom mb-2">
            <strong>{{ $t(`dataSource.analysis.${analysis.analysis}`) }}</strong>
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
            default: {}
        }
    },
    emits: ['action'],
    methods: {
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
}
</style>
