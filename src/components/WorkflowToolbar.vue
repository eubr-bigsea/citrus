<template>
    <div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" @click.prevent="showExecutions" :title="$tc('titles.job', 2)">
                <span class="fa fa-tasks"></span> {{$tc('titles.job', 2)}}
            </button>
            <button v-if="(hasAnyPermission(['APP_EDIT']) || isAdmin) && workflow.publishing_enabled"
                class="btn btn-sm btn-outline-dark" @click.prevent="showVariables" :title="$t('actions.showVariables')">
                <span class="fa fa-dollar-sign"></span> Variáveis
            </button>
        </div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" @click.prevent="saveWorkflow" :title="$t('actions.save')">
                <span class="fa fa-save text-success"></span> {{$t('actions.save')}}
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="saveWorkflowAs" :title="$t('actions.saveAs')">
                <span class="fa fa-copy"></span> {{$t('actions.saveAs')}}...
            </button>
        </div>
        <div class="btn-group mr-2">
            <b-dropdown right split variant="sm btn-outline-dark" @click.prevent.stop="exportWorkflow()" >
                <template #button-content><span class="fa fa-download"></span> {{$t('actions.export')}}</template>
                <b-dropdown-item @click.prevent="exportWorkflow()">{{$t('common.json')}}</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click.prevent="exportWorkflow('python')">{{$t('common.python')}}</b-dropdown-item>
                <b-dropdown-item @click.prevent="exportWorkflow('notebook')">{{$t('common.jupyter')}}</b-dropdown-item>
              </b-dropdown>
        </div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" @click.prevent="showProperties"
                :title="$t('actions.showProperties')">
                <span class="fa fa-cogs"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="selectImage" :title="$t('actions.selectImage')">
                <span class="fa fa-image"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="showHistory" :title="$t('actions.showHistory')">
                <span class="fa fa-history"></span>
            </button>
        </div>
        <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-dark runBtn" @click.prevent="execute" :title="$t('actions.execute')"
                variant="success" id="tlb-execute-wf">
                <span class="fa fa-play text-primary"></span> {{$t('actions.execute')}}...
            </button>
            <!--
        <button class="btn btn-sm btn-outline-dark" @click.prevent="restart" :title="$tc('actions.stop')"
            variant="danger" id="tlb-restart-wf">
            <span class="fa fa-stop red"></span>
        </button>
        -->
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'WorkflowToolbar',
        computed: {
            ...mapGetters(['hasAnyPermission', 'isAdmin', 'user']),
        },
        props: {
            workflow: {}
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