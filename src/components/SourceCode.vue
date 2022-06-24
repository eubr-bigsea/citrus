<template>

    <PrismEditor ref="prism" :code="sourceCode.source || ''" :settings="{maxScrollbarLength: 30}" :language="sourceCode.lang"
        :auto-style-line-numbers="true" :line-numbers="true" readonly
        style="height:80vh;font-size:.9em; overflow-x:hidden" />

</template>
<script>
    import axios from 'axios';
    import "prismjs/themes/prism.css";
    import PrismEditor from 'vue-prism-editor'
    import "vue-prism-editor/dist/VuePrismEditor.css";

    const standUrl = process.env.VUE_APP_STAND_URL;
    export default {
        components: {
            PrismEditor,
        },
        props: {
            job: {type: Number, default: 0},
            visualizationId: {type: Number, default: 0}
        },
        data() {
            return {
                sourceCode: ''
            };
        },
        mounted: function () {
            const self = this;
            const url = `${standUrl}/jobs/${this.job}/source-code`;
            axios.get(url).then(resp => {
                self.sourceCode = resp.data;
            });
        },
    }
</script>
<style>
    .prism-editor__code {
        background: #fff !important;
        border: none;
    }
    .prism-editor__line-numbers {
        background: #fff !important;
    }
</style>
