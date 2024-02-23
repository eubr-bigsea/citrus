<template>
    <b-tabs>
        <b-tab :title="$tc('property.function', 2)" :title-link-class="'small-nav-link'">
            <div class="p-2">
                <p>
                    Para uma lista mais completa, consulte
                    <a href="https://spark.apache.org/docs/latest/api/sql/index.html" target="_blank"> a documentação do Apache Spark.</a>
                </p>
                {{ customFunctions }}
                <!--
                <div style="display:flex; gap: 2px;flex-wrap: wrap;">
                    <span v-for="f in functions" :key="f" ><a class="" :href="`#${f}`">{{ f }}</a> | </span>
                </div>
                -->
            </div>
        </b-tab>
        <b-tab :title="$tc('common.attribute', 2)" :title-link-class="'small-nav-link'">
            <div class="help-div scroll-area">
                <table class="table table-small table-sm">
                    <tbody>
                        <template v-for="ds in dataSources">
                            <tr>
                                <th class="bg-light text-black" colspan="2">
                                    {{ ds.name }}
                                    <br />{{ ds.alias }}
                                </th>
                            </tr>
                            <tr v-for="attr in ds.attributes">
                                <td>{{ attr.name }}</td>
                                <td>{{ attr.type }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </b-tab>
    </b-tabs>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    dataSources: { type: Array, default: () => [] },
    functions: { type: Array, default: () => [] },
    customFunctions: { type: Array, default: () => [] },
});
</script>
<style scoped>
div.help-div {
    max-height: 70vh;
    overflow-y: auto;
    font-size: .8em
}
</style>