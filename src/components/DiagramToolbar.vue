<template>

    <div class="toolbar">
        <div class="toolbar-group">
            <button type="button" @click.prevent="toggleTasksPanel" :title="$t('actions.toggleTasks')">
                <span class="fa fa-plus"></span> Adicionar operação
            </button>
        </div>

        <div class="toolbar-group">
            <button type="button" @click.prevent="toggleTasks" :title="$t('actions.toggleTasks')">
                <span class="fa fa-toggle-on"></span>
            </button>
            <button type="button" @click.prevent="removeSelected" :title="$t('actions.removeSelected')">
                <span class="fa fa-trash"></span>
            </button>
        </div>

        <div class="toolbar-group">
            <button variant="secondary" @click.prevent="copy" :title="$t('actions.copy')" :disabled="!taskSelected">
                <span class="fa fa-copy"></span>
            </button>
            <button variant="secondary" @click.prevent="paste" :title="$t('actions.paste')" :disabled="copiedTasks === null || copiedTasks.length === 0">
                <span class="fa fa-paste"></span>
            </button>
        </div>
    
        <div class="toolbar-group">
            <button type="button" @click.prevent="align('left', 'min')" :title="$t('actions.alignLeft')">
                <span class="object-align-left"></span>
            </button>
            <button type="button" @click.prevent="align('left', 'center')" :title="$t('actions.centerHorizontal')">
                <span class="object-align-center"></span>
            </button>
            <button type="button" @click.prevent="align('left', 'max')" :title="$t('actions.alignRight')">
                <span class="object-align-right"></span>
            </button>
            <button type="button" @click.prevent="distribute('horizontal', 'left')"
                :title="$t('actions.distributeHorizontally')">
                <span class="object-align-distribute"></span>
            </button>
        </div>
    
        <div class="toolbar-group">
            <button type="button" @click.prevent="align('top', 'min')" :title="$t('actions.alignTop')">
                <span class="object-align-top"></span>
            </button>
            <button type="button" @click.prevent="align('top', 'center')" :title="$t('actions.centerVertical')">
                <span class="object-align-center-v"></span>
            </button>
            <button type="button" @click.prevent="align('top', 'max')" :title="$t('actions.alignBottom')">
                <span class="object-align-bottom"></span>
            </button>
            <button type="button" @click.prevent="distribute('vertical', 'top')"
                :title="$t('actions.distributeVertically')">
                <span class="object-align-distribute-v"></span>
            </button>
    
        </div>
        
        <div class="toolbar-group">

            <button type="button" @click.prevent="changeZoom(-.1)" :title="$t('actions.toggleTasks')">
                <span class="fa fa-search"></span>
            </button>

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
            
            <button type="button" @click.prevent="changeZoom(.1)" :title="$t('actions.toggleTasks')">
                <span class="fa fa-search"></span>
            </button>

        </div>
    </div>

</template>

<style scoped lang="scss">
    /* .toolbar {
        position: absolute;
        top: 4px;
        z-index: 1;
    } */

    .toolbar-group {
        display: inline-block;
        border-right: 1px solid rgba(var(--font-color-rgb), .16);
        padding: .25rem;

        button {
            outline: none;
            text-align: center;
            min-width: 35px;
            border: none;
            background: transparent;
            padding: .25rem .5rem;
            color: #4B4E51;
            border-radius: 6px;
            vertical-align: middle;

            &:hover {
                background-color: rgba(var(--font-color-rgb), .16);
            }

            &:active {
                background-color: rgba(var(--font-color-rgb), .24);
            }
        }

        .zoom {
            width: 75px !important;
            display: inline-block;

            select {
                width: 100%;
                border-radius: 25px;
                background-color: rgba(var(--font-color-rgb), .16);
                border: none;
            }
        }
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
            copiedTasks: Array,
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
            copy(){
                this.$root.$emit('oncopy-tasks');
            },
            paste(){
                this.$root.$emit('onpaste-tasks');
            },
            removeSelected(){
                this.$root.$emit('onremove-tasks');
            },
            toggleTasksPanel() {
                this.$root.$emit('ontoggle-tasksPanel')
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
            saveWorkflow() {
                this.$root.$emit('onsave-workflow')
            },
            saveWorkflowAs() {
                this.$root.$emit('onsaveas-workflow')
            },
            showHistory() {
                this.$root.$emit('onshow-history');
            },
            execute() {
                this.$root.$emit('onclick-execute');
            },
            changeZoom(value) {
                this.zoom += value;
                this.zoomPercent = this.zoom*100+"%";
            },
        },
        watch: {
            zoom() {
                this.$root.$emit('onzoom', this.zoom);
            }
        }
    }
</script>
