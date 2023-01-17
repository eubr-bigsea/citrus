<template>
    <HomeCardItemBase>
        <template #head>
            <router-link :to="{name: 'jobDetail', params: {platform: item.workflow.platform.id, id: item.id}}"
                         :title="`${item.id} - ${item.workflow.name}`">
                {{item.id}} - {{item.workflow.name}}
            </router-link>
        </template>
        <template #body>
            <img :src="getUserAvatar()"> {{item.user.name}}
        </template>
        <template #footer>
            <small class="text-muted">{{$filters.timeFromNow(item.finished || item.created, $locale)}}</small>
            <span :class="['badge', getStatusBadgeColor()]">{{item.status}}</span>
        </template>
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard.js'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'HomeCardItemJob',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
}
</script>
