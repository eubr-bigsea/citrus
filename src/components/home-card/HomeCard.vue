<template>
    <div class="home-card">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <span v-if="icon" :class="icon"></span> 
                    {{$tc(`titles.${type}`, 2)}}
                </div>
                <HomeCardCounter :value="total"></HomeCardCounter>
            </div>
            <div class="card-body">
                <dl>
                    <HomeCardItem v-for="item in items" :key="item.id" :type="type" :item="item"></HomeCardItem>
                    <div v-if="items.length == 0">{{ $t('common.noData')}}</div>
                </dl>
                <div v-if="items.length > 0" class="text-right">
                    <b-button size="sm" :to="{name: `${type}s`}" variant="link" class="bottom-right">
                        {{$t('common.moreRecords')}} ...</b-button>
                </div>

            </div>
        </div>
    </div>
</template>

<style>
    .home-card {
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 5px;
        flex: 1 1 0;
        margin: 4px;
    }

    .home-card .card {
        min-height: 690px;
    }

    .home-card .card-header {
        display: flex;
    }

    .bottom-right {
        position: absolute;
        right: 20px;
        bottom: 18px;
    }
</style>

<script>
    import HomeCardItem from "./home-card-item/HomeCardItem.vue";
    import HomeCardCounter from "./HomeCardCounter.vue";

    export default {
        name: "HomeCard",
        components: {
            HomeCardItem,
            HomeCardCounter
        },
        props: {
            type: {type: String, default: () => null}, 
            items: {type: Array, default: () => null}, 
            total: {type: Number, default: () => 0}, 
            icon: {type: String, default: () => null}
        }
    };
</script>
