<template>
    <div class="home-card">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <span v-if="icon" :class="icon"></span> 
                    {{$tc(`titles.${type}`, 2)}}
                </div>
                <home-card-counter :value="total"></home-card-counter>
            </div>
            <div class="card-body">
                <dl>
                    <home-card-item v-for="item in items" :type="type" :item="item" :key="item.id"></home-card-item>
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
        name: "home-card",
        props: ["type", "items", "total", "icon"],
        components: {
            HomeCardItem,
            HomeCardCounter
        }
    };
</script>