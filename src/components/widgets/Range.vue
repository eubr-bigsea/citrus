<template>
    <div class="clear mb-4">
        <LabelComponent :field="field" <LabelComponent :field="field"></LabelComponent>
        <input type="range" maxlenght="10" class="slider" :value="split" min="1" max="99" @input="updated($event)" :required="field.required"
        />
        <div class="float-left">{{split || 0}}%</div>
        <div class="float-right text-right">{{100-split}}%</div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    export default {
        components: { LabelComponent },
        data() {
            return {
                split: 50
            }
        },
        mounted() {
            this.split = this.value || 50;
        },
        methods: {
            updated:
                _.debounce(function (e) {
                    this.split = parseInt(e.target.value);
                    this.$root.$emit(this.message, this.field, e.target.value);
                }, 500)
        },

        props: {
            value: {
                type: Number, default: 50,
            }, field: {},
            message: {
                type: String,
                default: 'update-form-field-value'
            }
        },

    }
</script>
<style scoped>
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #888;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }
</style>