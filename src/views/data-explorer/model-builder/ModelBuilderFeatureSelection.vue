<template>
    <div>
        <h5>Seleção e ajustes</h5>
        <hr>
        <div class="row">
            <div class="col-md-4">
                <div v-if="selectedTarget">
                    <label>
                        <font-awesome-icon icon="fa-bullseye" class="text-primary" />
                        Alvo atual: {{selectedTarget.name}}</label>
                </div>
                <div v-else-if="supervisioned" class="text-danger">
                    É necessário informar um atributo alvo!
                </div>
                <div class="mt-2 features-list scroll-area">
                    <b-list-group>
                        <b-list-group-item v-for="attr in features" :key="attr.name" class="p-0"
                                           role="button" @click="handleSelectAttribute(attr)">
                            <div class="w-100 p-1"
                                 :class="{ 'bg-light border-secondary border': selectedAttribute === attr }">
                                <b-form-checkbox :checked="attr.usage !== 'unused'" switch @change="handleEnable">
                                    {{attr.name}}
                                </b-form-checkbox>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <!--
                {{selectedAttribute}}
                -->
            </div>
            <div class="col-md-8 border p-3">
                <div v-if="selectedAttribute">
                    <h6 class="border-bottom mb-4">
                        {{selectedAttribute.name}}
                    </h6>

                    <div class="row">
                        <div class="col-4">
                            <b-form-group label="Uso do atributo:">
                                <b-form-radio-group v-model="selectedAttribute.usage" name="radio-usage" stacked
                                                    @input="changeUsage($event)">
                                    <b-form-radio v-for="opt in usageOptions" :key="opt.value" name="usage" :value="opt.value">
                                        <font-awesome-icon :icon="`fa ${opt.icon}`" :class="opt.cssClass" /> {{opt.label}}
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>

                            <b-form-group v-if="selectedAttributeUsed" :label="$t('common.type')">
                                <b-form-radio-group v-model="selectedAttribute.feature_type" stacked>
                                    <b-form-radio v-for="opt in attributeTypeOptions" :key="opt.value" :value="opt.value">
                                        <font-awesome-icon v-if="opt.icon" :icon="opt.icon" />
                                        <em v-else>[ ]</em>
                                        {{opt.label}}
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>
                        </div>
                        <div class="col-8">
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'categorical'">
                                <b-form-group label="Tratamento para dado categórico:">
                                    <select v-model="selectedAttribute.transform" class="form-select form-select-sm mb-3">
                                        <option v-for="opt in categoricalHandlingOptions" :key="opt.value"
                                                :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Tratamento para valores ausentes:">
                                    <select v-model="selectedAttribute.missing_data" class="form-select form-select-sm">
                                        <option v-for="opt in categoricalMissingOptions" :key="opt.value"
                                                :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                            </template>
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'numerical'">
                                <b-form-group label="Tratamento para dado numérico:">
                                    <select v-model="selectedAttribute.transform" class="form-select form-select-sm mb-3">
                                        <option v-for="opt in numericalHandlingOptions" :key="opt.value" :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                                <template v-if="selectedAttribute.transform === 'keep'">
                                    <b-form-group label="Mudar a escala do número:">
                                        <select v-model="selectedAttribute.scale" class="form-select form-select-sm mb-3">
                                            <option v-for="opt in numericalScaleOptions" :key="opt.value"
                                                    :value="opt.value">
                                                {{opt.label}}
                                            </option>
                                        </select>
                                    </b-form-group>
                                </template>
                                <template v-if="selectedAttribute.transform === 'binarize'">
                                    <b-form-group label="Limiar para a binarização:">
                                        <input v-model="selectedAttribute.threshold" type="number"
                                               class="form-control form-control-sm mb-3 w-25" maxlength="18" step="0.01">
                                    </b-form-group>
                                </template>
                                <template v-if="selectedAttribute.transform === 'quantis'">
                                    <b-form-group label="Número de quantis:">
                                        <input v-model="selectedAttribute.quantis" type="number"
                                               class="form-control form-control-sm mb-3 w-25" maxlength="10" step="1">
                                    </b-form-group>
                                </template>
                                <template v-if="selectedAttribute.transform === 'buckets'">
                                    <b-form-group label="Definição dos buckets:">
                                        <b-form-tags v-model="selectedAttribute.buckets" no-outer-focus class="mb-2 p-2"
                                                     placeholder="Informe um limite para o bucket"
                                                     duplicate-tag-text="Valor já informado" add-button-text="+"
                                                     input-type="number" />
                                        <p v-if="selectedAttribute.buckets">
                                            -∞ ... {{[...selectedAttribute.buckets].sort().join(' ... ')}} ... +∞
                                        </p>
                                    </b-form-group>
                                </template>

                                <b-form-group label="Tratamento para valores ausentes:">
                                    <select v-model="selectedAttribute.missing_data" class="form-select form-select-sm">
                                        <option v-for="opt in numericalMissingOptions" :key="opt.value" :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                            </template>
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'textual'">
                                <b-form-group label="Tratamento para dado textual:">
                                    <select v-model="selectedAttribute.transform" class="form-select form-select-sm mb-3">
                                        <option v-for="opt in textualHandlingOptions" :key="opt.value" :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                                <b-form-group label="Tratamento para valores ausentes:">
                                    <select v-model="selectedAttribute.missing_data" class="form-select form-select-sm">
                                        <option v-for="opt in textualMissingOptions" :key="opt.value" :value="opt.value">
                                            {{opt.label}}
                                        </option>
                                    </select>
                                </b-form-group>
                            </template>
                            <template v-if="selectedAttribute.missing_data === 'constant'">
                                <label>Substituir valores ausentes
                                    por:</label>
                                <input v-model="selectedAttribute.constant"
                                       :type="(selectedAttribute.feature_type === 'numerical') ? 'number' : 'text'"
                                       class="form-control form-control-sm" maxlength="100">
                            </template>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-secondary mt-5 pt-5">
                    <h4>Selecione um atributo à esquerda para editá-lo.</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
