<template>
    <b-modal ref="modal" size="xl" :title="$tc('workflow.variables', 2)" :ok-only="true">
        <table class="table table-bordered table-sm sheet text-center" v-if="items && items.length">
            <thead>
                <th style="width:2%"></th>
                <th style="width:8%">{{$t('variables.name')}}</th>
                <th style="width:10%">{{$t('variables.label')}}</th>
                <th style="width:20%">{{$t('variables.description')}}</th>
                <th style="width:8%">{{$t('variables.defaultValue')}}</th>
                <th style="width:8%">{{$t('variables.multiplicity')}}</th>
                <th style="width:14%">{{$t('variables.type')}}</th>
                <!--th>{{$tc('variables.parameter', 2)}}</th-->
            </thead>
            <tbody>
                <tr v-for="(row, index) in items">
                    <td>
                        <a href="#" @click.prevent.stop="remove($event, index)" :title="$t('actions.delete')" >
                            <span class="fa fa-minus-circle"></span>
                        </a>
                    </td>
                    <td>
                        <input v-model="row.name" @keypress="isNameValid($event)" maxlength="12" tabindex="0"/>
                    </td>
                    <td>
                        <input v-model="row.label" maxlength="40"/>
                    </td>
                    <td>
                        <input v-model="row.description" maxlength="100"/>
                    </td>
                    <td>
                        <input v-model="row.default_value" maxlength="50"/>
                    <td>
                        <select class="form-input" v-model="row.multiplicity" tabindex="0">
                            <option value="0">Opcional</option>
                            <option value="3">0 ou mais</option>
                            <option value="1">Exatamente 1</option>
                            <option value="2">Mais de 1</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-input" v-model="row.type">
							<option></option>
                            <option v-for="dt in dataTypes" :key="dt" :value="dt">
                                {{$t('dataTypes.' + dt)}}
                            </option>
                        </select>
                    </td>
                </tr>
            </tbody>
            </table>
            <div class="mt-2 border-top pt-2">
               <button class="btn btn-success btn-sm" @click.prevent="add">
                    <span class="fa fa-plus"></span> {{$t('actions.addItem')}}</button>
           </div>
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                dataTypes: [
                    'DATE',
                    'DECIMAL',
                    'FILE',
                    'TIME',
                    'INTEGER',
                    'CHARACTER',
                    'TEXT',
                ],
            };
        },
		props: {
			items: {type: Array, default: () => [], required: true}
		},
        methods: {
            add(e) {
                if (this.items === null) {
                    this.items = [];
                }
                this.items.push({ name: '', description: '', help: '',
					type: '', label: '', default_value: '', parameters: ''});
            },
            remove(e, index) {
                this.items.splice(index, 1);
            },

			isNameValid(evt){
                //only allow a-z, A-Z and digits 0-9
				const value = evt.target.value;
                if (!evt.key.match(/[\w\d,]/) || (value.length == 0 && evt.key.match(/\d/))) {
                  evt.preventDefault();  
                }
			},
            show() {
                this.$refs.modal.show();
            },
        }
    }
</script>
<style lang="scss">
    .sheet {
        position: relative;
        border: 1px solid #ddd;
        border-collapse: collapse;

    }

    .sheet th {
        text-align: center;
        font-weight: normal;
        background-color: #ccc;
        border-left: 1px solid #222;

    }

    .sheet td,
    .sheet th {
        padding: 0 5px !important;
        margin: 0;
        border: 1px solid #ccc;
        font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        font-size: 13px;
    }

    .sheet td input {
        border: 0 !important;
        padding: 0 !important;
        font-size: .8em;
        height: 24px;
        width: 100%;
        padding: 0 5px !important;
    }
    .sheet td input:focus {
		box-shadow:  0 0 0 1px #0074D9;
        height: 22px !important;
        margin: 1px 0;
    }
    .sheet select {
        border: 0;
        width: 100%;
        background-color: #fff;
    }
.sheet .vs__search::placeholder,
  .sheet .vs__dropdown-toggle,
  .sheet .vs__dropdown-menu {
       max-height: 25px;
       margin: 0;
       padding: 0
  }
    .table-wrapper {
        height: 300px;
        overflow-y: scroll;
    }

    .sheet th {
        background-color: #eee;
        position: sticky;
        top: -1px;
        z-index: 2;

        &:first-of-type {
            left: 0;
            z-index: 3;
            width: 150px;
        }
    }
</style>
