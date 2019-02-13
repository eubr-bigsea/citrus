<template>
    <home-card-item-base>
        <template slot="head">
            <router-link :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}" :title="item.name">
                {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            <img :src="getUserAvatar()"/> {{item.user.name}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{getStatus()}} · {{item.updated | moment("from", "now")}}</small>
            <span :class="['badge', getPlatformBadgeColor()]">{{this.item.platform.slug}}</span>
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