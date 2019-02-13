<template>
    <home-card-item-dashboard v-if="type == 'dashboard'" :item="item"></home-card-item-dashboard>
    <home-card-item-data-source v-else-if="type == 'dataSource'" :item="item"></home-card-item-data-source>
    <home-card-item-job v-else-if="type == 'job'" :item="item"></home-card-item-job>
    <home-card-item-workflow v-else-if="type == 'workflow'" :item="item"></home-card-item-workflow>
</template>

<script>
import HomeCardItemDashboard from './HomeCardItemDashboard.vue'
import HomeCardItemDataSource from './HomeCardItemDataSource.vue'
import HomeCardItemJob from './HomeCardItemJob.vue'
import HomeCardItemWorkflow from './HomeCardItemWorkflow.vue'

export default {
    name: 'home-card-item',
    props: ['type', 'item'],
    components: {
        HomeCardItemDashboard,
        HomeCardItemDataSource,
        HomeCardItemJob,
        HomeCardItemWorkflow,
    }
}
</script>