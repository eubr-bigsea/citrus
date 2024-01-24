<template>
    <div class="row">
        <div class="col-6">
            <small class="form-text text-muted">Latitude:</small>
            <chart-builder-attribute-selector :attributes="attributes" v-model="latitude" class="select2-small" />

            <small class="form-text text-muted">Longitude:</small>
            <chart-builder-attribute-selector :attributes="attributes" v-model="longitude" class="select2-small" />
        </div>
        <div class="col-6">
            <div class="row">
                <div class="col-6">
                    <small class="form-text text-muted">Cor (opcional):</small>
                    <chart-builder-attribute-selector :attributes="attributes" v-model="colorAttribute"
                        class="select2-small" />

                    <small class="form-text text-muted">Tamanho (raio, opcional):</small>
                    <chart-builder-attribute-selector :attributes="attributes" v-model="sizeAttribute"
                        class="select2-small" />
                </div>
                <div class="col-6">
                    <small class="form-text text-muted">Texto (opcional):</small>
                    <chart-builder-attribute-selector :attributes="attributes" v-model="textAttribute"
                        class="select2-small" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ChartBuilderAttributeSelector from './ChartBuilderAttributeSelector.vue';
const props = defineProps({ attributes: { type: Array, required: true } });
const latitude = defineModel('latitude');
const longitude = defineModel('longitude');
const colorAttribute = defineModel('colorAttribute');
const sizeAttribute = defineModel('sizeAttribute');
const textAttribute = defineModel('textAttribute');
</script>
<style scoped>
.select2-small {
    zoom: .8
}
</style>