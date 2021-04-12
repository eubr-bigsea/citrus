<template>
    <div class="chart-builder-column-item">
        <div class="type">
            <span :class="type[column.type].icon" :style="{color: type[column.type].color}"></span>
        </div>
        <div class="label">
            {{ column.label }}
        </div>
        <div v-if="remove" class="remove">
            <span @click="removeItem()" class="fa fa-trash" />
        </div>
    </div>
</template>
<script>
  export default {
    props: {
        column: Object,
        remove: Object
    },
    data() {
      return {
          type: {
              date: { icon: "fas fa-fw fa-calendar", color: "#18c7a7" },
              int: { icon: "fas fa-fw fa-hashtag", color: "#38b1ea" },
              string: { icon: "fas fa-fw fa-font", color: "#f5b629" },
          }
      }
    },
    computed: {
    },
    methods: {
        removeItem(){
            this.$root.$emit('chartBuilderRemoveAxisItem', this.remove);
        }
    }
  }
  </script>
  <style scoped lang="scss">

        .chart-builder-column-item {
            cursor: move;
            background-color: #fff;
            border: 1px solid rgba(#000, .08);
            padding: .75rem;
            margin: .25rem 0;
            display: flex;
            flex-direction: row;
            white-space: nowrap;


            div {
                width: 100%;
            }

            .type {
                max-width: 30px;
                text-align: left;
            }

            .remove {
                margin-left: 1rem;
                color: #dc3545;
                opacity: .3;
                cursor: pointer;

                &:hover {
                    opacity: .75;
                }
            }
        }
  </style>
  