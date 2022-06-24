<template>
    <h2>
        <input :title="$t('actions.rename')" :value="value" :size="titleSize" @input="$emit('input', $event.target.value)"/>
    </h2>
</template>

<style scoped>
    input {
        background-color: transparent;
        border: 1px solid transparent;
        font-size: 30px;
        font-weight: 300;
        display: inline-block;
    }

    input:hover {
        border-color: #CCC;
    }
</style>

<script>
export default {
    name: 'InputHeader',
    props: {
        value: {type: String, default: null}
    },
    computed: {
        titleSize() {
            return (this.value || '').length;
        }
    }
}
</script>
