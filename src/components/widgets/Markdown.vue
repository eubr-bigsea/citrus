<template>
    <div v-html="markdown"></div>
</template>

<script>
    import snarkdown from 'snarkdown';
    export default {
        props: {
            text: ""
        },
        computed: {
            markdown() {
                return snarkdown(this.text);
            },
        }
    }
</script>