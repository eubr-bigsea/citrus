<template>
    <b-modal id="edit-window" ref="editWindow" size="xl" :title="'Janela de Edição'" no-stacking button-size="sm" header-bg-variant="dark" 
            header-text-variant="light" @ok="handleEditOk" @show="resetEditModal" @hidden="resetEditModal">
        <!-- {{this.validation[0].name}} -->

        <form ref="editForm" @submit.stop.prevent="handleEditSubmit">
            <div class="row" align-v="center">
                <div class="col-md-10">
                    <b-form-group :label="$t('common.name')" label-for="name-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="nameState">
                        <b-form-input
                            id="name-input"
                            v-model="name"
                            type="text"
                            :state="nameState"
                            required>
                        </b-form-input>
                    </b-form-group>
                </div>

                <div class="col-md-2">
                    <b-form-checkbox
                        id="status-checkbox"
                        v-model="status"
                        name="status"
                        value="Habilitado"
                        unchecked-value="Desabilitado"
                    >{{ $t('common.enabled') }}</b-form-checkbox>
                </div>
            </div>

            <b-form-group label="Agendamento" label-for="schedule-input" :invalid-feedback="$t('errors.missingRequiredValue')" :state="scheduleState">
                <b-form-input
                    id="schedule-input"
                    v-model="schedule"
                    type="text"
                    :state="scheduleState"
                    required>
                </b-form-input>
            </b-form-group>

        </form>



        <!-- Just to see the results -->
        <br><br>
        {{ this.name }}<br>
        {{ this.status }}<br>
        {{ this.schedule }}<br>
        <!-- Create a new object with the new data that will be sent to the api -->
        <!-- {{ this.newValidation }}  -->

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
            name: '',
            nameState: null,
            schedule: '',
            scheduleState: null,
            status: 'Desabilitado',
        }
    },
    methods: {
        resetEditModal() {
            // alert("entrou no reset");
            // Its calling this method on show and hidden like it should, but the validation[0] data
            // that it shows is from the last call, maybe its an error on the function call (stop/prevent)


            this.name = this.validation[0].name;
            this.nameState = null;
            this.schedule = this.validation[0].schedule;
            this.scheduleState = null;
            this.status = this.validation[0].status;
        },
        handleEditOk(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.handleEditSubmit();
        },
        handleEditSubmit() {
            if (!this.checkEditFormValidity()) {
                return;
            }
            // Here I send to the api the old and the editted validations
            // (if it is a new validation (an add), I just send the new one?)
            //...

            // this.$nextTick(() => {
            //     // this.$refs.editWindow.hide();
            //     this.bvModal.hide('edit-window');
            // });
            this.bvModal.hide('edit-window');
        },
        checkEditFormValidity() {
            const valid = this.$refs.editForm.checkValidity();
            if(valid == true) {
                this.nameState = valid;
                this.scheduleState = valid;
            }
            else {
                this.nameState = ((this.name == '') ? valid : !valid);
                this.scheduleState = ((this.schedule == '') ? valid : !valid);
            }
            return valid;
        },
    }
};
</script>