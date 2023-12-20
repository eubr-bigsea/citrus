<template>
    <div ref="txt">

    </div>
</template>
 
<script>

import { sql } from '@codemirror/lang-sql'
import { autocompletion, completionKeymap, completeFromList } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { defaultHighlightStyle, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { searchKeymap } from '@codemirror/search'
import { EditorView, ViewUpdate, keymap, lineNumbers } from '@codemirror/view'
import { debounce } from "../../../util.js";

export default {
    emits: ['update'],
    name: "SqlEditor",
    props: {
        command: { type: String, default: () => '' },
    },

    data() {
        return {
            editor: null,
            //autocompletion: the dictionary of all possible keywords
            //[list complete of reserved keyword for MSSQL](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-2017)
            sqlKeywords: ['ABS', 'ALL', 'AND', 'APPROXIMATE', 'AS', 'ASC',
                'AVG', 'BETWEEN', 'BY', 'CACHE', 'CASE', 
                'DELETE', 'DESC',
                'DISTINCT', 'END', 'EXCEPT', 'EXISTS', 'FALSE', 'FIRST', 'FROM', 
                'FULL',
                'GROUP',
                'HAVING', 'IF', 'IN', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS',
                'JOIN', 'LAST', 'LEFT', 'LIKE', 'LIMIT',  'NOT', 'NULL', 'ON', 'OR', 
                'ORDER', 'OUTER', 'OVERWRITE', 'REGEXP',
                'RIGHT', 'SELECT', 'SEMI', 'STRING',
                'TABLE', 'THEN', 'TIMESTAMP', 'TRUE', 'UNCACHE',
                'UNION', 'UPDATE', 'VALUES', 'WHEN', 'WHERE'],
            functions: [
                'abs', 'acos', 'acosh', 'add_months', 'aes_decrypt',
                'aes_encrypt', 'aggregate', 'and', 'any', 'any_value',
                'approx_count_distinct', 'approx_percentile', 'array',
                'array_agg', 'array_append', 'array_compact', 'array_contains',
                'array_distinct', 'array_except', 'array_insert',
                'array_intersect', 'array_join', 'array_max', 'array_min',
                'array_position', 'array_prepend', 'array_remove',
                'array_repeat', 'array_size', 'array_sort', 'array_union',
                'arrays_overlap', 'arrays_zip', 'ascii', 'asin', 'asinh',
                'between', 'bigint', 'bin', 'binary', 'bit_and', 'bit_count',
                'bit_get', 'bit_length', 'bit_or', 'bit_xor',
                'bitmap_bit_position', 'bitmap_bucket_number',
                'bitmap_construct_agg', 'bitmap_count', 'bitmap_or_agg',
                'bool_and', 'bool_or', 'boolean', 'bround', 'btrim',
                'cardinality', 'case', 'cast', 'cbrt', 'ceil',
                'ceiling', 'char', 'char_length', 'character_length',
                'chr', 'coalesce', 'collect_list', 'collect_set',
                'concat', 'concat_ws', 'contains', 'conv',
                'convert_timezone', 'corr', 'cos', 'cosh', 'cot',
                'count', 'count_if', 'count_min_sketch', 'covar_pop',
                'covar_samp', 'crc32', 'csc', 'cume_dist', 'curdate',
                'current_catalog', 'current_database', 'current_date',
                'current_schema', 'current_timestamp',
                'current_timezone', 'current_user', 'date', 'date_add',
                'date_diff', 'date_format', 'date_from_unix_date',
                'date_part', 'date_sub', 'date_trunc', 'dateadd',
                'datediff', 'datepart', 'day', 'dayofmonth', 'dayofweek',
                'dayofyear', 'decimal', 'decode', 'degrees', 'dense_rank',
                'div', 'double', 'e', 'element_at', 'elt', 'encode',
                'endswith', 'equal_null', 'every', 'exists', 'exp',
                'explode', 'explode_outer', 'expm1', 'extract', 'factorial',
                'filter', 'find_in_set', 'first', 'first_value', 'flatten',
                'float', 'floor', 'forall', 'format_number', 'format_string',
                'from_csv', 'from_json', 'from_unixtime', 'from_utc_timestamp',
                'get', 'get_json_object', 'getbit', 'greatest', 'grouping',
                'grouping_id', 'hash', 'hex', 'histogram_numeric',
                'hll_sketch_agg', 'hll_sketch_estimate', 'hll_union',
                'hll_union_agg', 'hour', 'hypot', 'if', 'ifnull', 'ilike',
                'in', 'initcap', 'inline', 'inline_outer',
                'input_file_block_length', 'input_file_block_start',
                'input_file_name', 'instr', 'int', 'isnan', 'isnotnull',
                'isnull', 'java_method', 'json_array_length',
                'json_object_keys', 'json_tuple', 'kurtosis', 'lag',
                'last', 'last_day', 'last_value', 'lcase', 'lead',
                'least', 'left', 'len', 'length', 'levenshtein', 'like',
                'ln', 'localtimestamp', 'locate', 'log', 'log10', 'log1p',
                'log2', 'lower', 'lpad', 'ltrim', 'luhn_check', 'make_date',
                'make_dt_interval', 'make_interval', 'make_timestamp',
                'make_timestamp_ltz', 'make_timestamp_ntz',
                'make_ym_interval', 'map', 'map_concat', 'map_contains_key',
                'map_entries', 'map_filter', 'map_from_arrays',
                'map_from_entries', 'map_keys', 'map_values', 'map_zip_with',
                'mask', 'max', 'max_by', 'md5', 'mean', 'median', 'min',
                'min_by', 'minute', 'mod', 'mode',
                'monotonically_increasing_id', 'month', 'months_between',
                'named_struct', 'nanvl', 'negative', 'next_day', 'not', 'now',
                'nth_value', 'ntile', 'nullif', 'nvl', 'nvl2', 'octet_length',
                'or', 'overlay', 'parse_url', 'percent_rank', 'percentile',
                'percentile_approx', 'pi', 'pmod', 'posexplode',
                'posexplode_outer', 'position', 'positive', 'pow', 'power',
                'printf', 'quarter', 'radians', 'raise_error', 'rand', 'randn',
                'random', 'rank', 'reduce', 'reflect', 'regexp', 'regexp_count',
                'regexp_extract', 'regexp_extract_all', 'regexp_instr',
                'regexp_like', 'regexp_replace', 'regexp_substr', 'regr_avgx',
                'regr_avgy', 'regr_count', 'regr_intercept', 'regr_r2',
                'regr_slope', 'regr_sxx', 'regr_sxy', 'regr_syy', 'repeat',
                'replace', 'reverse', 'right', 'rint', 'rlike', 'round',
                'row_number', 'rpad', 'rtrim', 'schema_of_csv', 'schema_of_json',
                'sec', 'second', 'sentences', 'sequence', 'session_window',
                'sha', 'sha1', 'sha2', 'shiftleft', 'shiftright',
                'shiftrightunsigned', 'shuffle', 'sign', 'signum', 'sin',
                'sinh', 'size', 'skewness', 'slice', 'smallint', 'some',
                'sort_array', 'soundex', 'space', 'spark_partition_id',
                'split', 'split_part', 'sqrt', 'stack', 'startswith', 'std',
                'stddev', 'stddev_pop', 'stddev_samp', 'str_to_map', 'string',
                'struct', 'substr', 'substring', 'substring_index', 'sum',
                'tan', 'tanh', 'timestamp', 'timestamp_micros',
                'timestamp_millis', 'timestamp_seconds', 'tinyint', 'to_binary',
                'to_char', 'to_csv', 'to_date', 'to_json', 'to_number',
                'to_timestamp', 'to_timestamp_ltz', 'to_timestamp_ntz',
                'to_unix_timestamp', 'to_utc_timestamp', 'to_varchar',
                'transform', 'transform_keys', 'transform_values', 'translate',
                'trim', 'trunc', 'try_add', 'try_aes_decrypt', 'try_avg',
                'try_divide', 'try_element_at', 'try_multiply', 'try_subtract',
                'try_sum', 'try_to_binary', 'try_to_number', 'try_to_timestamp',
                'typeof', 'ucase', 'unbase64', 'unhex', 'unix_date',
                'unix_micros', 'unix_millis', 'unix_seconds', 'unix_timestamp',
                'upper', 'url_decode', 'url_encode', 'user', 'uuid', 'var_pop',
                'var_samp', 'variance', 'version', 'weekday', 'weekofyear',
                'when', 'width_bucket', 'window', 'window_time', 'xpath',
                'xpath_boolean', 'xpath_double', 'xpath_float', 'xpath_int',
                'xpath_long', 'xpath_number', 'xpath_short', 'xpath_string',
                'xxhash64', 'year', 'zip_with',
            ]

        };
    },
    methods: {
        sqlCompletion(context) {
            const completions = [];
            let before = context.matchBefore(/[\w\.]+/)
            const columns = ['sales.nome', 'cnpj', 'endereco', 'telefone']
            for (const col of columns) {
                completions.push({
                    label: col,
                    detail: "coluna",
                    type: 'property', //'method'
                });
            }
            function apply(ctx, f){
                return (view, completion, from, to) => {
                    // Se a sugestão for do tipo method, insira os parênteses e coloque o cursor dentro deles
                    if (completion.type === 'method') {
                        return view.dispatch({
                        changes: {
                            from: from,
                            to: to,
                            insert: `${f}()`
                        },
                        selection: {anchor: from + f.length + 1}
                        })
                    }
                    // Se não for do tipo method, use o comportamento padrão de inserção
                    return autocompletion.apply(view, from, to, completion);
                }
            }
            for (const f of this.functions) {
                completions.push({
                    label: f,
                    detail: "função",
                    type: 'method',
                    apply: apply(context, f)
                });
            }
            for (const keyword of this.sqlKeywords) {
                //if (keyword.startsWith(before.string)) {
                completions.push({
                    label: keyword,
                    detail: "palavra-chave",
                    type: 'keyword'
                });
                //}
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
        ,
        /*
        Return a list of suggestion base on the searchString (the current word that user is typing).
        Each suggestion is an object {text, displayText, className}. See https://codemirror.net/doc/manual.html#addon_show-hint
        - keywords start with the searchString appears first in the suggestion list
        */
        suggest(searchString) {
            /*
            we will score which suggesion should appears first, the higer the score, the higer is the appearance order
            */
            let token = searchString;
            if (searchString.startsWith(".")) token = searchString.substring(1);
            else token = searchString.toLowerCase();
            let resu = [];
            let N = this.dico.length;

            //init scoring: only retains and score suggestions which contain the searchString
            for (let i = 0; i < N; i++) {
                let keyword = this.dico[i].text.toLowerCase();
                let suggestion = null;
                //the base score of all the suggestion is N-i (it means we respect the order in the dico)
                if (keyword.startsWith(token)) {
                    //add N to the score of keywords which begin with the token to make them raise up in the suggestion list
                    suggestion = Object.assign({ score: N + (N - i) }, this.dico[i]);
                } else if (keyword.includes(token)) {
                    suggestion = Object.assign({ score: N - i }, this.dico[i]);
                }
                if (suggestion) resu.push(suggestion);
            }

            //case suggestion for "."
            if (searchString.startsWith(".")) {
                //raise score of columns, decrease the score of sql keyword
                resu.forEach(s => {
                    if (s.className == "column") s.score += N;
                    else if (s.className == "sql") s.score -= N;
                    return s;
                });
            }

            //console.log(searchString);
            return resu.sort((a, b) => b.score - a.score);
        },
        /*
        [hint implementation for codemirror](https://codemirror.net/doc/manual.html#addon_show-hint):
        take an editor instance and options object, and return a {list, from, to} object, where list is an array of strings or objects (the completions), and from and to give the start and end of the token that is being completed as {line, ch} objects. 
         */
        hint(editor) {
            let cur = editor.getCursor();
            let token = editor.getTokenAt(cur);
            let searchString = token.string;
            return {
                list: this.suggest(searchString),
                from: CodeMirror.Pos(cur.line, token.start),
                to: CodeMirror.Pos(cur.line, token.end)
            };
        }
    },
    mounted() {

        let myTheme = EditorView.baseTheme({
            "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
                backgroundColor: "purple",
            },
            ".cm-selectionBackground": {
                backgroundColor: "yellow",
            },
            ".cm-completionDetail": {
                fontStyle: "normal",
                fontSize: "8pt",
                float: "right",
                marginTop: "2px"
            }
        });

        this.editor = new EditorView({
            doc: this.command,
            extensions: [
                myTheme,
                lineNumbers(),
                //highlightActiveLineGutter(),
                //highlightSpecialChars(),
                history(),
                //foldGutter(),
                //drawSelection(),
                //dropCursor(),
                //EditorState.allowMultipleSelections.of(true),
                //indentOnInput(),//???
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                //highlightActiveLine(),
                //highlightSelectionMatches(),
                keymap.of([
                    //...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...searchKeymap,
                    ...historyKeymap,
                    ...foldKeymap,
                    ...completionKeymap,
                    //...lintKeymap,
                ]),
                autocompletion({ override: [this.sqlCompletion] }),
                sql(),

                EditorView.updateListener.of(debounce((v) => {
                    this.$emit('update', v.state.doc.text.join('\n'));
                }, 200))
            ],
            parent: this.$refs.txt
        });

        return

    }
};
</script>
 
<style>
.cm-s-completion.cm-hint,
.cm-completion-active {
    background-color: #f0f0f0;
    /* Change this to your desired background color */
}
</style>
<style scoped>
.txt {
    width: 100%;
    height: 100%;
}
</style>