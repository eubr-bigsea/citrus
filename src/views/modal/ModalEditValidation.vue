<template>
    <b-modal id="edit-window" ref="editWindow" size="xl" :title="'Janela de Edição'" no-stacking button-size="sm" header-bg-variant="dark" 
            header-text-variant="light" @ok="handleEditOk" @show="resetEditModal">

        <form ref="editForm" @submit.prevent="handleEditSubmit">
            <div class="row" align-v="center">
                <div class="col-md-10">
                    <b-form-group :label="$t('common.name')" label-for="name-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="nameState">
                        <b-form-input
                            id="name-input"
                            v-model="validation.name"
                            type="text"
                            :state="nameState"
                            required>
                        </b-form-input>
                    </b-form-group>
                </div>

                <div class="col-md-2">
                    <b-form-checkbox
                        id="status-checkbox"
                        v-model="validation.status"
                        name="status"
                        value="Habilitado"
                        unchecked-value="Desabilitado"
                    >{{ $t('common.enabled') }}</b-form-checkbox>
                </div>
            </div>

            <b-form-group label="Agendamento" label-for="schedule-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="scheduleState">
                <b-form-input
                    id="schedule-input"
                    v-model="validation.schedule"
                    type="text"
                    :state="scheduleState"
                    required>
                </b-form-input>
            </b-form-group>

        </form>



        <!-- Just to see the results -->
        <br><br>
        {{ this.validation }}<br>

    </b-modal>
</template>

<script>
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
import axios from 'axios';

export default {
    props: {
        validation: {
            type: Object,
            default: null,
        },
    },
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
        resetEditModal() {
            // this.name = this.validation.name;
            // this.schedule = this.validation.schedule;
            // this.status = this.validation.status;
            this.nameState = null;
            this.scheduleState = null;
        },
        handleEditOk(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.handleEditSubmit();
        },
        handleEditSubmit() {
            if (!this.checkEditFormValidity()) {
                return;
            }

            this.$nextTick(() => {
                this.$bvModal.hide('edit-window');
            });
        },
        checkEditFormValidity() {
            const valid = this.$refs.editForm.checkValidity();
            if(valid == true) {
                this.nameState = valid;
                this.scheduleState = valid;
            }
            else {
                this.nameState = ((this.validation.name == '') ? valid : !valid);
                this.scheduleState = ((this.validation.schedule == '') ? valid : !valid);
            }
            return valid;
        },
    }
};
</script>