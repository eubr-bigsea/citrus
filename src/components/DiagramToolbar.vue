<template>
    <div class="toolbar">
        <div class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleTasksPanel">
                <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.add', {type: $tc('titles.operation').toLowerCase()})}}
            </button>
        </div>
        <div v-if="useDataSource" class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleDataSourcesPanel">
                <font-awesome-icon icon="fa fa-plus" /> {{$t('actions.add', {
                    type:
                        $tc('titles.dataSource2').toLowerCase()
                })}}
            </button>
        </div>
        <div class="toolbar-group" :class="{invisible2: !taskSelected}">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="toggleTasks">
                <font-awesome-icon icon="fa fa-toggle-on" />
            </button>
            <button type="button" :title="$t('actions.removeSelected')" @click.prevent="removeSelected">
                <font-awesome-icon icon="fa fa-trash" />
            </button>
        </div>

        <div class="toolbar-group">
            <button variant="secondary" :title="$t('actions.copy')" :class="{invisible2: !taskSelected}"
                    @click.prevent="copy">
                <font-awesome-icon icon="fa fa-copy" />
            </button>
            <button variant="secondary" :title="$t('actions.paste')" :class="{invisible2: !thereIsCopiedTask}"
                    @click.prevent="paste">
                <font-awesome-icon icon="fa fa-paste" />
            </button>
        </div>

        <div class="toolbar-group" :class="{invisible2: !tasksSelected}">
            <button type="button" :title="$t('actions.alignLeft')" @click.prevent="align('left', 'min')">
                <span class="object-align-left" />
            </button>
            <button type="button" :title="$t('actions.centerHorizontal')" @click.prevent="align('left', 'center')">
                <span class="object-align-center" />
            </button>
            <button type="button" :title="$t('actions.alignRight')" @click.prevent="align('left', 'max')">
                <span class="object-align-right" />
            </button>
            <button type="button" :title="$t('actions.distributeHorizontally')"
                    @click.prevent="distribute('horizontal', 'left')">
                <span class="object-align-distribute" />
            </button>
        </div>

        <div class="toolbar-group" :class="{invisible2: !tasksSelected}">
            <button type="button" :title="$t('actions.alignTop')" @click.prevent="align('top', 'min')">
                <span class="object-align-top" />
            </button>
            <button type="button" :title="$t('actions.centerVertical')" @click.prevent="align('top', 'center')">
                <span class="object-align-center-v" />
            </button>
            <button type="button" :title="$t('actions.alignBottom')" @click.prevent="align('top', 'max')">
                <span class="object-align-bottom" />
            </button>
            <button type="button" :title="$t('actions.distributeVertically')"
                    @click.prevent="distribute('vertical', 'top')">
                <span class="object-align-distribute-v" />
            </button>
        </div>

        <div class="toolbar-group">
            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="changeZoom(-.1)">
                <font-awesome-icon icon="fa fa-search" />
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
                ]" />
            </b-input-group>

            <button type="button" :title="$t('actions.toggleTasks')" @click.prevent="changeZoom(.1)">
                <font-awesome-icon icon="fa fa-search" />
            </button>
        </div>

        <!--
        <div class="toolbar-group toolbar-group-padding" @change="toggleDarkMode()">
            <b-form-checkbox v-model="darkMode">
                {{ $t('titles.darkMode') }}
            </b-form-checkbox>
        </div>
    -->
    </div>
</template>

<script>
export default {
    name: 'DiagramToolbar',
    props: {
        selected: {type: Array, default: () => []},
        copiedTasks: {type: Array, default: () => null},
        useDataSource: {
            type: Boolean,
            default: false
        }
    },
    emits: ['onalign-tasks', 'oncopy-tasks', 'ondistribute-tasks',
        'onpaste-tasks', 'onremove-tasks', 'ontoggle-dark-mode',
        'ontoggle-dataSources-panel', 'ontoggle-tasks',
        'ontoggle-tasks-panel', 'onzoom',
    ],
    data() {
        return {
            zoomPercent: '100%',
            zoom: 1,
            darkMode: localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false,
        };
    },
    computed: {
        taskSelected() {
            return this.selected && this.selected.length > 0;
        },
        tasksSelected() {
            return this.selected && this.selected.length > 1;
        },
        thereIsCopiedTask() {
            return this.copiedTasks.length > 0;
        }
    },
    watch: {
        zoom() {
            this.$parent.$emit('onzoom', this.zoom);
        }
    },
    
    methods: {
        copy() {
            this.$emit('oncopy-tasks');
        },
        paste() {
            this.$emit('onpaste-tasks');
        },
        removeSelected() {
            this.$emit('onremove-tasks');
        },
        toggleTasks() {
            this.$emit('ontoggle-tasks');
        },
        toggleTasksPanel() {
            this.$parent.$emit('ontoggle-tasks-panel');
        },
        toggleDataSourcesPanel() {
            this.$parent.$emit('ontoggle-data-sources-panel');
        },
        toggleDarkMode() {
            localStorage.setItem('darkMode', this.darkMode);
            this.$parent.$emit('ontoggle-dark-mode');
        },
        addGroup() {

        },
        distribute(mode, prop) {
            this.$emit('ondistribute-tasks', mode, prop);
        },
        align(prop, fn) {
            this.$emit('onalign-tasks', prop, fn);
        },
        changeZoom(value) {
            this.zoom += value;
            this.zoomPercent = this.zoom * 100 + "%";
        },
    }
};
</script>

<style>
.invisible2 {
    opacity: .3;
    pointer-events: none;
}

</style><style scoped lang="scss">
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
}</style>
