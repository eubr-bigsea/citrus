<template>
    <HomeCardItemDashboard v-if="type == 'dashboard'"
                           :item="item" />
    <HomeCardItemDataSource v-else-if="type == 'dataSource'"
                            :item="item" />
    <HomeCardItemJob v-else-if="type == 'job'"
                     :item="item" />
    <HomeCardItemWorkflow v-else-if="type == 'workflow'"
                          :item="item" />
    <HomeCardItemApp v-else-if="type == 'app'"
                     :item="item" />
</template>

<script>
import HomeCardItemDashboard from './HomeCardItemDashboard.vue'
import HomeCardItemDataSource from './HomeCardItemDataSource.vue'
import HomeCardItemJob from './HomeCardItemJob.vue'
import HomeCardItemWorkflow from './HomeCardItemWorkflow.vue'
import HomeCardItemApp from './HomeCardItemApp.vue'

export default {
    name: 'HomeCardItem',
    components: {
        HomeCardItemDashboard,
        HomeCardItemDataSource,
        HomeCardItemJob,
        HomeCardItemWorkflow,
        HomeCardItemApp,
    },
    props: {
        type: {type: String, default: ()=> null},
        item: {type: Object, default: ()=> null}
    }
}
</script>
