<template>
    <b-modal ref="modal" size="lg" :title="$t('workflow.setImage', 2)">
        <b-form>
            <div class="card">
                <div class="card-body">
                    <label>{{$t('common.text')}}</label>
                    <input ref="query" v-model="query" v-focus type="text"
                           maxleght="20" class="form-control">
                    <hr>
                    <button class="btn btn-sm btn-success" @click.stop.prevent="search">
                        <font-awesome-icon icon="fa fa-search" :title="$t('actions.search')" />
                        {{$t('actions.search')}}
                    </button>
                    <div v-if="results && results.length" class="thumb mt-4">
                        <div v-for="(r, inx) in results" :key="r.urls.thumb">
                            <img :src="r.urls.thumb" class="" @click="select(inx)">
                        </div>
                    </div>
                </div>
            </div>
        </b-form>
        <template #modal-footer>
            <div>
                <b-btn variant="primary btn-sm" class="float-right mr-1" :disabled="(workflow.name === '')"
                       @click="okClicked">
                    {{$t('common.ok')}}
                </b-btn>
            </div>
        </template>
    </b-modal>
</template>
<script>
import axios from 'axios';

export default {
    components: {
    },
    props: {
        workflow: { type: Object, default: () => { } },
    },
    emits: ['update-value'],
    data() {
        return {
            query: null,
            results: null,
        };
    },
    methods: {
        async search() {
            const term = this.query;
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: { query: term, per_page: 20, order_by: 'popular', content_filter: 'high' },
                headers: {
                    Authorization: 'Client-ID AuVX7rR_5XkocYvsWBRX7qS8X_MhxzbMfQ6UmJCR0KM'
                }
            });
            this.results = response.data.results;
        },
        okClicked() {
            if (this.workflow.name && this.workflow.name.trim()) {
                this.$root.$emit('onupdate-workflow-properties');
                this.$refs.modal.hide();
            } else {
                this.warning(this.$t('titles.validationErrors', 2));
            }
        },
        show() {
            this.$refs.modal.show();
        },
        select(inx) {
            this.$emit('update-value', this.results[inx].urls.small + '#'); //Add author details
            this.$refs.modal.hide();
        }
    }
};
</script>
<style scoped>
    .thumb {
        display: flex;
        flex-wrap: wrap;
        height: 400px;
        overflow: auto
    }

    .thumb div {
        width: 20%;
        border: 1px solid #eee;
        padding: 4px;
        text-align: center;
    }

    .thumb img {
        width: 100%;
    }
</style>