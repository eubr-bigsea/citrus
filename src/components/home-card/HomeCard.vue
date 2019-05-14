<template>
  <div class="col-12 col-md-6 col-lg-3 home-card">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">{{$tc(`titles.${type}`, 2)}}</h5>
        <home-card-counter :value="total"></home-card-counter>
      </div>
      <div class="card-body">
        <dl>
          <home-card-item v-for="item in items" :type="type" :item="item" :key="item.id"></home-card-item>
          <div v-if="items.length == 0">{{ $t('common.noData')}}</div>
        </dl>
        <router-link :to="{name: `${type}s`}" class="card-link">{{$t('common.more')}}</router-link>
      </div>
    </div>
  </div>
</template>

<style>
.home-card {
  padding: 15px;
}
.home-card .card-header {
  background: none;
  display: flex;
}
.home-card .card-title {
  display: inline;
}
</style>

<script>
import HomeCardItem from "./home-card-item/HomeCardItem.vue";
import HomeCardCounter from "./HomeCardCounter.vue";

export default {
  name: "home-card",
  props: ["type", "items", "total"],
  components: {
    HomeCardItem,
    HomeCardCounter
  }
};
</script>
