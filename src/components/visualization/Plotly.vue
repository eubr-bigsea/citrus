<template><div ref="container" class="vue-plotly" /></template>
<script>
/* (c) https://github.com/statnett/vue-plotly/blob/master/src/Plotly.vue */
import Plotly from 'plotly.js-dist-min';
import { debounce } from '../../util.js';

const events = [
    'click',
    'hover',
    'unhover',
    'selecting',
    'selected',
    'restyle',
    'relayout',
    'autosize',
    'deselect',
    'doubleclick',
    'redraw',
    'animated',
    'afterplot'
];
const functions = [
    'restyle',
    'relayout',
    'update',
    'addTraces',
    'deleteTraces',
    'moveTraces',
    'extendTraces',
    'prependTraces',
    'purge'
];
const methods = functions.reduce((all, funcName) => {
    all[funcName] = function (...args) {
        return Plotly[funcName].apply(Plotly, [this.$refs.container].concat(args));
    };
    return all;
}, {});
export default {
    name: 'PlotlyComponent',
    props: {
        autoResize: Boolean,
        options: {
            type: Object, default: () => null
        },
        data: {
            type: Array, default: () => []
        },
        layout: {
            type: Object, default: () => null
        },
        frames: {
            type: Array, default: () => null
        }
    },
    data() {
        return {
            internalLayout: {
                ...this.layout,
                datarevision: 1
            }
        };
    },
    mounted() {
        this.react();
        this.initEvents();
        this.$watch('data', () => {
            this.internalLayout.datarevision++;
            this.react();
        }, { deep: !this.watchShallow });
        this.$watch('options', this.react, { deep: !this.watchShallow });
        this.$watch('layout', this.relayout, { deep: !this.watchShallow });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.__resizeListener);
        this.__generalListeners.forEach(obj => this.$refs.container.removeAllListeners(obj.fullName));
        Plotly.purge(this.$refs.container);
    },
    methods: {
        initEvents() {
            if (this.autoResize) {
                this.__resizeListener = () => {
                    this.internalLayout.datarevision++;
                    debounce(this.react, 200);
                };
                window.addEventListener('resize', this.__resizeListener);
            }
            this.__generalListeners = events.map((eventName) => {
                return {
                    fullName: 'plotly_' + eventName,
                    handler: (...args) => {
                        this.$emit.apply(this, [eventName].concat(args));
                    }
                };
            });
            this.__generalListeners.forEach((obj) => {
                this.$refs.container.on(obj.fullName, obj.handler);
            });
        },
        ...methods,
        toImage(options) {
            let el = this.$refs.container;
            let initial = {
                format: 'png', width: el.clientWidth,
                height: el.client
            };
            let opts = { ...initial, ...options };
            return Plotly.toImage(this.$refs.container, opts);
        },
        downloadImage(options) {
            let el = this.$refs.container;
            let opts = {
                format: 'png',
                width: el.clientWidth,
                height: el.clientHeight,
                filename: (el.layout.title || 'plot') + ' - ' + new Date().toISOString(),
                ...options
            };
            return Plotly.downloadImage(this.$refs.container, opts);
        },
        plot() {
            const fig = Plotly.plot(this.$refs.container, this.data, this.internalLayout, this.getOptions());
            if (this.frames) {
                Plotly.addFrames(this.frames);
            }
            return fig;
        },
        getOptions() {
            let el = this.$refs.container;
            let opts = this.options;
            // if width/height is not specified for toImageButton, default to el.clientWidth/clientHeight
            if (!opts) opts = {};
            if (!opts.toImageButtonOptions) opts.toImageButtonOptions = {};
            if (!opts.toImageButtonOptions.width) opts.toImageButtonOptions.width = el.clientWidth;
            if (!opts.toImageButtonOptions.height) opts.toImageButtonOptions.height = el.clientHeight;
            return opts;
        },
        newPlot() {
            debugger
            return Plotly.newPlot(this.$refs.container, this.data, this.internalLayout, this.getOptions());
        },
        react() {
            const fig = Plotly.react(this.$refs.container, this.data, this.internalLayout, this.getOptions());
            if (this.frames) {
                Plotly.addFrames(this.$refs.container, this.frames);
            }
            return fig;
        }
    }
};
</script>
<style scoped>
.vue-plotly {
    height: 100%;
}
</style>