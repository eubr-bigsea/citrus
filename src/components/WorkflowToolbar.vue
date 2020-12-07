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
                <span class="fa fa-save"></span> {{$t('actions.save')}}
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="saveWorkflowAs" :title="$t('actions.saveAs')">
                <span class="fa fa-copy"></span>
            </button>
        </div>
        <div class="btn-group mr-2" role="group">
            <button class="btn btn-sm btn-outline-dark" @click.prevent="showProperties"
                :title="$t('actions.showProperties')">
                <span class="fa fa-cogs"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="selectImage" :title="$t('actions.selectImage')">
                <span class="fa fa-image"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="exportWorkflow" :title="$t('actions.export')">
                <span class="fa fa-download"></span>
            </button>
            <button class="btn btn-sm btn-outline-dark" @click.prevent="showHistory" :title="$t('actions.showHistory')">
                <span class="fa fa-history"></span>
            </button>
        </div>
        <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-dark runBtn" @click.prevent="execute" :title="$t('actions.execute')"
                variant="success" id="tlb-execute-wf">
                <span class="fa fa-play"></span> {{$t('actions.execute')}}
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

<style lang="scss">
    .red {
        color: #FF4136;
    }

    .runBtn {
        span {
            color: #28a745
        }

        &:hover {
            color: var(--font-color);
            background-color: rgba(#28a745, .16);
        }
    }
</style>

<script>
    import Notifier from '../mixins/Notifier'
    import { mapGetters } from 'vuex';

    export default {
        mixins: [Notifier],
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
            exportWorkflow() {
                this.$root.$emit('onclick-export');
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