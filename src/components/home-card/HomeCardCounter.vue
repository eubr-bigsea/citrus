<template>
  <span class="home-card-counter float-right" title="Total">
    <AnimatedNumber
      :value="value"
      :format-value="formatValue"
      :duration="4000"
      :easing="'easeOutCirc'"
    />
  </span>
</template>

<style scoped>
span.home-card-counter {

  font-size: 12px;
  color: #FFF;
  background-color: var(--primary-color);
  border-radius: 4px;
  padding: .1rem .25rem;
  min-width: 30px;
  text-align: center;
  margin-left: auto;
}
</style>

<script>
import AnimatedNumber from "animated-number-vue";
import Humanize from "humanize-plus";

export default {
  name: "HomeCardCounter",
  components: {
    AnimatedNumber
  },
  props: {
      value: {
          type: Number, default: () => 0
      }
  },
  methods: {
    formatValue(value) {
      return Humanize.compactInteger(value);
    }
  }
};
</script>
