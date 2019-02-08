<template>

    <PrismEditor :code="sourceCode.source" :settings="{maxScrollbarLength: 30}" :language="sourceCode.lang" ref="prism"
        :autoStyleLineNumbers="true" :lineNumbers="true" 
        style="height:80vh;font-size:.9em; width: 60vw; overflow-x:hidden" />

</template>
<script>
    import axios from 'axios';
    import Vue from 'vue';
    import prismjs from "prismjs";
    import "prismjs/themes/prism.css";
    import PrismEditor from 'vue-prism-editor'
    import "vue-prism-editor/dist/VuePrismEditor.css";

    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    const standUrl = process.env.VUE_APP_STAND_URL;
    export default {
        mounted: function () {
            const self = this;
            const url = `${standUrl}/jobs/${this.job}/source-code`;
            axios.get(url).then(resp => {
                self.sourceCode = resp.data;
            });
        },
        components: {
            VuePerfectScrollbar,
            PrismEditor,
        },
        props: {
            job: 0,
            visualizationId: '',
        },
        data() {
            return {
                sourceCode: ''
            };
        },
    }
</script>
<style scoped>
    pre[class*="language-"] {
        border: none !important
    }
</style>