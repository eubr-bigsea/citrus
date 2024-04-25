<template>
    <b-modal title="Amostra dos últimos resultados" ref="modal" size="lg" ok-only button-size="sm">
        <div class="scroll-area">
            <table v-if="sample" class=" table-smallest table-sm table table-striped mt-1">
                <thead>
                    <tr>
                        <th v-for="attr in sample.attributes" :key="attr.label">{{ attr.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row, i in sample.rows" :key="i">
                        <td v-for="col, j in row" :key="j">{{ col }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </b-modal>
</template>
<script setup>
import {ref} from 'vue';
const props = defineProps({
    sample: { type: Object, required: false, default: () => {} },
});
const modal = ref(null);

const show = () => {
    modal.value.show();
};

defineExpose({show});
</script>
<style scoped>
.scroll-area {
    height: 480px;
    overflow-y: auto;
}
</style>