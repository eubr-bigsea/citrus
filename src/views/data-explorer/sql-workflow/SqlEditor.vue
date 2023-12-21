<template>
    <div ref="container">
    </div>
</template>
 
<script setup>

import { sql } from '@codemirror/lang-sql'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { defaultHighlightStyle, foldKeymap, syntaxHighlighting } from '@codemirror/language'
import { searchKeymap } from '@codemirror/search'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { debounce } from "../../../util.js";
import { indentWithTab } from "@codemirror/commands"
import { indentUnit } from "@codemirror/language";
import { ref, reactive, defineAsyncComponent, computed, watch, onMounted, 
    defineExpose, defineProps, defineEmits } from "vue";

const emit = defineEmits(['update']);
const props = defineProps({
    command: { type: String, default: () => '' },
    tables: { type: Array, default: () => [] },
    functions: {type: Array, default: () => []}
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
const sqlCompletion = (context) => {
    const completions = [];
    let before = context.matchBefore(/[\w\.]+/)
    function apply(ctx, f) {
        return (view, completion, from, to) => {
            if (completion.type === 'method') {
                return view.dispatch({
                    changes: {
                        from: from,
                        to: to,
                        insert: `${f}()`
                    },
                    selection: { anchor: from + f.length + 1 }
                })
            }
            return autocompletion.apply(view, from, to, completion);
        }
    }
    for (const f of props.functions) {
        if (f === undefined){
            continue;
        }
        completions.push({
            label: f,
            detail: "função",
            type: 'method',
            apply: apply(context, f)
        });
    }
    for (const t of props.tables) {
        completions.push({
            label: t.alias,
            detail: "tabela",
            type: 'class'
        });
        for (const a of t.attributes) {
            completions.push({
                label: `${t.alias}.${a.name}`,
                detail: "coluna",
                type: 'property'
            })
        }
    }
    for (const keyword of sqlKeywords.value) {
        completions.push({
            label: keyword,
            detail: "palavra-chave",
            type: 'keyword'
        });
    }
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null
    return {
        from: before ? before.from : context.pos,
        options: completions,
        validFor: /^\w*$/
    }
}

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
        doc: props.command,
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
            autocompletion({ override: [sqlCompletion] }),
            sql(),
            EditorView.updateListener.of(debounce((v) => {
                emit('update', v.state.doc.text.join('\n'));
            }, 200))
        ],
        parent: container.value
    });
});
defineExpose({focus})


</script>
 