<template>
    <div class="home-card">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <span v-if="icon" :class="icon" />
                    {{$t(`titles.${type}`, 2)}}
                </div>
                <HomeCardCounter :value="total" />
            </div>
            <div class="card-body">
                <dl>
                    <HomeCardItem v-for="item in items" :key="item.id" :type="type" :item="item" />
                    <div v-if="items.length == 0">
                        {{$t('common.noData')}}
                    </div>
                </dl>
                <div v-if="items.length > 0 && type !== 'app'" class="text-right">
                    <b-button size="sm" :to="{ name: `${type}s` }" variant="link" class="bottom-right">
                        {{$t('common.moreRecords')}} ...
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

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
        type: { type: String, default: () => null },
        items: { type: Array, default: () => null },
        total: { type: Number, default: () => 0 },
        icon: { type: String, default: () => null }
    }
};
</script>

<style scoped>
.home-card-item>>>img {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
    border: 1px solid #ccc;
}
.home-card-item>>>a  {
    color: #77a640
}
.home-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 5px;
    flex: 1 1 0;
    margin: 4px;
}

.home-card>>>.card {
    min-height: 690px;
}

.home-card>>>.card-header {
    display: flex;
}

.bottom-right {
    position: absolute;
    right: 20px;
    bottom: 18px;
}
</style>
