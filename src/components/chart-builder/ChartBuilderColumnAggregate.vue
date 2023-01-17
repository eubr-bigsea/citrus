<template>
    <div class="axis-attribute">
        <b-dropdown ref="dropdown"
                    size="sm"
                    variant="transparent text-left">
            <template #button-content>
                <font-awesome-icon icon="fa fa-chevron-down" /> &nbsp;&nbsp;
                <span v-if="aggregation.length">{{aggregation}}({{name}})</span>
                <span v-else>{{name}}</span>
            </template>
            <b-dropdown-form class="dd-form">
                <b-form-group label="Agregação"
                              label-for="dropdown-form-email"
                              @submit.stop.prevent>
                    <b-select v-model="aggregation"
                              size="sm"
                              @change="handleSelect">
                        <option value="COUNT">
                            COUNT
                        </option>
                        <template v-if="numeric">
                            <!--
                            <option value="">Usar valor</option>
                            -->
                            <option value="AVG">
                                AVG
                            </option>
                            <option value="FIRST">
                                FIRST
                            </option>
                            <option value="LAST">
                                LAST
                            </option>
                            <option value="MAX">
                                MAX
                            </option>
                            <option value="MIN">
                                MIN
                            </option>
                            <option value="SUM">
                                SUM
                            </option>
                        </template>
                    </b-select>
                </b-form-group>
            </b-dropdown-form>
        </b-dropdown>
    </div>
</template>
<script>
export default {
    name: 'ColumnAggregate',
    props: {
        name: { type: String, required: true },
        type: { type: String, required: true },
        f: { type: String, required: false, default: () => null },
    },
    emits: ['select'],
    data() {
        return {
            aggregation: 'COUNT'
        }
    },
    computed: {
        numeric() {
            return this.type === 'INTEGER' || this.type === 'DECIMAL';
        }
    },
    mounted() {
        this.aggregation = this.f ? this.f : "COUNT";
    },
    methods: {
        handleSelect() {
            this.$refs.dropdown.hide(true);
            this.$emit("select", this.name, this.aggregation, this.type);
        }
    },
}
</script>
<style>
    .axis-attribute .dd-form {
        min-width: 125px;

    }

    .axis-attribute .dropdown {
        width: 100%;
    }

    .axis-attribute button {
        font-size: .9em;
    }

    .axis-attribute .dd-form form {
        padding: 0px 8px !important;
        background-color: #fff;
        z-index: 0;
    }

    .vs__selected {
        z-index: unset !important;
    }
</style>
