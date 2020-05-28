<template>
    <b-modal ref="modal" size="xl" :title="$tc('workflow.variables', 2)" :ok-only="true">
        <div class="table-wrapper">
            <b-table :items="items" :fields="fields" :class="'sheet'">
                <template v-slot:cell(name)="row">
                    <input v-model="row.item.name" @keyup.enter="$event.target.nextElementSibling.focus()" />
                </template>
                <template v-slot:cell(description)="row">
                    <input v-model="row.item.description" />
                </template>

                <template v-slot:cell(type)="row">
                    <select v-model="row.item.type">
                        <option v-for="dt in dataTypes" :key="dt">
                            {{$t('dataTypes.' + dt)}}
                        </option>
                    </select>
                </template>
                <template v-slot:cell(multiplicity)="row">
                    <input v-model="row.item.multiplicity" type="number"/>
                </template>

                <template v-slot:cell(default_value)="row">
                    <input v-model="row.item.default_value" />
                </template>
            </b-table>
        </div>
        {{ items }}
    </b-modal>
</template>
<script>
    export default {
        data() {
            return {
                dataTypes: {
                    type: Object,
                    default: () => [
                    //'BINARY',
                    //'CHARACTER',
                    //'DOUBLE',
                    'DECIMAL',
                    'DATE',
                    //'DATETIME',
                    'FILE',
                    //'FLOAT',
                    'INTEGER',
                    //'LONG',
                    'TEXT',
                    'TIME',
                    //'TIMESTAMP',
                    //'VECTOR'
                ]}
                ,

                fields: [{ Name: "name", Description: 'description' }],
                items: [
                    {
                        name: "Joe", description: 'Description', default_value: 23, multiplicity: 1,
                        type: 'text'
                    },
                    {
                        name: "Sue", description: 'Description', default_value: 23, multiplicity: 2,
                        type: 'text'
                    },
                ]
            };
        },
        methods: {
            show() {
                this.$refs.modal.show();
            }
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
    }

    .sheet select {
        border: 0;
        width: 100%;
        background-color: #fff;
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
