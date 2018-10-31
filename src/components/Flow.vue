<template>
    <div class="xhide" :id="flow.id"></div>
</template>
<script>
import Vue from 'vue';

export default {
    props: {
        flow: null,
        instance: null
    },
    
    mounted() {
        this.$nextTick(() => {
            let uuids = this.flow.uuids;
            if (! uuids) {
                uuids = [`${this.flow['source_id']}/${this.flow['source_port']}`, 
                    `${this.flow['target_id']}/${this.flow['target_port']}`];
            }
            if (!this.flow.connection){
                this.connection = this.instance.connect({uuids: uuids});
            } else {
                this.connection = this.flow.connection;
                this.flow.connection = null;
            }
            if (this.connection){
                let currentStyle = this.connection.getPaintStyle();
                currentStyle['strokeStyle'] = this.connection.endpoints[0].getPaintStyle().fillStyle;
                currentStyle['stroke'] = this.connection.endpoints[0].getPaintStyle().fill;
                this.connection.setPaintStyle(currentStyle);
            }
        });
    },
}
</script>