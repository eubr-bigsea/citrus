<template>
    <div>
        <div class="float-right mr-1 editor-controls">
            <span v-if="editing">
                <small class="mr-1"><a href="#" @click.prevent="cancel">{{$t('actions.cancel')}}</a></small>
                <small><a href="#" @click.prevent="save">{{$t('actions.save')}}</a></small>
            </span>
            <small v-if="!editing && !publicRoute" class="d-print-none">

                <a href="#" :title="$t('actions.edit')" @click.prevent="edit"> <font-awesome-icon icon="fa fa-edit" /></a>
                &nbsp;
                <a href="#" :title="$t('actions.delete')" @click.prevent="deleteText">
                    <font-awesome-icon icon="fa fa-trash" /></a>
            </small>
        </div>
        <div v-if="editing" class="ml-2 float-left">
            {{$t('dashboard.markupVisualization')}}:
        </div>

        <div v-if="editing" class="pl-2 pr-2 editor-container">
            <textarea v-model="content.markdown" class="markdown-editor" />
        </div>
        <div v-else class="pl-2 pr-2">
            <div v-html="markdown" />
        </div>
    </div>
</template>

<script>
import snarkdown from 'snarkdown';
import DOMPurify from 'dompurify';

import Notifier from '../../mixins/Notifier.js';

function sanitizeMarkdown(markdownCode) {
    return DOMPurify.sanitize(snarkdown(markdownCode));
}
export default {
    name: "CaipirinhaVisualizationMarkdown",
    mixins: [Notifier],
    props: {
        visualizationData: { type: Object, default: () => null },
        publicRoute: { default: true, type: Boolean }
    },
    emits: ['update-value'],
    data: function () {
        return {
            editing: false,
            markdown: sanitizeMarkdown(this.visualizationData.markdown || ""),
            content: { ... this.visualizationData }
        };
    },
    watch: {
        content: {
            deep: true,
            handler(newValues) {
                this.$emit('update-value', newValues);
            }
        }
    },
    methods: {

        edit() {
            this.editing = true;
        },
        deleteText() {
            this.$root.$emit('ondelete-visualization', this.visualizationData.id);
        },
        save() {
            const data = JSON.stringify({ markdown: this.visualizationData.markdown });
            this.$root.$emit('onsave-visualization', this.visualizationData.id, data, (result, responseData) => {
                this.editing = false;
                this.markdown = sanitizeMarkdown(JSON.parse(responseData).markdown || "");
            });
        },
        cancel() {
            this.editing = false;
            this.markdown = sanitizeMarkdown(this.visualizationData.markdown || "");
        },
    }
};
</script>
<style>
.editor-container {
    padding: 5px;
}

.editor-controls {
    background: #fff;
    padding: 0px 8px;
    border: 1px solid #ddd;
    border-radius: 10px;
    position: absolute;
    right: 0;
    top: -10px;
}

.editor-container .markdown-editor {
    border: 1px solid #ddd;
    font-family: 'Courier New', Courier, monospace;
    width: 100%;
    resize: none;
    outline: none;
    padding: 5px;
    height: 65%;
    min-height: 120px;
}
</style>
