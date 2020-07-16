<template>
    <b-modal size="lg" ref="modal" :title="$tc('workflow.setImage', 2)">
        <b-form>
            <div class="card">
               <div class="card-body">
					<label>{{$t('common.text')}}</label>
					<input type="text" maxleght="20" v-model="query" class="form-control" ref="query" v-focus/>
					<hr/>
					<button class="btn btn-sm btn-success" @click.stop.prevent="search">
						<span class="fa fa-search" :title="$t('actions.search')"></span>
                        {{$t('actions.search')}}
					</button>
				    <div v-if="results && results.length" class="thumb mt-4">
						<div v-for="(r, inx) in results">
							<img :src="r.urls.thumb" class="" @click="select(inx)"/>
						</div>
					</div>	
               </div>
            </div>
        </b-form>
        <div slot="modal-footer">
            <b-btn variant="primary btn-sm" class="float-right mr-1" @click="okClicked" :disabled="(workflow.name === '')">
                {{$t('common.ok')}}
            </b-btn>
        </div>
    </b-modal>
</template>
<script>
    import axios from 'axios';

    export default {
        components: {
        },
        props: {
            workflow: {},
        },
        data(){
            return {
				query: null, 
				results: null,
			};
        },
        mounted(){
        },
        methods: {
			async search() {
                const term = this.query;
		        const response = await axios.get('https://api.unsplash.com/search/photos', {
        			params: { query: term, per_page: 20, order_by: 'popular', content_filter: 'high'},
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
                    this.warning(this.$tc('titles.validationErrors', 2));
                }
            },
            show() {
                this.$refs.modal.show();
            },
			select(inx){
				this.workflow.image = this.results[inx].urls.small + '#'; //Add author details 
				this.$refs.modal.hide();
			}
        }
    }
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
