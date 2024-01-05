<template>
    <div v-if="readOnly">
        {{label}}
    </div>
    <div v-else
         class="mb-1">
        <LabelComponent :field="field"
                        :value="value" />

        <input disabled
               :value="label"
               class="form-control">

        <b-link variant="sm"
                @click.prevent="$refs.modal.show()">
            {{$t('actions.changeOption')}}
        </b-link>

        <b-modal ref="modal"
                 size="lg"
                 :title="`${field.label} - ${label || ''}`"
                 ok-disabled
                 :cancel-title="$t('actions.cancel')"
                 no-fade>
            <small><em>{{field.help}}</em></small>

            <div class="row border-top mt-2 pt-2">
                <div class="offset-md-2 col-md-2">
                    <label for="row">{{$t('common.row', 1)}}</label>
                    <input v-model="coordinates.row"
                           type="number"
                           min="0"
                           max="100"
                           name="x"
                           class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="column">{{$t('common.column', 1)}}</label>
                    <input v-model="coordinates.column"
                           type="number"
                           min="0"
                           max="12"
                           name="y"
                           class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="width">{{$t('common.width', 1)}}</label>
                    <input v-model="coordinates.width"
                           type="number"
                           min="1"
                           max="12"
                           name="width"
                           class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="height">{{$t('common.height', 1)}}</label>
                    <input v-model="coordinates.height"
                           type="number"
                           min="1"
                           max="10"
                           name="height"
                           class="form-control">
                </div>
            </div>
            <template #modal-footer>
                <div class="w-100">
                    <b-btn variant="primary"
                           size="sm"
                           class="ml-1 float-right"
                           @click="closeModal">
                        {{$t('common.ok')}}
                    </b-btn>
                    <b-btn variant="outline-primary"
                           size="sm"
                           class="float-right"
                           @click="removeValue">
                        {{$t('actions.removeValue')}}
                    </b-btn>
                </div>
            </template>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';
export default {
    components: { LabelComponent },
    mixins: [Widget],
    data() {
        return {
            coordinates: {
                row: 1,
                column: 1,
                height: 3,
                width: 12,
            }
        };
    },
    computed: {
        label(){
            return `(${this.coordinates.row}, ${this.coordinates.column}, ${this.coordinates.width}, ${this.coordinates.height})`;
        }
    },
    mounted() {
        if (this.value){
            this.coordinates = this.value;
        }
    },
    methods: {
        removeValue() {
            this.coordinates = {
                row: 0,
                column: 0,
                height: 0,
                width: 0,
            };
            this.$root.$emit(this.message, this.field, null, null);
            this.closeModal();
        },
        closeModal() {
            this.$root.$emit(this.message, this.field, this.coordinates, null);
            this.$refs.modal.hide();
        },
    },
};

</script>