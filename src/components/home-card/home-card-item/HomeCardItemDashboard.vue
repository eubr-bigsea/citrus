<template>
    <HomeCardItemBase>
        <template #head>
            <router-link :to="{name: 'dashboardDetail', params: {id: item.id}}"
                         :title="item.title">
                {{item.title}}
            </router-link>
        </template>
        <template #body>
            <img :src="getUserAvatar()"> {{item.user.name}}
        </template>
        <template #footer>
            <small class="text-muted">{{getStatus()}} · {{$filters.timeFromNow(item.updated, $locale)}}</small>
        </template>
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard.js';
import HomeCardItemBase from './HomeCardItemBase.vue';

export default {
    name: 'HomeCardItemDashboard',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
};
</script>
