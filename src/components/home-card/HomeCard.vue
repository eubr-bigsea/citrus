<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{$tc(`titles.${type}`, 2)}} <home-card-counter :value="total"></home-card-counter></h5>
            <hr>
            <dl>
                <home-card-item v-for="item in items" :type="type" :item="item" :key="item.id"></home-card-item>
                <div v-if="items.length == 0">
                    {{ $t('common.noData')}}
                </div>

            </dl>
            <router-link :to="{name: `${type}s`}" class="card-link">{{$t('common.more')}}</router-link>
        </div>
    </div>
</template>

<script>
import HomeCardItem from './home-card-item/HomeCardItem.vue'
import HomeCardCounter from './HomeCardCounter.vue'

export default {
    name: 'home-card',
    props: ['type', 'items', 'total'],
    components: {
        HomeCardItem,
        HomeCardCounter,
    }
}
</script>
