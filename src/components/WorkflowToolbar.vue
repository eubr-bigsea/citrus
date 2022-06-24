<template>
    <div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" :title="$tc('titles.job', 2)" @click.prevent="showExecutions">
                <span class="fa fa-tasks"></span> {{$tc('titles.job', 2)}}
            </button>
            <button v-if="(hasAnyPermission(['APP_EDIT']) || isAdmin) && workflow.publishing_enabled"
                class="btn btn-sm btn-outline-dark" :title="$t('actions.showVariables')" @click.prevent="showVariables">
                <span class="fa fa-dollar-sign"></span> Variáveis
            </button>
        </div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" :title="$t('actions.save')" @click.prevent="saveWorkflow">
                <span class="fa fa-save text-success"></span> {{$t('actions.save')}}
            </button>
            <button class="btn btn-sm btn-outline-dark" :title="$t('actions.saveAs')" @click.prevent="saveWorkflowAs">
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
            <button class="btn btn-sm btn-outline-dark" :title="$t('actions.showProperties')"
                @click.prevent="showProperties">
                <span class="fa fa-cogs"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" :title="$t('actions.selectImage')" @click.prevent="selectImage">
                <span class="fa fa-image"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" :title="$t('actions.showHistory')" @click.prevent="showHistory">
                <span class="fa fa-history"></span>
            </button>
        </div>
        <div class="btn-group" role="group">
            <button id="tlb-execute-wf" class="btn btn-sm btn-outline-dark runBtn" :title="$t('actions.execute')"
                variant="success" @click.prevent="execute">
                <span class="fa fa-play text-primary"></span> {{$t('actions.execute')}}
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
