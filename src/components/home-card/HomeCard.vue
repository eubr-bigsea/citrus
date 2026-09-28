<template>
    <div class="home-card" :style="{'--card-accent': accentColor}">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <span v-if="icon" :class="icon" />
                    {{$t(`titles.${type}`, 2)}}
                </div>
                <HomeCardCounter :value="total" />
            </div>
            <div class="card-body">
                <div v-if="loading" class="home-card-loading text-muted">
                    {{$t('common.loading')}}...
                </div>
                <div v-else>
                    <HomeCardItem v-for="item in items" :key="item.id" :type="type" :item="item" />
                    <div v-if="items.length == 0" class="home-card-empty text-muted">
                        <span v-if="icon" :class="icon" />
                        {{$t('common.noData')}}
                    </div>
                </div>
                <div v-if="!loading && items.length > 0 && type !== 'app'" class="text-end">
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

// one accent hue per resource type, harmonized with --primary-color
const TYPE_ACCENTS = {
    dataSource: '#3d78a8',
    workflow: '#568f32',
    job: '#b0763a',
    app: '#7a5da0',
    dashboard: '#2f8f7a'
};

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
        icon: { type: String, default: () => null },
        loading: { type: Boolean, default: () => false }
    },
    computed: {
        accentColor() {
            return TYPE_ACCENTS[this.type] || 'var(--primary-color)';
        }
    }
};
</script>

<style scoped>
.home-card-item :deep(img) {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
    border: 1px solid #ccc;
}
.home-card-item :deep(a) {
    color: #77a640;
    text-decoration: none;
}
.home-card {
    border: 1px solid #ddd;
    border-top: 3px solid var(--card-accent);
    border-radius: 5px;
    height: 100%;
}

.home-card:deep(.card) {
    min-height: 160px;
    height: 100%;
}

.home-card:deep(.card-header) {
    display: flex;
}

.home-card .card-title .fa,
.home-card .card-title [class*="fa-"] {
    color: var(--card-accent);
}

.home-card-loading,
.home-card-empty {
    text-align: center;
    padding: 24px 0;
}

.home-card-empty .fa,
.home-card-empty [class*="fa-"] {
    display: block;
    font-size: 24px;
    margin-bottom: 6px;
    opacity: 0.4;
}

.bottom-right {
    position: absolute;
    right: 20px;
    bottom: 18px;
}
</style>
