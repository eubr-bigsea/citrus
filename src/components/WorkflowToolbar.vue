<template>
    <div class="btn-group" role="group">
        <button class="btn btn-sm btn-outline-dark" @click.prevent="saveWorkflow" :title="$t('actions.save')">
            <span class="far fa-save"></span>
        </button>
        <button class="btn btn-sm btn-outline-dark" @click.prevent="saveWorkflowAs" :title="$t('actions.saveAs')">
            <span class="far fa-copy"></span>
        </button>
        <button class="btn btn-sm btn-outline-dark" @click.prevent="exportWorkflow" :title="$t('actions.export')">
            <span class="fa fa-download"></span>
        </button>
        <button class="btn btn-sm btn-outline-dark" @click.prevent="showHistory" :title="$t('actions.showHistory')">
            <span class="fa fa-history"></span>
        </button>
        <button class="btn btn-sm btn-outline-dark runBtn" @click.prevent="execute" :title="$t('actions.execute')"
            variant="success" id="tlb-execute-wf">
            <span class="fa fa-play"></span>
        </button>
        <!--
        <button class="btn btn-sm btn-outline-dark" @click.prevent="restart" :title="$tc('actions.stop')"
            variant="danger" id="tlb-restart-wf">
            <span class="fa fa-stop red"></span>
        </button>
        -->
    </div>
</template>

<style>
    .red {
        color: #FF4136;
    }
    .runBtn {
        color: #28a745 !important;
    }

    .runBtn:hover {
        color: white !important;
        background-color: #28a745 !important;
    }
</style>

<script>
    import Notifier from '../mixins/Notifier'

    export default {
        mixins: [Notifier],
        name: 'WorkflowToolbar',
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
            }
        }
    }
</script>