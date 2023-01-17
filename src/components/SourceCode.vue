<template>
    <prism-editor ref="prism"
                  v-model="sourceCode.source"
                  line-numbers
                  :highlight="highlighter"
                  style="height:70vh;overflow-x:hidden;;"
                  class="source-editor" />
</template>
<script>
import 'vue-prism-editor/dist/prismeditor.min.css'
import axios from 'axios';

import { PrismEditor } from 'vue-prism-editor'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
//import "vue-prism-editor/dist/VuePrismEditor.css";

const standUrl = import.meta.env.VITE_STAND_URL;
export default {
    components: {
        PrismEditor,
    },
    props: {
        job: { type: Number, default: 0 },
        visualizationId: { type: Number, default: 0 }
    },
    data() {
        return {
            sourceCode: ''
        };
    },
    async mounted() {
        const url = `${standUrl}/jobs/${this.job}/source-code`;
        this.sourceCode = (await axios.get(url)).data;
    },
    methods: {
        highlighter() {
            return highlight(this?.sourceCode?.source || '', languages.py, 'py');
        },
    }
}
</script>
<style>
    .prism-editor__editor > span, .prism-editor-wrapper .prism-editor__editor {
        font-family: "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace;
    }
    div.source-editor .prism-editor__container {
        /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
        color: #222;
        /* you must provide font-family font-size line-height. Example: */
        font-size: 12px;
        line-height: 1.4;
        padding: 2px;
    }
</style>