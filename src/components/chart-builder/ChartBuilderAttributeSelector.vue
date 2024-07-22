<template>
    <div>
        <v-select :value="props.value" :options="options" label="name" :reduce="(opt) => opt.name" :searchable="true"
            class="select2-small" @input="select" :multiple="props.multiple">
            <template #option="{ type, name }">
                <span v-if="name !== '*'"
                    :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                {{ name }}
            </template>

            <template #selected-option="{ type, name }">
                <div>
                    <span v-if="name !== '*'"
                        :class="{ 'fa fa-font': type === 'CHARACTER', 'fa fa-hashtag': type !== 'CHARACTER' }"></span>
                    {{ name }}
                </div>
            </template>
        </v-select>
    </div>
</template>
<script setup>
const props = defineProps({
    options: { type: Array, default: () => [] },
    value: {
        type: [String, Array], required: true
    },
    multiple: {type: Boolean, default: false}
});
const emit = defineEmits(['update:modelValue', 'input'])
const select = (selected) => {
    emit('update:modelValue', selected);
    emit('input', selected); //Vue 2.x compatibility https://stackoverflow.com/a/69681998/1646932
};
</script>
<style scoped>
.select2-small {
    zoom: .8
}
</style>
