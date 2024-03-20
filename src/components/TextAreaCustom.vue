<template>
    <h2>
        <textarea :value="value" 
                  :rows="textareaRows" 
                  maxlength="200" 
                  @input="$emit('input', $event.target.value)" />
    </h2>
</template>

<script>
export default {
    name: 'TextAreaCustom',
    props: {
        value: { type: String, default: '-' },
    },
    emits: ['input'],
    computed: {
        textareaRows() {
            const larguraTextarea = 200;
            const larguraCaractere = 10; 
            const numeroLinhas = Math.ceil(larguraCaractere * this.value.length / larguraTextarea);

            if (numeroLinhas == 0) return 1;
            return numeroLinhas;
        }
    },
};
</script>

<style scoped>
textarea {
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 400;
    display: block;
    width: 100%;
    resize: vertical;
    overflow-y: auto;
    max-height: 100px;
    margin-bottom: -8px;
}

textarea:hover {
    border-color: #CCC;
}
</style>
