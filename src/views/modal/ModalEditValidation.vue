<template>
    <b-modal id="edit-window" ref="editWindow" size="xl" :title="'Janela de Edição'" no-stacking button-size="sm" header-bg-variant="dark" 
            header-text-variant="light" @ok="handleEditOk" @show="reset" @hidden="reset">

        <form ref="editForm">
            <div class="row" align-v="center">
                <div class="col-md-10">
                    <b-form-group :label="$t('common.name')" label-for="name-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="nameState">
                        <b-form-input
                            id="name-input"
                            v-model="oldValidation.name"
                            type="text"
                            :state="nameState"
                            required>
                        </b-form-input>
                    </b-form-group>
                </div>

                <div class="col-md-2">
                    <b-form-checkbox
                        id="status-checkbox"
                        v-model="oldValidation.status"
                        name="status"
                        value="Habilitado"
                        unchecked-value="Desabilitado"
                    >{{ $t('common.enabled') }}</b-form-checkbox>
                </div>
            </div>

            <b-form-group label="Agendamento" label-for="schedule-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="scheduleState">
                <b-form-input
                    id="schedule-input"
                    v-model="oldValidation.schedule"
                    type="text"
                    :state="scheduleState"
                    required>
                </b-form-input>
            </b-form-group>

        </form>



        <!-- Just to see the results -->
        <br><br>
        {{ this.oldValidation }}<br>

    </b-modal>
</template>

<script>
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
import axios from 'axios';

export default {
    props: {
        oldValidation: {
            type: Object,
            default: null,
        },
    },
    emits: ['newValidation'],
    data() {
        return {
            // name: '',
            // schedule: '',
            // status: 'Desabilitado',
            nameState: null,
            scheduleState: null,
        }
    },
    methods: {
        reset() {
            // this.name = this.oldValidation.name;
            // this.schedule = this.oldValidation.schedule;
            // this.status = this.oldValidation.status;
            this.nameState = null;
            this.scheduleState = null;
        },
        checkEditFormValidity() {
            const valid = this.$refs.editForm.checkValidity();
            if(valid == true) {
                this.nameState = valid;
                this.scheduleState = valid;
            }
            else {
                this.nameState = ((this.oldValidation.name == '') ? valid : !valid);
                this.scheduleState = ((this.oldValidation.schedule == '') ? valid : !valid);
            }
            return valid;
        },
        handleEditOk(bvModalEvent) {
            bvModalEvent.preventDefault();
            
            if (!this.checkEditFormValidity()) {
                return;
            }

            this.$nextTick(() => {
                this.insertValidation();
                this.$bvModal.hide('edit-window');
            });
        },
        insertValidation() {
            this.$emit('newValidation', this.oldValidation);
        },
    }
};
</script>