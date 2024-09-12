<template>
    <div class="row">
        <div class="col-md-12">
            <font-awesome-icon v-if="loading"
                               icon="spinner"
                               pulse
                               class="icon"
                               size="3x" />
            <div v-if="content.type.name === 'html'">
                <p v-html="content.html" />
            </div>
            <div v-else>
                {{content}}
            </div>
        </div>
        <div v-if="errorState"
             class="col-md-12 mt-2">
            <div class="alert alert-warning">
                {{errorMessage.message}}
            </div>
        </div>
    </div>
</template>

<script>
import Notifier from '../mixins/Notifier.js';
import axios from 'axios';
export default {
    name: 'VisualizationComponent',
    mixins: [Notifier],
    props: {
        url: {type: String, default: ''},
    },
    data() {
        return {
            content: { type: {} },
            loading: false,
            errorState: false,
            errorMessage: ''
        };
    },
    mounted() {
        const self = this;
        self.loading = true;
        axios.get(this.url).then(
            (resp) => {
                this.content = resp.data;
                this.content.html = this.content.html.replace('bootstrap/3.3.7/', 'bootstrap/4.1.3/');
            }
        ).catch(function (e) {
            self.errorState = true;
            self.errorMessage = e.response ? e.response.data : '';
        }).finally(() => {
            self.loading = false;
        });
    }
};
</script>
