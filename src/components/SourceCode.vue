<template>
    <div class="row">
        <div class="col-md-8 border">
            <VuePerfectScrollbar class="scroll-area">
                <PrismEditor :code="sourceCode.source" 
                    :settings="{maxScrollbarLength: 80}" :language="sourceCode.lang" ref="prism" style="height:90vh;" />
            </VuePerfectScrollbar>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import Vue from 'vue';
    import prismjs from "prismjs";
    import "prismjs/themes/prism.css";
    import PrismEditor from 'vue-prism-editor'

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