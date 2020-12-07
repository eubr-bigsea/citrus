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

        <div v-if="items.length > 0" class="text-right">
          <b-button :to="{name: `${type}s`}" variant="outline-primary" class="bottom-right">{{$t('common.moreRecords')}}</b-button>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
.home-card {
    margin-bottom: 5px;
}
.home-card .card{
  min-height: 690px;
}
.home-card .card-header {
  display: flex;
}
.home-card .card-title {
  display: inline;
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
  props: ["type", "items", "total"],
  components: {
    HomeCardItem,
    HomeCardCounter
  }
};
</script>
