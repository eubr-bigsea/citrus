<template>
    <div>
        <iframe ref="iframe" width="100%"></iframe>
    </div>
</template>
<script>
    import axios from "axios";
    import Notifier from '../mixins/Notifier';

    export default {
        mixins: [Notifier],
        data() {
            return { data: null }
        },
        async mounted() {
            const url = `/api/v1/caipirinha/visualizations/0/0/${this.$route.params.id}`;
            try {
                const resp = await axios.get(url);
                this.data = resp.data.data;
                const doc = this.$refs.iframe.contentWindow.document;
                doc.open();
                doc.write(this.data);
                doc.close();
            } catch (e) {
                this.error(e);
            }
        },
    }
</script>
<style scoped>
    iframe {
        height: 85vh;
        border: 1px solid #ddd;
    }
</style>
