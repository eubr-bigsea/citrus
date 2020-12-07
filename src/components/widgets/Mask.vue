<template>
    <div>
        <LabelComponent :field="field" />
        <div v-if="readOnly">
            {{value === null ? field.default: value}}
        </div>
        <div v-else>
            <input type="text" v-mask="mask" class="form-control" />
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import Widget from '../../mixins/Widget.js';
    import { debounce } from '../../util.js';
    export default {
        mixins: [Widget],
        components: { LabelComponent },
        props: {
            mask: { type: Array, default: () => [] }
        },
        data() {
            return {
                internalValue: ''
            }
        },
        mounted(){
            // this.internalValue = this.value;
        },
        methods: {
            updated: debounce(function (e) {
                this.$root.$emit(this.message, this.field, e.target.value);
            }, 500)
        },
    }
</script>