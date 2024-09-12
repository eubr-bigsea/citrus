<template>
    <b-list-group>
        <b-list-group-item v-for="opt, inx in options" :key="inx" :to="{ name: opt.route, params: { id: $route.params.id } }"
                           :active="selected === opt.route">
            {{$t(opt.title)}}
        </b-list-group-item>
    </b-list-group>
</template>

<script>
export default {
    props: {
        selected: { type: String, required: true },
    },
    data() {
        return {
            options: [
                { route: 'editDataSource', title: 'titles.configuration' },
                { route: 'dataSourceStorage', title: 'titles.storage' },
                //{ route: 'dataSourceValidation', title: 'titles.validation' },
                //{ route: 'dataSourceFeatureGeneration', title: 'dataSource.featureGeneration' },
                //{ route: 'dataSourceAnalysis', title: 'titles.analysis' },
            ]
        };
    }
};
</script>