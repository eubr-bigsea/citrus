<template>
    <div class="clear mb-4">
        <LabelComponent :field="field"
                        :value="value" />
        <input ref="slider"
               type="range"
               maxlenght="10"
               class="slider"
               :value="split"
               min="1"
               max="99"
               :required="field.required"
               @input="updated($event)"
               @mousedown="mouseDown"
               @mouseup="mouseUp">
        <div class="float-start">
            {{values[language] ? values[language][0] : ''}}:
            {{split || 0}}%
        </div>
        <div class="float-end text-end">
            {{values[language] ? values[language][1] : ''}}:
            {{100-split}}%
        </div>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
import { debounce } from '../../util.js';
export default {
    name: 'RangeComponent',
    components: { LabelComponent },
    mixins: [Widget],
    props: {
        value: {
            type: Number, default: 50,
        },
    },
    data() {
        return {
            split: 50,
            isDragging: false,
            values: {}
        };
    },
    mounted() {
        this.values = this.field.values ? JSON.parse(this.field.values) : {};
        const sliderValue = 100*(this.field['default'] ? parseFloat(this.field['default']): 0.5);
        this.$root.$emit(this.message,
            this.field, parseInt(this.value || sliderValue));
        if (this.value){
            this.split = parseInt(this.value);
        } else {
            this.split = sliderValue;
        }
    },
    methods: {
        updated:
                debounce(function (e) {
                    this.split = parseInt(e.target.value);
                    this.$root.$emit(this.message, this.field, parseInt(e.target.value));
                }, 500),
        mouseDown() {
            this.isDragging = true;
            this.$refs.slider.addEventListener('mousemove', this.moveSlider, false);
        },
        mouseUp() {
            this.isDragging = false;
            this.$refs.slider.removeEventListener('mousemove', this.moveSlider);
        },
        moveSlider() {
            if (this.isDragging) {
                this.split = this.$refs.slider.value;
            }
        }
    },
};
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
