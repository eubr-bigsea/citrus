<template>

    <div class="toolbar">
        <div class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleTasksPanel">
                <span class="fa fa-plus"></span> {{$t('actions.add', {type: $tc('titles.operation').toLowerCase()})}}
            </button>
        </div>
        <div v-if="useDataSource" class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleDataSourcesPanel">
                <span class="fa fa-plus"></span> {{$t('actions.add', {type: $tc('titles.dataSource2').toLowerCase()})}}
            </button>
        </div>
        <div class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleTasks">
                <span class="fa fa-toggle-on"></span>
            </button>
            <button type="button" :title="$t('actions.removeSelected')" @click.prevent="removeSelected">
                <span class="fa fa-trash"></span>
            </button>
        </div>

        <div class="toolbar-group">
            <button variant="secondary" :title="$t('actions.copy')" :disabled="!taskSelected" @click.prevent="copy">
                <span class="fa fa-copy"></span>
            </button>
            <button variant="secondary" :title="$t('actions.paste')" :disabled="copiedTasks === null || copiedTasks.length === 0" @click.prevent="paste">
                <span class="fa fa-paste"></span>
            </button>
        </div>
    
        <div class="toolbar-group">
            <button type="button" :title="$t('actions.alignLeft')" @click.prevent="align('left', 'min')">
                <span class="object-align-left"></span>
            </button>
            <button type="button" :title="$t('actions.centerHorizontal')" @click.prevent="align('left', 'center')">
                <span class="object-align-center"></span>
            </button>
            <button type="button" :title="$t('actions.alignRight')" @click.prevent="align('left', 'max')">
                <span class="object-align-right"></span>
            </button>
            <button type="button" :title="$t('actions.distributeHorizontally')"
                @click.prevent="distribute('horizontal', 'left')">
                <span class="object-align-distribute"></span>
            </button>
        </div>
    
        <div class="toolbar-group">
            <button type="button" :title="$t('actions.alignTop')" @click.prevent="align('top', 'min')">
                <span class="object-align-top"></span>
            </button>
            <button type="button" :title="$t('actions.centerVertical')" @click.prevent="align('top', 'center')">
                <span class="object-align-center-v"></span>
            </button>
            <button type="button" :title="$t('actions.alignBottom')" @click.prevent="align('top', 'max')">
                <span class="object-align-bottom"></span>
            </button>
            <button type="button" :title="$t('actions.distributeVertically')"
                @click.prevent="distribute('vertical', 'top')">
                <span class="object-align-distribute-v"></span>
            </button>
        </div>
        
        <div class="toolbar-group">

            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="changeZoom(-.1)">
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
            
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="changeZoom(.1)">
                <span class="fa fa-search"></span>
            </button>

        </div>

        <div class="toolbar-group toolbar-group-padding" @change="toggleDarkMode()">
            <b-form-checkbox v-model="darkMode">
                {{$t('titles.darkMode')}}
            </b-form-checkbox>
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
        &.toolbar-group-padding {
            padding: .25rem 1rem;
        }

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
        props: {
            selected: {type: Array, default: () => null},
            copiedTasks: {type: Array, default: () => null},
            useDataSource: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                zoomPercent: '100%',
                zoom: 1,
                darkMode: localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false,
            }
        },
        computed: {
            taskSelected(){
                return this.selected && this.selected.length > 0;
            },
            tasksSelected(){
                return this.selected && this.selected.length > 1;
            },
        },
        watch: {
            zoom() {
                this.$root.$emit('onzoom', this.zoom);
            }
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
            toggleDataSourcesPanel() {
                this.$root.$emit('ontoggle-dataSourcesPanel')
            },
            toggleTasks() {
                this.$root.$emit('ontoggle-tasks')
            },
            toggleDarkMode() {
                localStorage.setItem('darkMode', this.darkMode);
                this.$root.$emit('ontoggle-darkMode')
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
        }
    }
</script>
