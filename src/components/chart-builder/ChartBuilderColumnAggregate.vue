<template>
    <div class="axis-attribute">
        <b-dropdown size="sm" variant="transparent text-left" ref="dropdown">
            <template #button-content>
                <span class="fa fa-chevron-down"></span> &nbsp;&nbsp;
                <span v-if="aggregation.length">{{aggregation}}({{name}})</span>
                <span v-else>{{name}}</span>
            </template>
            <b-dropdown-form class="dd-form">
                <b-form-group label="Agregação" label-for="dropdown-form-email" @submit.stop.prevent>
                    <b-select size="sm" @change="handleSelect" v-model="aggregation">
                        <option value="COUNT">COUNT</option>
                        <template v-if="numeric">
                            <!--
                            <option value="">Usar valor</option>
                            -->
                            <option value="AVG">AVG</option>
                            <option value="FIRST">FIRST</option>
                            <option value="LAST">LAST</option>
                            <option value="MAX">MAX</option>
                            <option value="MIN">MIN</option>
                            <option value="SUM">SUM</option>
                        </template>
                    </b-select>
                </b-form-group>
            </b-dropdown-form>
        </b-dropdown>
    </div>
</template>
<script>
    export default {
        name: 'column-aggregate',
        props: {
            name: { type: String, required: true },
            type: { type: String, required: true },
            f: { type: String, required: false },
        },
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
        methods: {
            handleSelect() {
                this.$refs.dropdown.hide(true);
                this.$emit("select", this.name, this.aggregation, this.type);
            }
        },
        mounted() {
            this.aggregation = this.f ? this.f : "COUNT";
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