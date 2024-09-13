<template>
    <div ref="container" />
</template>

<script setup>

import { debounce } from "@/util.js";
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import {
    defaultKeymap, history, historyKeymap,
    indentWithTab
} from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import {
    defaultHighlightStyle, foldKeymap, indentUnit,
    syntaxHighlighting
} from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defineEmits, defineExpose, defineProps, onMounted, ref } from "vue";

const emit = defineEmits(['update']);
const props = defineProps({
    query: { type: String, default: () => '' },
    tables: { type: Array, default: () => [] },
    functions: { type: Array, default: () => [] },
    format: { type: Object, default: () => { language: 'python'; } },
});

const container = ref();
const editor = ref();
const sqlKeywords = ref(['ABS', 'ALL', 'AND', 'APPROXIMATE', 'AS', 'ASC',
    'AVG', 'BETWEEN', 'BY', 'CACHE', 'CASE',
    'DELETE', 'DESC',
    'DISTINCT', 'END', 'EXCEPT', 'EXISTS', 'FALSE', 'FIRST', 'FROM',
    'FULL',
    'GROUP',
    'HAVING', 'IF', 'IN', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS',
    'JOIN', 'LAST', 'LEFT', 'LIKE', 'LIMIT', 'NOT', 'NULL', 'ON', 'OR',
    'ORDER', 'OUTER', 'OVERWRITE', 'REGEXP',
    'RIGHT', 'SELECT', 'SEMI', 'STRING',
    'TABLE', 'THEN', 'TIMESTAMP', 'TRUE', 'UNCACHE',
    'UNION', 'UPDATE', 'VALUES', 'WHEN', 'WHERE', 'WITH']);

/* Methods */
const focus = () => editor.value.focus();

const indent = () => {
    //const formatted = format(props.query, props.format);
    //editor.value.dispatch({
    //    changes: { from: 0, to: editor.value.state.doc.length, insert: formatted }
    //});
};

/* Events */
onMounted(() => {
    let myTheme = EditorView.baseTheme({
        ".cm-completionDetail": {
            fontStyle: "normal",
            fontSize: "8pt",
            float: "right",
            marginTop: "2px"
        }
    });
    editor.value = new EditorView({
        doc: props.query,
        extensions: [
            myTheme,
            keymap.of([indentWithTab]),
            indentUnit.of("    "),
            lineNumbers(),
            history(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            keymap.of([
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
            ]),
            //autocompletion({ override: [sqlCompletion] }),
            autocompletion(),
            python(),
            EditorView.lineWrapping,
            EditorView.updateListener.of(debounce((v) => {
                /*if( v.state.doc.children) {
                    const newText = []
                    v.state.doc.children.forEach((line, index) => {
                        newText.push(line.text.join('\n'));
                    });
                    emit('update', newText.join('\n'));
                } else {
                    emit('update', v.state.doc.text.join('\n'));
                }*/
                const content = v.state.sliceDoc(0);
                emit('update', content);
            }, 200))
        ],
        parent: container.value
    });
});
defineExpose({ focus, indent });
</script>
