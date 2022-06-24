<template>
    <HomeCardItemBase>
        <template slot="head">
            <router-link :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}" :title="item.name">
                {{item.id}} - {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            <img :src="getUserAvatar()"/> {{item.user.name}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{getStatus()}} · {{item.updated | timeFromNow(this.$locale)}}</small>
            <span :class="['badge', getPlatformBadgeColor()]">{{item.platform.slug}}</span>
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
