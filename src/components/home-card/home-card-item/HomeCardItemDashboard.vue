<template>
    <home-card-item-base>
        <template slot="head">
            <router-link :to="{name: 'dashboardDetail', params: {id: item.id}}" :title="item.title">
                {{item.title}}
            </router-link>
        </template>
        <template slot="body">
            <img :src="getUserAvatar()"/> {{item.user.name}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{getStatus()}} · {{item.updated | timeFromNow(this.$locale)}}</small>
        </template>
    </home-card-item-base>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'home-card-item-dashboard',
    mixins: [HomeCardMixin],
    components: {
        HomeCardItemBase
    }
}
</script>