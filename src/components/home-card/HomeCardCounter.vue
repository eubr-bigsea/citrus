<template>
    <span class="home-card-counter float-end"
          title="Total">
        <animated-number :value="value" :speed="10" />
    </span>
</template>

<script>
import AnimatedNumber from "@/components/AnimatedNumber.vue";
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

<style scoped>
span.home-card-counter {

  font-size: 12px;
  color: #FFF;
  background-color: var(--primary-color);
  border-radius: 4px;
  min-width: 30px;
  text-align: center;
  margin-left: auto;
}
</style>
