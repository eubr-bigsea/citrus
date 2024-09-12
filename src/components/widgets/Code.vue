<template>
    <div>
        <template v-if="readOnly">
            {{code}}
        </template>
        <template v-else>
            <LabelComponent :field="field"
                            :value="value" />
            <div class="border p-2">
                <prism-editor ref="prism"
                              v-model="code"
                              :highlight="highlighter"
                              class="prism-editor-wrapper-disabled code2"
                              :readonly="false" @input="handleInput" />
            </div>
            <b-link variant="sm"
                    @click.prevent="showModal">
                <span>{{$t('actions.edit')}}...</span>
            </b-link>
        </template>

        <b-modal ref="modal"
                 size="xl"
                 :title="field.label"
                 ok-disabled
                 :cancel-title="$t('actions.cancel')"
                 no-fade>
            <template #default>
                <div class="row">
                    <div class="col-md-8">
                        <div class="border p-2">
                            <prism-editor ref="prismEditor"
                                          v-model="code"
                                          :highlight="highlighter"
                                          class="my-editor"
                                          @input="handleInput" />
                        </div>
                    </div>

                    <div class="col-md-4">
                        {{$t('common.attribute', 2)}}:
                        <select class="form-control mt-2"
                                size="10">
                            <option v-for="suggestion in suggestions"
                                    :key="suggestion">
                                {{suggestion}}
                            </option>
                        </select>
                    </div>
                </div>
            </template>
            <template #footer>
                <b-button variant="secondary"
                          size="sm"
                          class="float-end"
                          @click="cancelModal">
                    {{$t('actions.cancel')}}
                </b-button>
                <b-button variant="success me-1"
                          size="sm"
                          class="float-end"
                          @click="okModal">
                    {{$t('common.ok')}}
                </b-button>
            </template>
        </b-modal>
    </div>
</template>
<script>
//import "prismjs/themes/prism.min.css";
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';

import 'vue-prism-editor/dist/prismeditor.min.css';
import { PrismEditor } from 'vue-prism-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
import { debounce } from '../../util.js';

export default {
    name: 'CodeComponent',
    components: {
        LabelComponent, PrismEditor
    },
    mixins: [Widget],
    props: {
        programmingLanguage: { type: String, default: () => null },
    },
    data() {
        return {
            code: '',
            originalCode: '',
            suggestions: [],
            selectionStart: 0,
        };
    },
    computed: {
        computedProgrammingLanguage() {
            if (this.field && this.field.values) {
                return JSON.parse(this.field.values).language;
            } else {
                return this.programmingLanguage;
            }
        }
    },
    watch: {
       code: debounce(function () {
           console.debug(this.code)
            this.triggerUpdateEvent(this.message, this.field, this.code);
       }, 500)
    },
    mounted() {
        this.code = this.value || this.field.default || ' ';
        this.originalCode = this.code;
        if (this.suggestionEvent) {
            this.suggestions = this.suggestionEvent();
        } else {
            this.suggestions = [];
        }
    },
    methods: {

        // handleInput() {
        //     const prismEditor = this.$refs.prismEditor;
        //     if (prismEditor.history.offset > 0) {
        //         const { selectionStart, selectionEnd } = prismEditor.history.stack.slice(-1)[0];
        //         /* hack to move cursor to correct position when using modal */
        //         this.$nextTick(() => {
        //             window.setTimeout(() => {
        //                 prismEditor.$refs.textarea.setSelectionRange(
        //                     selectionStart, selectionEnd);
        //             }, 1);
        //         });
        //     }
        // },
        handleInput() {
            this.triggerUpdateEvent(this.message, this.field, this.code);
        },
        okModal() {
            this.triggerUpdateEvent(this.message, this.field, this.code);
            this.triggerUpdateEvent(this.message, this.field, this.code);
            this.$refs.modal.hide();
        },
        showModal() {
            this.$refs.modal.show();
        },
        cancelModal() {
            this.code = this.originalCode;
            this.triggerUpdateEvent(this.message, this.field, this.code);
            this.$refs.modal.hide();
        },
        highlighter() {
            if (this.code !== '') {
                const lang = this.computedProgrammingLanguage;

                if (lang === 'sql') {
                    return highlight(this.code || '', languages.sql, 'sql');
                } else if (lang === 'python') {
                    return highlight(this?.code || '', languages.py, 'py');
                } else {
                    console.error(`Unsupported language ${lang}`);
                }
            }
        },
    }

};
</script>
<style>
    .my-editor,
    .prism-editor-wrapper .prism-editor__editor,
    .prism-editor-wrapper .prism-editor__textarea {
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace !important;
        font-size: 12px !important;
        line-height: 1.5;
    }
</style>
