<template>
    <div>
        <div class="btn-group mr-2"
             role="group">
            <button class="btn btn-sm btn-outline-dark"
                    :title="$tc('titles.job', 2)"
                    @click.prevent="showExecutions">
                <font-awesome-icon icon="fa fa-tasks" /> {{$tc('titles.job', 2)}}
            </button>
            <button v-if="(hasAnyPermission(['APP_EDIT']) || isAdmin) && workflow.publishing_enabled"
                    class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.showVariables')"
                    @click.prevent="showVariables">
                <font-awesome-icon icon="fa fa-dollar-sign" /> Variáveis
            </button>
        </div>
        <div class="btn-group mr-2"
             role="group">
            <button class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.save')"
                    @click.prevent="saveWorkflow">
                <font-awesome-icon icon="fa fa-save"
                                   class="text-success" /> {{$t('actions.save')}}
            </button>
            <button class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.saveAs')"
                    @click.prevent="saveWorkflowAs">
                <font-awesome-icon icon="fa fa-copy" /> {{$t('actions.saveAs')}}...
            </button>
        </div>
        <div class="btn-group mr-2">
            <b-dropdown right
                        split
                        variant="sm btn-outline-dark"
                        @click.prevent.stop="exportWorkflow()">
                <template #button-content>
                    <font-awesome-icon icon="fa fa-download" /> {{$t('actions.export')}}
                </template>
                <b-dropdown-item @click.prevent="exportWorkflow()">
                    {{$t('common.json')}}
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item @click.prevent="exportWorkflow('python')">
                    {{$t('common.python')}}
                </b-dropdown-item>
                <b-dropdown-item @click.prevent="exportWorkflow('notebook')">
                    {{$t('common.jupyter')}}
                </b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="btn-group mr-2"
             role="group">
            <button class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.showProperties')"
                    @click.prevent="showProperties">
                <font-awesome-icon icon="fa fa-cogs" />
            </button>
            <button class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.selectImage')"
                    @click.prevent="selectImage">
                <font-awesome-icon icon="fa fa-image" />
            </button>
            <button class="btn btn-sm btn-outline-dark"
                    :title="$t('actions.showHistory')"
                    @click.prevent="showHistory">
                <font-awesome-icon icon="fa fa-history" />
            </button>
        </div>
        <div class="btn-group"
             role="group">
            <button id="tlb-execute-wf"
                    class="btn btn-sm btn-outline-dark runBtn"
                    :title="$t('actions.execute')"
                    variant="success"
                    @click.prevent="execute">
                <font-awesome-icon icon="fa fa-play"
                                   class=" text-primary" /> {{$t('actions.execute')}}
            </button>
            <!--
        <button class="btn btn-sm btn-outline-dark" @click.prevent="restart" :title="$tc('actions.stop')"
            variant="danger" id="tlb-restart-wf">
            <font-awesome-icon icon="fa fa-stop red" />
        </button>
        -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'WorkflowToolbar',
    props: {
        workflow: {type: Object, default: () => null}
    },
    computed: {
        ...mapGetters(['hasAnyPermission', 'isAdmin', 'user']),
    },
    methods: {
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
        exportWorkflow(format) {
            this.$root.$emit('onclick-export', format);
        },
        showProperties() {
            this.$root.$emit('onshow-properties')
        },
        showExecutions() {
            this.$root.$emit('onshow-executions')
        },
        showVariables() {
            this.$root.$emit('onshow-variables')
        },
        selectImage() {
            this.$root.$emit('onselect-image');
        }
    }
}
</script>
