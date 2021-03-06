<template>
    <div>
        <template v-if="readOnly">
            {{code}}
        </template>
        <template v-else>
            <LabelComponent :field="field" :value="value"></LabelComponent>
            <prism-editor :code="value === null ? field.default: value" v-model="code"
                :language="computedProgrammingLanguage" readonly ref="prism" disabled
                class="prism-editor-wrapper-disabled code2" />
            <b-link variant="sm" @click.prevent="showModal">
                <span>{{$t('actions.edit')}}...</span>
            </b-link>
        </template>
        <b-modal size="xl" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')" ref="modal" no-fade>
            <div slot="default">
                <div class="row">
                    <div class="col-md-8">
                        <prism-editor :code="value === null ? field.default: value" v-model="code"
                            :language="computedProgrammingLanguage" ref="prism" disabled class="code" />
                    </div>

                    <div class="col-md-4">
                        {{$tc('common.attribute', 2)}}:
                        <select class="form-control mt-2" size="10">
                            <option v-for="suggestion in suggestions" :key="suggestion">{{suggestion}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div slot="modal-footer">
                <b-btn @click="cancelModal" variant="" size="sm" class="float-right">{{$t('actions.cancel')}}
                </b-btn>
                <b-btn @click="okModal" variant="success mr-1" size="sm" class="float-right">{{$t('common.ok')}}
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>

    import prismjs from "prismjs";
    import "prismjs/themes/prism.css";
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';
    import PrismEditor from 'vue-prism-editor'

    Prism.languages.python = {
        'comment': {
            pattern: /(^|[^\\])#.*/,
            lookbehind: true
        },
        'triple-quoted-string': {
            pattern: /("""|''')[\s\S]+?\1/,
            greedy: true,
            alias: 'string'
        },
        'string': {
            pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'function': {
            pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
            lookbehind: true
        },
        'class-name': {
            pattern: /(\bclass\s+)\w+/i,
            lookbehind: true
        },
        'keyword': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|pass|print|raise|return|try|while|with|yield)\b/,
        'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
        'boolean': /\b(?:True|False|None)\b/,
        'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
        'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
        'punctuation': /[{}[\];(),.:]/
    };

    Prism.languages.sql = {
        'comment': {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
            lookbehind: true
        },
        'variable': [
            {
                pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
                greedy: true
            },
            /@[\w.$]+/
        ],
        'string': {
            pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
            greedy: true,
            lookbehind: true
        },
        'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i, // Should we highlight user defined functions too?
        'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
        'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
        'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
        'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
        'punctuation': /[;[\]()`,.]/
    };

    export default {
        mixins: [Widget],
        computed: {
            computedProgrammingLanguage() {
                if (this.field && this.field.values) {
                    return JSON.parse(this.field.values).language;
                } else {
                    return this.programmingLanguage;
                }
            }
        },
        data() {
            return {
                code: '',
                originalCode: '',
                suggestions: []
            }
        },
        components: {
            LabelComponent, PrismEditor
        },
        mounted() {
            this.code = this.value || this.field.default || '';
            this.originalCode = this.code;
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            } else {
                this.suggestions = [];
            }
        },
        watch: {
            code: _.debounce(function (e) {
                // let content = e.target.value || e.target.textContent;
                this.$root.$emit(this.message, this.field, this.code);
            }, 500)
        },
        props: {
            programmingLanguage: null,
        },
        methods: {
            okModal() {
                this.$refs.modal.hide();
            },
            showModal() {
                this.$refs.modal.show();
            },
            cancelModal() {
                this.code = this.originalCode;
                this.$root.$emit(this.message, this.field, this.code);
                this.$refs.modal.hide();
            }
        }

    }
</script>
<style>
    .prism-editor-wrapper-disabled pre {
        background-color: #eee !important;
    }
</style>
<style scoped>
    .code2 {
        height: 100px;
        border: 1px solid #ccc;
    }

    .code {
        height: 60vh;
        border: 1px solid #ccc;
        font-family: Courier New, Courier, monospace;
        font-size: .8em
    }
</style>