<template>
    <div>
        <div class="row user-filter">
            <div class="col-md-4 mt-4">
                <div class="values pb-1 border">
                    <div v-for="(row, index) in items" :key="row.name" class="clear-fix item-list"
                         :class="{selected: selected && selected.index === row.index }"
                         @click.prevent="select(row, index)">
                        <small>{{row.name}} <em v-if="! row.name">&lt;variável sem nome&gt;</em>
                            <span v-if="row.label">({{row.label}})</span></small>
                        <a class="float-right ml-1 bn btn-sm py-0 btn-light text-danger" href="#"
                           :title="$t('actions.delete')" @click.prevent.stop="remove($event, index)">
                            <font-awesome-icon icon="fa fa-minus-circle text-danger" />
                        </a>
                    </div>
                </div>
                <button class="btn btn-success btn-sm mt-2" @click.prevent="add">
                    <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.addItem')}}
                </button>
            </div>
            <div class="col-md-8">
                <div v-if="selected" class="form-filter ">
                    <div class="row">
                        <div class="col-md-4">
                            <label>{{$t('variables.name')}}:</label>
                            <input v-model="selected.name" v-focus maxlength="40" autocomplete="off"
                                   class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.label')}}:</label>
                            <input v-model="selected.label" maxlength="40" autocomplete="off"
                                   class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label>{{$t('variables.defaultValue')}}:</label>
                            <input v-model="selected.default_value" maxlength="40" autocomplete="off"
                                   class="form-control">
                        </div>
                        <div class="col-md-12">
                            <label>{{$t('variables.description')}}:</label>
                            <textarea v-model="selected.description" autocomplete="off"
                                      class="form-control form-control-sm" rows="3" />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h5 class="text-secondary text-center mt-5">
                        <span class="text-warning fa fa-2x fa-exclamation-triangle" />
                        <br>
                        <span v-html="$t('variables.addOrSelect')" />
                    </h5>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        items: { type: Array, default: () => [], required: true },
        selected: { type: Object, default: null}
    },
    data() {
        return {
            dataTypes: [
                'DATE',
                'DECIMAL',
                'INTEGER',
                'CHARACTER',
                'BINARY',
            ],

        };
    },
    methods: {
        add() {
            if (this.items === null) {
                this.items = [];
            }
            const value = {
                name: '', description: '', label: '', default_value: '',
                parameters: { values: [], display_index: null }, index: 0,
            };
            this.selected = value;
            value.index = this.items.length;
            this.items.push(value);
        },
        remove(e, index) {
            this.items.splice(index, 1);
        },
        select(row, index) {
            console.log(this.select);
            row.index = index;
            this.selected = row;
        },
    }
};
</script>
<style>
    div.values {
        height: 300px;
        min-height: 300px;
        overflow: auto;
    }

    .form-filter,
    .form-filter select,
    .form-filter input {
        font-size: .9em
    }

    .user-filter .item-list {
        border-bottom: 1px solid #ccc;
        margin-top: 1px;
        padding: 2px 5px;
        cursor: pointer;
    }

    .user-filter .selected {
        background: #007bff;
        border: none;
        color: white;
    }

    .filter-field .nav-tabs {
        padding-left: 15px;
        margin-bottom: 0;
        border: none;
    }

    .filter-field .tab-content {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
    }
</style>
<style lang="scss" scoped>
    div.variables {
        height: 200px;
        min-height: 200px;
        ;
        overflow: auto;
    }
</style>