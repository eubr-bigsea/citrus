<template>
    <div>
        <LabelComponent :field="field"></LabelComponent>
        <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
            class="form-control input-sm code"
            @keyup="updated" :value="value === null ? field.default: value"></textarea>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default{
        components: {LabelComponent},
        methods: {
            updated: _.debounce(function (e) {
                let content = e.target.value || e.target.textContent;
                this.$root.$emit('update-form-field-value', this.field, content);
            }, 500)
        },
        props: { value: 0, field: null },

    }
</script>
<style scoped>
    .code {
        height: 200px;
        font-family: Courier New, Courier, monospace;
        font-size: .8em
    }
</style>