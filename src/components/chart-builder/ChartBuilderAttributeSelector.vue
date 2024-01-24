<template>
    <v-select v-model="model" :options="attributes" label="name" :reduce="(opt) => opt.name" :searchable="true">
        <template #option="{ type, name }">
            <font-awesome-icon
                :icon="(type === 'CHARACTER') ? 'fa fa-font' : 'fa fa-hashtag'" />
            {{ name }}
        </template>

        <template #selected-option="{ type, name }">
            <div>
                <font-awesome-icon
                    :icon="(type === 'CHARACTER') ? 'fa fa-font' : 'fa fa-hashtag'" />
                {{ name }}
            </div>
        </template>
    </v-select>
</template>
<script setup>
import vSelect from 'vue-select';
const model = defineModel();
const props = defineProps(
    {
        attributes: {type: Array, required: true},
    }
)
</script>