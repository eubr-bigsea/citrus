<template>
    <HomeCardItemBase>
        <template #head>
            <router-link :to="{name: 'editDataSource', params: {id: item.id}}"
                         :title="item.name">
                {{item.id}} - {{item.name}}
            </router-link>
        </template>
        <template #body>
            {{item.description}}
        </template>
        <template #footer>
            <small class="text-muted">{{getStatus()}} · {{$filters.timeFromNow(item.updated, $locale)}}</small>
            <span :class="['badge', getFormatBadgeColor()]">{{item.format}}</span>
        </template>
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard.js'
import HomeCardItemBase from './HomeCardItemBase.vue'

export default {
    name: 'HomeCardItemDataSource',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
}
</script>
