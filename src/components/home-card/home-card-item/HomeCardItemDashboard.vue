<template>
    <HomeCardItemBase>
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
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'HomeCardItemDashboard',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
}
</script>