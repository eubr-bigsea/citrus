<template>
  <span class="home-card-counter float-right" title="Total">
    <animated-number
      :value="value"
      :formatValue="formatValue"
      :duration="4000"
      :easing="'easeOutCirc'"
    />
  </span>
</template>

<style scoped>
span.home-card-counter {
  background-image: linear-gradient(-56.47deg, #ff4b95, #ffca26);
  color: white;
  padding: 5px 3px;
  font-family: monospace;
  border-radius: 5px;
  height: 30px;
  min-width: 30px;
  text-align: center;
  margin-left: 5px;
  margin-left: auto;
}
</style>

<script>
import AnimatedNumber from "animated-number-vue";
import Humanize from "humanize-plus";

export default {
  name: "home-card-counter",
  props: ["value"],
  components: {
    AnimatedNumber
  },
  methods: {
    formatValue(value) {
      return Humanize.compactInteger(value);
    }
  }
};
</script>
