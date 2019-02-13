<template>
    <home-card-item-base>
        <template slot="head">
            <router-link :to="{name: 'editDataSource', params: {id: item.id}}" :title="item.name">
                {{item.name}}
            </router-link>
        </template>
        <template slot="body">
            {{item.description}}
        </template>
        <template slot="footer">
            <small class="text-muted">{{getStatus()}} · {{item.updated | moment("from", "now")}}</small>
            <span :class="['badge', getFormatBadgeColor()]">{{this.item.format}}</span>
        </template>
    </home-card-item-base>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'home-card-item-data-source',
    mixins: [HomeCardMixin],
    components: {
        HomeCardItemBase
    }
}
</script>