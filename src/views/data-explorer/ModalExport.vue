<template>
    <b-modal ref="modalExport" button-size="sm" size="lg" :title="$t('actions.export')" @ok="handleOk">
        <div class="row" v-if="isDirty">
            <div class="col-12">
                <strong>Importante:</strong> O fluxo será exportado com os passos atualmente configurados neste editor,
                podendo haver
                diferenças para a versão salva do experimento. Se isso for indesejável, salve primeiro o experimento.
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <label>Nome do novo fluxo:</label>
                <input type="text" class="form-control form-control-sm" maxlength="100" v-model="newName" />
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-6">
                <label>{{$tc('titles.platform')}}:</label>
                <select class="form-control form-control-sm" v-model="platform">
                    <option value="spark">Spark</option>
                    <option value="scikit-learn">Scikit-Learn/Python</option>
                </select>
            </div>
            <div class="col-6 pt-4">
                <b-form-checkbox value="true" unchecked-value="false" v-model="exportDisabled">
                    Exportar também as tarefas desabilitadas
                </b-form-checkbox>
            </div>
        </div>
    </b-modal>
</template>
<script>
    export default {
        props: {
            name: { type: String, required: true },
            isDirty: { type: Boolean }
        },
        data() {
            return {
                newName: null,
                exportDisabled: true,
                platform: 'spark'
            }
        },
        mounted() {
            console.debug(this.name)
            this.newName = this.name;
        },
        methods: {
            show() {
                this.$refs.modalExport.show();
            },
            handleOk() {
                this.$emit("ok", { newName: this.newName, platform: this.platform, exportDisabled: this.exportDisabled });
            }
        }
    }
</script>