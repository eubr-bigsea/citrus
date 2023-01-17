<template>
    <div>
        <h5>Seleção e ajustes</h5>
        <hr>
        <div class="row">
            <div class="col-md-4">
                <div v-if="selectedTarget">
                    <label>
                        <span class="text-primary fa fa-bullseye" />
                        Alvo atual: {{selectedTarget.name}}</label>
                </div>
                <div v-else-if="supervisioned"
                     class="text-danger">
                    É necessário informar um atributo alvo!
                </div>
                <div class="mt-2 features-list scroll-area">
                    <b-list-group>
                        <b-list-group-item v-for="attr in features.forms.features.value"
                                           :key="attr.name"
                                           class="p-0"
                                           role="button"
                                           @click="handleSelectAttribute(attr)">
                            <div v-if="attr.usage !== 'label' "
                                 class="w-100 p-1"
                                 :class="{'bg-light': selectedAttribute === attr }">
                                <b-form-checkbox v-model="attr.usage"
                                                 switch
                                                 value="feature">
                                    {{attr.name}}
                                </b-form-checkbox>
                            </div>
                            <div v-else-if="supervisioned"
                                 class="w-100 p-1"
                                 title="Alvo">
                                <span class="text-primary p-2 fa fa-bullseye" /> {{attr.name}}
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
                                <b-form-radio-group name="radio-usage"
                                                    :checked="selectedAttribute.usage"
                                                    stacked
                                                    @input="changeUsage($event)">
                                    <b-form-radio name="usage"
                                                  value="unused">
                                        <font-awesome-icon icon="fa fa-times"
                                                           class="text-danger" /> Não usar
                                    </b-form-radio>
                                    <b-form-radio v-if="supervisioned"
                                                  name="usage"
                                                  value="label">
                                        <font-awesome-icon icon="fa fa-bullseye"
                                                           class="text-primary" /> Alvo (rótulo)
                                    </b-form-radio>
                                    <b-form-radio name="usage"
                                                  value="feature">
                                        <font-awesome-icon icon="fa fa-check"
                                                           class="text-success" />
                                        Atributo preditor
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>

                            <template v-if="selectedAttributeUsed">
                                <label for="">{{$tc('common.type')}}:</label>
                                <b-form-radio-group v-model="selectedAttribute.feature_type"
                                                    stacked>
                                    <b-form-radio value="categorical">
                                        <font-awesome-icon icon="fa fa-font" />
                                        Categórico
                                    </b-form-radio>
                                    <b-form-radio value="numerical">
                                        <font-awesome-icon icon="fa fa-hashtag" /> Numérico
                                    </b-form-radio>
                                    <b-form-radio value="textual">
                                        <font-awesome-icon icon="fa fa-italic" /> Texto
                                    </b-form-radio>
                                    <b-form-radio value="vector">
                                        <em>[ ]</em> Vetor
                                    </b-form-radio>
                                    <!-- <b-form-radio value="vector">[ ] Arranjo</b-form-radio>-->
                                </b-form-radio-group>
                            </template>
                        </div>
                        <div class="col-8">
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'categorical' ">
                                <label for="">Tratamento para dado categórico:</label>
                                <select v-model="selectedAttribute.transform"
                                        class="form-control form-control-sm mb-3">
                                    <option value="string_indexer">
                                        Dummy encoding (indexação)
                                    </option>
                                    <option value="one_hot_encoder">
                                        One hot encoder
                                    </option>
                                    <option value="not_null">
                                        Usar 0 ou 1 para indicar ausência/presença
                                    </option>
                                </select>

                                <label for="">Tratamento para valores ausentes:</label>
                                <select v-model="selectedAttribute.missing_data"
                                        class="form-control form-control-sm">
                                    <!-- <option value="mode">Moda</option> -->
                                    <option value="constant">
                                        Valor constante
                                    </option>
                                    <option value="remove">
                                        Remover o registro
                                    </option>
                                </select>
                            </template>
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'numerical' ">
                                <label for="">Tratamento para dado numérico:</label>
                                <select v-model="selectedAttribute.transform"
                                        class="form-control form-control-sm mb-3">
                                    <option value="keep">
                                        Manter como está
                                    </option>
                                    <option value="binarize">
                                        Binarizar baseado em limiar
                                    </option>
                                    <!-- Not supported. Only way is to use SQLTransformer, not supported by MLeap
                                    <option value="not_null">Usar 0 ou 1 para indicar ausência/presença</option>
                                    -->
                                    <option value="quantis">
                                        Dividir em quantis
                                    </option>
                                    <option value="buckets">
                                        Dividir em buckets
                                    </option>
                                </select>
                                <template v-if="selectedAttribute.transform === 'keep'">
                                    <label>Mudar a escala do número:</label>
                                    <select v-model="selectedAttribute.scale"
                                            class="form-control form-control-sm mb-3">
                                        <option />
                                        <option value="standard">
                                            Usar escalador padrão (z-score)
                                        </option>
                                        <option value="max_abs">
                                            Usar escalador Max/Abs
                                        </option>
                                        <option value="min_max">
                                            Usar escalador Min/Máx
                                        </option>
                                    </select>
                                </template>
                                <template v-if="selectedAttribute.transform === 'binarize'">
                                    <label>Limiar para a binarização:</label>
                                    <input v-model="selectedAttribute.threshold"
                                           type="number"
                                           class="form-control form-control-sm mb-3 w-25"
                                           maxlength="18"
                                           step="0.01">
                                </template>
                                <template v-if="selectedAttribute.transform === 'quantis'">
                                    <label>Número de quantis:</label>
                                    <input v-model="selectedAttribute.quantis"
                                           type="number"
                                           class="form-control form-control-sm mb-3 w-25"
                                           maxlength="10"
                                           step="1">
                                </template>
                                <template v-if="selectedAttribute.transform === 'buckets'">
                                    <label>Definição dos buckets:</label>
                                    <b-form-tags v-model="selectedAttribute.buckets"
                                                 no-outer-focus
                                                 class="mb-2 p-2"
                                                 placeholder="Informe um limite para o bucket"
                                                 duplicate-tag-text="Valor já informado"
                                                 add-button-text="+"
                                                 input-type="number" />
                                    <p v-if="selectedAttribute.buckets">
                                        -∞ ... {{[...selectedAttribute.buckets].sort().join(' ... ')}} ... +∞
                                    </p>
                                </template>

                                <label for="">Tratamento para valores ausentes:</label>
                                <select v-model="selectedAttribute.missing_data"
                                        class="form-control form-control-sm">
                                    <option />
                                    <option value="media">
                                        Substituir pela média aproximada
                                    </option>
                                    <option value="median">
                                        Substituir pela mediana
                                    </option>
                                    <!-- <option value="mode">Moda</option> -->
                                    <option value="constant">
                                        Valor constante
                                    </option>
                                    <option value="remove">
                                        Remover o registro
                                    </option>
                                </select>
                            </template>
                            <template v-if="selectedAttributeUsed && selectedAttribute.feature_type === 'textual'">
                                <label for="">Tratamento para dado textual:</label>
                                <select v-model="selectedAttribute.transform"
                                        class="form-control form-control-sm mb-3">
                                    <option value="token_hash">
                                        Tokenizar e hash
                                    </option>
                                    <option value="token_stop_hash">
                                        Tokenizar, remover stop words e hash
                                    </option>
                                    <option value="count_vectorizer">
                                        Vetor de contagem (counts vectorization)
                                    </option>
                                    <option value="word_2_vect">
                                        Vetorizar usando Word2Vect
                                    </option>
                                </select>
                                <label for="">Tratamento para valores ausentes:</label>
                                <select v-model="selectedAttribute.missing_data"
                                        class="form-control form-control-sm">
                                    <option />
                                    <option value="constant">
                                        Valor constante
                                    </option>
                                    <option value="remove">
                                        Remover o registro
                                    </option>
                                </select>
                            </template>
                            <template v-if="selectedAttribute.missing_data === 'constant'">
                                <label>Substituir valores ausentes
                                    por:</label>
                                <input v-model="selectedAttribute.constant"
                                       :type="(selectedAttribute.feature_type === 'numerical') ? 'number': 'text'"
                                       class="form-control form-control-sm"
                                       maxlength="100">
                            </template>
                        </div>
                    </div>
                </div>
                <div v-else
                     class="text-center text-secondary mt-5 pt-5">
                    <h4>Selecione um atributo à esquerda para editá-lo.</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        attributes: { type: Array, required: true },
        features: { required: true, type: Object, default: () => { return { forms: {} } } },
        target: { type: String, default: () => null },
        supervisioned: { type: Boolean },
    },
    data() {
        return {
            selectedAttribute: null,
            selectedTarget: null,
            flagUpdating: false, //used to avoid changing usage when handling enable checkboxes.
        }
    },
    computed: {
        selectedAttributeUsed() {
            return this?.selectedAttribute?.usage !== 'unused';
        },
    },
    mounted() {
        const attrLookup = new Map((this.features?.forms?.features?.value || []).map((attr) => [attr.name, attr]));

        if (!this.features.forms) {
            this.features.forms = { features: { value: [] } };
        } else if (!this.features.forms.features) {
            this.features.forms.features = { value: [] };
        }
        this.features.forms.features.value = this.attributes.map((attr) => {
            let cloned;
            if (attrLookup.has(attr.name)) {
                cloned = { ...attrLookup.get(attr.name) };
                if (cloned.usage === 'label') {
                    this.selectedTarget = attr;
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
                        cloned.transform = 'keep'
                    }
                } else {
                    cloned.feature_type = 'categorical';
                    if (!cloned.transform) {
                        cloned.transform = 'hashing'
                    }
                }
            }
            /* Remove these properties and instead consider the 'usage' property */
            delete cloned.feature;
            delete cloned.label;

            if (attr.name === this.target) {
                this.selectedTarget = cloned;
            }

            return cloned;
        });
    },
    methods: {
        changeUsage(usage) {
            this.selectedAttribute.usage = usage;
            this.flagUpdating = true;
            /* Remove usage = label for previous selected target */
            if (usage === 'label') {
                if (this.selectedTarget && this.selectedAttribute !== this.selectedTarget) {
                    this.selectedTarget.usage = 'feature';
                }
                this.selectedTarget = this.selectedAttribute;
                this.$emit('update-target', this.selectedTarget.name);
            } else if (usage == 'unsed') {
                if (this.selectedTarget && this.selectedAttribute === this.selectedTarget) {
                    this.selectedTarget = null;
                }
            } else if (this.selectedAttribute === this.selectedTarget) {
                this.selectedTarget = null;
            }
        },
        handleSelectAttribute(attr) {
            this.selectedAttribute = attr;
        },
        handleEnable(enabled) {
            if (this.flagUpdating) {
                this.flagUpdating = false;
            } else {
                this.selectedAttribute.usage = enabled ? 'feature' : 'unused';
            }
        }
    },
}
</script>
<style scoped>
    .features-list {
        max-height: 52vh;
        overflow-y: auto;
    }
</style>
