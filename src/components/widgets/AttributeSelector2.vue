<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <textarea disabled :value="value ? value.join(', '): ''" class="form-control bold"></textarea>

        <b-link v-b-modal="'lookupModal' + field.order" variant="sm">
            <span v-if="selected === '' || selected === null ">{{$t('actions.chooseOption')}}</span>
            <span v-if="selected !== '' && selected !== null ">{{$t('actions.changeOption')}}</span>
        </b-link>
        <b-modal :id="'lookupModal' + field.order" size="lg" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')"
            ref="modal" no-fade>
            <div slot="default">
                <div class="row">
                    <!--
					<div class="col-md-12">
                        <b-form-group>
                          <b-form-checkbox-group id="checkbox-group-2" v-model="value" name="flavour-2">
                            <b-form-checkbox v-for="s in suggestions" :value="s" class="col-md-3">{{s}}</b-form-checkbox>
                          </b-form-checkbox-group>
                        </b-form-group>
					</div>
					-->
                    <div class="col-md-4 offset-md-1 p-0">
                        <strong>Available attributes:</strong>
                        <div class="options border mt-1 p-2">
                            <div v-for="(suggestion, index) in available" class="border mb-1 p-1 suggested-attr" :key="suggestion" @click="move('right', index)">
                                {{suggestion}}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 text-center mt-5 actions">
                        <b-btn @click="move('all-right', null)" variant="" size="sm">&gt;&gt;</b-btn>
                        <b-btn @click="move('all-left', null)" variant="" size="sm">&lt;&lt;</b-btn>
						<div class="border border-info">Click a item to move it between lists</div>
                    </div>
                    <div class="col-md-4">
                        <strong>Selected attributes:</strong>
                        <div class="options border mt-1 p-2">
                            <div v-for="(suggestion, index) in value" class="border mb-1 p-1 selected-attr" :key="suggestion" @click="move('left', index)">
                                {{suggestion}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="modal-footer">
                <b-btn @click="cancelModal" variant="" size="sm" class="float-right">{{$t('actions.cancel')}}</b-btn>
                <b-btn @click="okModal" variant="success mr-1" size="sm" class="float-right">{{$t('common.ok')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import vSelect from "vue-select";
    import LabelComponent from './Label.vue'
    export default {
        components: {
            'v-select': vSelect,
            LabelComponent
        },
        computed: {
            params() {
                let result = null;
                if (this.field.values) {
                    result = JSON.parse(this.field.values);
                }
                return result;
            },
            available() {
                return this.suggestions.filter(x => this.value === null || ! this.value.includes(x));
            },
            selected: {
                get() {
                    return this.value || this.field.default;
                },
                set(newValue) {
                    this.value = newValue;
                }
            }
        },
		data(){
			return {
				originalValue: { default: []}
			}
		},
		mounted(){
			this.originalValue = this.value;
		},
        methods: {
            move(direction, index){
                if (direction === 'all-right'){
					let sel = [];
                    this.suggestions.forEach((v) => {sel.push(v)});
                    this.updated(sel);
                } else if (direction === 'all-left'){
                    this.updated([]);
                } else if (direction === 'right'){
					this.value.push(this.available[index]);
				} else if (direction == 'left') {
					this.updated(this.value.filter((a, i) =>  i!== index));
				}
            },
            updated(val) {
                this.$root.$emit(this.message, this.field, val);
            },
			okModal(){
                this.$refs.modal.hide();
			},
            cancelModal() {
				this.value = [... this.originalValue]
                this.$refs.modal.hide();
            },
        },
        props: {
            value: "", field: null, suggestions: { required: true },
            message: {
                type: String,
                default: 'update-form-field-value'
            },
            suggestions: { default: []}
        },
    }
</scripti>
<style scoped>
  div.options {
      height: 300px;
      overflow: auto;
-webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none;   /* Firefox all */
  -ms-user-select: none;  /* IE 10+ */
   user-select: none;  /* Likely future */ 
  }
  div.options > div {
	cursor: pointer;
  }
  /* width */
  ::-webkit-scrollbar {
        width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
        background: #f1f1f1; 
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
        background: #888; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
        background: #555; 
  }
  .bold {
      font-weight: bold;
  }
  div.actions > button {
      width: 50px;
      display: block;
      margin: 5px auto;
  }
  div.suggested-attr, div.selected-attr {
      border-radius: 9px;
      padding: 5px !important;
  }
  div.selected-attr {
    background: #DDDDDD
  }
</style>
