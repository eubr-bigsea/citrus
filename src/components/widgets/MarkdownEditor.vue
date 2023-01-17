<template>
    <div class="function-editor">
        <span v-if="!readOnly">
            <LabelComponent :field="field"
                            :value="value" />

            <Markdown :text="value"
                      class="border p-1" />
            <b-link variant="sm"
                    @click.prevent="openModal">
                {{$t('actions.edit')}}
            </b-link>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal ref="modal"
                 size="xl"
                 :title="field.label||field.name"
                 centered>
            <div class="row">
                <div class="col-md-6 border-left editor border">
                    <textarea v-model="code"
                              class="code"
                              rows="20"
                              maxlength="500" />
                </div>
                <div class="col-md-6 markdown-area">
                    <Markdown :text="code" />
                </div>
            </div>
            <div slot="modal-footer"
                 class="w-100 text-right">
                <b-btn variant="primary"
                       class="mr-1"
                       @click="okClicked">
                    {{$t('common.ok')}}
                </b-btn>
                <b-btn variant="secondary"
                       @click="cancelClicked">
                    {{$t('actions.cancel')}}
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Markdown from './Markdown.vue';
import "prismjs/themes/prism.css";
import Widget from '../../mixins/Widget.js';

export default {
    components: { LabelComponent, Markdown},
    mixins: [Widget],
    data(){
        return {
            displayValue: '',
            code: '',
        }
    },
    methods: {
        openModal() {
            this.code = this.value;
            this.$refs.modal.show();
        },
        okClicked() {
            this.$root.$emit(this.message, this.field, this.code);
            this.$refs.modal.hide();
        },
        cancelClicked() {
            this.$refs.modal.hide();
        }
    },
}
</script>
<style scoped>
    .editor {
        height: 500px;
        overflow: auto;
    }
	.code {
		font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
		width: 100%;
		border: none;
	}
</style>
<style lang="scss">
    .markdown-area {
        h1 {
            font-size: 2.5em;
        }

        h2 {
            font-size: 2em;
        }

        h3 {
            font-size: 1.5em;
        }
		h4 {
			font-size: 1.2em;
		}
		h5 {
			font-size: 1.1em;
		}
		h6 {
			font-size: 1em;
		}
        h1,
        h2,
        h3, h4, h5, h6 {
            font-family: 'Open Sans', sans-serif;
            font-weight: 700;
            color: #111111;
            line-height: 1em;
            -webkit-font-smoothing: antialiased;
            margin: 15px 0px;
        }

        /* Lists */
        ul,
        ol {
            margin: 1em 0;
            padding: 0 0 0 2em;
        }

        ol li {
            list-style-type: decimal;
            padding-bottom: 0.50em;
        }

        ul li {
            list-style-type: disc;
            padding-bottom: 0.50em;
        }

        li p:last-child {
            margin: 0
        }

        dd {
            margin: 0 0 0 2em;
        }

        /* Code */
        pre,
        code,
        tt {
            font-size: 0.98em;
            font-size: 13px;
            line-height: 19px;
            font-family: Consolas, Courier, Monospace;
        }

        code,
        tt {
            margin: 0px;
            padding: 2px;
            white-space: nowrap;
            border: 1px solid #eaeaea;
            background-color: #f8f8f8;
            border-radius: 3px;
        }

        pre {
            background-color: #f8f8f8;
            border: 1px solid #ccc;
            overflow: auto;
            padding: 6px 10px;
            border-radius: 3px;
        }

        pre code,
        pre tt {
            background-color: transparent;
            border: none;
            margin: 0;
            padding: 0;
            white-space: pre;
            border: none;
            background: transparent;
        }
    }

</style>
