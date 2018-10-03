<template>
    <div class="row border-bottom border-left pb-2">
        <div class="col-md-6 col-sm-12">
            <b-button-toolbar>
                <b-btn size="sm" variant="outline-success mr-" @click.prevent="saveWorkflow">
                    <span class="fa fa-cogs"></span>
                    </button>
                </b-btn>
                <b-button-group size="sm" class="mx-1">
                    <b-btn size="sm" variant="primary mr-" @click.prevent="saveWorkflow" :title="$t('actions.save')">
                        <span class="fa fa-save"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="saveWorkflowAs" :title="$t('actions.saveAs')">
                        <span class="fa fa-copy"></span>
                    </b-btn>
                    <b-btn size="sm" @click.prevent="saveAsImage" :title="$t('actions.saveAsImage')">
                        <span class="fa fa-image"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="showHistory" :title="$t('actions.showHistory')">
                        <span class="fa fa-history"></span>
                    </b-btn>
                </b-button-group>


                <b-btn size="sm" @click.prevent="execute" variant="success">
                    <span class="fa fa-play"></span> Execute</b-btn>

                <b-input-group size="sm" class="w-25">
                    <b-form-input v-model="workflow.name" xdisabled></b-form-input>
                </b-input-group>
            </b-button-toolbar>
        </div>
        <div class="col-sm-12 col-md-6">
            <b-button-toolbar class="float-right">
                <b-button-group size="sm" class="mx-1">
                    <b-btn size="sm" variant="secondary" @click.prevent="align('left', 'min')" :title="$t('actions.alignLeft')">
                        <span class="object-align-left"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="align('left', 'max')" :title="$t('actions.alignRight')">
                        <span class="object-align-right"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="align('top', 'min')" :title="$t('actions.alignTop')">
                        <span class="object-align-top"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="align('top', 'max')" :title="$t('actions.alignBottom')">
                        <span class="object-align-bottom"></span>
                    </b-btn>
                </b-button-group>
                <b-button-group size="sm" class="mx-1">
                    <b-btn size="sm" variant="secondary" @click.prevent="distribute('horizontal', 'left')" :title="$t('actions.distributeHorizontally')">
                        <span class="fa fa-arrows-alt-h"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="distribute('vertical', 'top')" :title="$t('actions.distributeVertically')">
                        <span class="fa fa-arrows-alt-v"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="addGroup" :title="$t('actions.addGroup')">
                        <span class="fa fa-object-group"></span>
                    </b-btn>
                    <b-btn size="sm" variant="secondary" @click.prevent="toggleTasks" :title="$t('actions.toggleTasks')">
                        <span class="fa fa-toggle-on"></span>
                    </b-btn>
                </b-button-group>

                <b-input-group size="sm" class="mx-1" prepend="Zoom">
                    <b-form-select v-model="zoom" :options="[
                    {value: .6, text: '60%'},
                    {value: .7, text: '70%'},
                    {value: .8, text: '80%'},
                    {value: .9, text: '90%'},
                    {value: 1, text: '100%'},
                    {value: 1.1, text: '110%'},
                    {value: 1.2, text: '120%'},
                    {value: 1.3, text: '130%'},
                    {value: 1.4, text: '140%'}]"></b-form-select>
                </b-input-group>
            </b-button-toolbar>
        </div>
    </div>
</template>
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
            workflow: {}
        },
        methods: {
            toggleTasks() {

            },
            addGroup() {

            },
            distribute(mode, prop) {
                this.$root.$emit('ondistribute-tasks', mode, prop)
            },
            align(prop, fn) {
                this.$root.$emit('onalign-tasks', prop, fn)
            },
            saveAsImage() {

            },
            saveWorkflow() {

            },
            saveWorkflowAs() {

            },
            showHistory() {

            },
            execute() {

            }
        }
    }
</script>