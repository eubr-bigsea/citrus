<template>
    <b-button-toolbar class="toolbar">
        <b-button-group size="sm" class="mx-1">
            <b-btn variant="secondary" @click.prevent="removeSelected" :title="$t('actions.removeSelected')" :disabled="!taskSelected">
                <span class="fa fa-trash"></span>
            </b-btn>
        </b-button-group>
        <b-button-group size="sm" class="mx-1">
            <b-btn variant="secondary" @click.prevent="align('left', 'min')" :title="$t('actions.alignLeft')" :disabled="!tasksSelected">
                <span class="object-align-left"></span>
            </b-btn>
            <b-btn variant="secondary" @click.prevent="align('left', 'max')" :title="$t('actions.alignRight')" :disabled="!tasksSelected">
                <span class="object-align-right"></span>
            </b-btn>
            <b-btn variant="secondary" @click.prevent="align('top', 'min')" :title="$t('actions.alignTop')" :disabled="!tasksSelected">
                <span class="object-align-top"></span>
            </b-btn>
            <b-btn variant="secondary" @click.prevent="align('top', 'max')" :title="$t('actions.alignBottom')" :disabled="!tasksSelected">
                <span class="object-align-bottom"></span>
            </b-btn>
        </b-button-group>
        <b-button-group size="sm" class="mx-1">
            <b-btn variant="secondary" @click.prevent="distribute('horizontal', 'left')"
                :title="$t('actions.distributeHorizontally')" :disabled="!tasksSelected">
                <span class="fa fa-arrows-alt-h"></span>
            </b-btn>
            <b-btn variant="secondary" @click.prevent="distribute('vertical', 'top')"
                :title="$t('actions.distributeVertically')" :disabled="!tasksSelected">
                <span class="fa fa-arrows-alt-v"></span>
            </b-btn>
            <!--
            <b-btn variant="secondary" @click.prevent="addGroup" :title="$t('actions.addGroup')">
                <span class="fa fa-object-group"></span>
            </b-btn>
        -->
            <b-btn variant="secondary" @click.prevent="toggleTasks" :title="$t('actions.toggleTasks')" :disabled="!taskSelected">
                <span class="fa fa-toggle-on"></span>
            </b-btn>

        </b-button-group>
        <b-input-group size="sm" class="mx-1 zoom">
            <b-form-select v-model="zoom" :options="[
                    {value: .6, text: '60%'},
                    {value: .7, text: '70%'},
                    {value: .8, text: '80%'},
                    {value: .9, text: '90%'},
                    {value: 1, text: '100%'},
                    {value: 1.1, text: '110%'},
                    {value: 1.2, text: '120%'},
                    {value: 1.3, text: '130%'},
                    {value: 1.4, text: '140%'}
                ]">
            </b-form-select>
        </b-input-group>
    </b-button-toolbar>
</template>

<style scoped>
    .toolbar {
        position: absolute;
        top: 4px;
        z-index: 1;
    }

    .zoom {
        width: 75px !important;
    }
</style>

<script>
    export default {
        name: 'DiagramToolbar',
        data() {
            return {
                zoomPercent: '100%',
                zoom: 1
            }
        },
        props: {
            selected: Array,
        },
        computed: {
            taskSelected(){
                return this.selected && this.selected.length > 0;
            },
            tasksSelected(){
                return this.selected && this.selected.length > 1;
            },
        },
        methods: {
            removeSelected(){
                this.$root.$emit('onremove-tasks');
            },
            toggleTasks() {
                this.$root.$emit('ontoggle-tasks')
            },
            addGroup() {

            },
            distribute(mode, prop) {
                this.$root.$emit('ondistribute-tasks', mode, prop)
            },
            align(prop, fn) {
                this.$root.$emit('onalign-tasks', prop, fn)
            },
        },
        watch: {
            zoom() {
                this.$root.$emit('onzoom', this.zoom);
            }
        }
    }
</script>
