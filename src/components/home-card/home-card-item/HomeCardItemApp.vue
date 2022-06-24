<template>
    <HomeCardItemBase>
        <template slot="head">
            <router-link :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}" :title="item.name">
                {{item.id}} - {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            {{item.description}}
        </template>
        <template slot="footer">
        </template>
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'HomeCardItemWorkflow',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
}
</script>