const features = defineModel('features', {type: Array});
const props = defineProps({
    attributes: { type: Array, required: true },
    //features: { required: true, type: Object, default: () => { return { forms: {} }; } },
    target: { type: String, default: () => null },
    supervisioned: { type: Boolean },
});

const emit = defineEmits(['update-value', 'update-target']);
const selectedAttribute = ref(null);
const selectedTarget = ref(null);
//const copy = ref({ ... this.features });

const usageOptions = [
    { name: "usage", value: "unused", icon: 'fa-times', cssClass: "text-danger", label: 'Não usar' },
    { name: "usage", value: "label", icon: 'fa-bullseye', cssClass: "text-primary", label: 'Alvo (label)' },
    { name: "usage", value: "feature", icon: 'fa-check', cssClass: "text-success", label: 'Atributo preditor' },
];
const attributeTypeOptions = [
    { value: "categorical", icon: "fa fa-font", label: 'Categórico' },
    { value: "numerical", icon: "fa fa-hashtag", label: 'Numérico' },
    { value: "textual", icon: "fa fa-italic", label: 'Texto' },
    { value: "vector", label: 'Vetor', },
];
const categoricalHandlingOptions = [
    { value: "", label: '' },
    { value: "string_indexer", label: 'Dummy encoding (indexação)' },
    { value: "one_hot_encoder", label: 'One hot encoder' },
    { value: "not_null", label: 'Usar 0 ou 1 para indicar ausência/presença' },
];
const categoricalMissingOptions = [
    { value: "", label: '' },
    { value: "constant", label: 'Valor constante' },
    { value: "remove", label: 'Remover o registro' },
];
const numericalHandlingOptions = [
    { value: "", label: '' },
    { value: "keep", label: 'Manter como está' },
    { value: "binarize", label: 'Binarizar baseado em limiar' },
    // Not supported. Only way is to use SQLTransformer, not supported by MLeap
    //{value:"not_null", label: 'Usar 0 ou 1 para indicar ausência/presença'},
    { value: "quantis", label: 'Dividir em quantis' },
    { value: "buckets", label: 'Dividir em buckets' },
];
const numericalScaleOptions = [
    { value: "", label: '' },
    { value: "standard", label: 'Usar escalador padrão (z-score)' },
    { value: "max_abs", label: 'Usar escalador Max/Abs' },
    { value: "min_max", label: 'Usar escalador Min/Máx' },
];
const numericalMissingOptions = [
    { value: "", label: '' },
    { value: "media", label: 'Substituir pela média aproximada' },
    { value: "median", label: 'Substituir pela mediana' },
    //{value: "mode", label: 'Moda'},
    { value: "constant", label: 'Valor constante' },
    { value: "remove", label: 'Remover o registro' },
];
const textualHandlingOptions = [
    { value: "", label: '' },
    { value: "token_hash", label: 'Tokenizar e hash' },
    { value: "token_stop_hash", label: 'Tokenizar, remover stop words e hash' },
    { value: "count_vectorizer", label: 'Vetor de contagem (counts vectorization)' },
    { value: "word_2_vect", label: 'Vetorizar usando Word2Vect' },
];
const textualMissingOptions = [
    { value: "", label: '' },
    { value: "constant", label: 'Valor constante' },
    { value: "remove", label: 'Remover o registro' },
];
const selectedAttributeUsed = computed(() => {
    return this?.selectedAttribute?.usage !== 'unused';
});
/*
watch: {
copy: {

    deep: true,
    handler(newValues) {
        this.$emit('update-value', newValues);
    }
}
},*/
onMounted(() => {
    const attrLookup = new Map((features?.value || []).map((attr) => [attr.name, attr]));

    if (!features.value) {
        features.value = [];
    }
    props.attributes.forEach((attr) => {
        let cloned;
        if (attrLookup.has(attr.name)) {
            const current  = attrLookup.get(attr.name);
            if (current.usage === 'label') {
                selectedTarget.value = attr;
            }
        } else {
            cloned = { ...attr };
            cloned.usage = 'unused';
            cloned.enable = false;
            cloned.quantis = 10;
            cloned.binarize_trasholder = .5;
            if (['INTEGER', 'DECIMAL'].includes(cloned.type)) {
                cloned.feature_type = 'numerical';
                if (!cloned.transform) {
                    cloned.transform = 'keep';
                }
            } else {
                cloned.feature_type = 'categorical';
                if (!cloned.transform) {
                    cloned.transform = 'hashing';
                }
            }
            features.value.push(cloned);
            /* Remove these properties and instead consider the 'usage' property */
            delete cloned.feature;
            delete cloned.label;
        }

        if (attr.name === props.target) {
            selectedTarget.value = cloned;
        }

        return cloned;
    });
    //emit('update:features', features.value);
    //console.debug(selectedTarget.value)
});
const changeUsage = (usage) => {
    selectedAttribute.value.usage = usage;
    //this.flagUpdating = true;
    /* Remove usage = label for previous selected target */
    if (usage === 'label') {
        if (selectedTarget.value && selectedAttribute.value !== selectedTarget.value) {
            selectedTarget.value.usage = 'feature';
        }
        selectedTarget.value = selectedAttribute.value;
        //this.$emit('update-target', selectedTarget.value.name);
    } else if (usage == 'unsed') {
        if (selectedTarget.value && selectedAttribute.value === selectedTarget.value) {
            selectedTarget.value = null;
        }
    } else if (selectedAttribute.value === selectedTarget.value) {
        selectedTarget.value = null;
    }
};
const handleSelectAttribute = (attr) => {
    selectedAttribute.value = attr;
};
const handleEnable = (enabled) => {
    selectedAttribute.value.usage = enabled ? 'feature' : 'unused';
};
</script>
<style scoped>
.features-list {
    max-height: 52vh;
    overflow-y: auto;
}
</style>
