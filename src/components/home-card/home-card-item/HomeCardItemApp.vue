<template>
    <HomeCardItemBase>
        <template #head>
            <router-link :to="{name: 'editWorkflow', params: {id: item.id, platform: item.platform.id}}"
                         :title="item.name">
                {{item.id}} - {{item.name}}
            </router-link>
        </template>
        <template #body>
            {{item.description}}
        </template>
        <template #footer />
    </HomeCardItemBase>
</template>

<script>
import HomeCardMixin from '../../../mixins/HomeCard.js';
import HomeCardItemBase from './HomeCardItemBase.vue';

export default {
    name: 'HomeCardItemWorkflow',
    components: {
        HomeCardItemBase
    },
    mixins: [HomeCardMixin]
};
</script>
