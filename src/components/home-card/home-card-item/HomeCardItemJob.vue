<template>
    <home-card-item-base>
        <template slot="head">
            <router-link :to="{name: 'jobDetail', params: {platform: item.workflow.platform.id, id: item.id}}" :title="`${item.id} - ${item.workflow.name}`">
                {{item.id}} - {{item.workflow.name}}
            </router-link>
        </template>
        <template slot="body">
            <img :src="getUserAvatar()"/> {{item.user.name}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{(item.finished || item.created) | moment("from", "now")}}</small>
            <span :class="['badge', getStatusBadgeColor()]">{{this.item.status}}</span>
        </template>
    </home-card-item-base>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'home-card-item-job',
    mixins: [HomeCardMixin],
    components: {
        HomeCardItemBase
    }
}
</script>