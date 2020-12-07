<template>
    <home-card-item-base>
        <template slot="head">
            <router-link :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}" :title="item.name">
                {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            <small>{{this.item.description}}</small>
        </template>
        <template slot="footer">
        </template>
    </home-card-item-base>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'home-card-item-workflow',
    mixins: [HomeCardMixin],
    components: {
        HomeCardItemBase
    }
}
</script>