<template>
    <div>
        <div v-html="markdown" class="markdown-area"></div>
    </div>
</template>

<script>
    import snarkdown from 'snarkdown';
    export default {
        props: {
            text: ""
        },
        computed: {
            markdown() {
                return snarkdown(this.text || '');
            },
        }
    }
</script>
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

        h1,
        h2,
        h3 {
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