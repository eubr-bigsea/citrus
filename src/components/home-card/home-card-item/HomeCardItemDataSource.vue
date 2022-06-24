<template>
    <HomeCardItemBase>
        <template slot="head">
            <router-link :to="{name: 'editDataSource', params: {id: item.id}}" :title="item.name">
                {{item.id}} - {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            {{item.description}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{getStatus()}} · {{item.updated | timeFromNow(this.$locale)}}</small>
            <span :class="['badge', getFormatBadgeColor()]">{{item.format}}</span>
        </template>
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'HomeCardItemDataSource',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
}
</script>
