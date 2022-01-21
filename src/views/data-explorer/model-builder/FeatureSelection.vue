<template>
    <div>
        <h5>Seleção e ajustes</h5>
        <hr />
        <div class="row">
            <div class="col-md-4 mt-5">
                <b-list-group>
                    <b-list-group-item v-for="attr in attributes" :key="attr.name" class="p-0" role="button"
                        @click="focusedAttribute = attr">
                        <div class="w-100 p-2" :class="{'bg-light': focusedAttribute === attr }">
                            <b-form-checkbox switch>
                                {{attr.name}}
                            </b-form-checkbox>
                        </div>
                    </b-list-group-item>
                </b-list-group>
                {{focusedAttribute}}
            </div>
            <div class="col-md-8 border p-3">
                <div v-if="focusedAttribute">
                    <h6 class="border-bottom mb-4">{{focusedAttribute.name}}</h6>

                    <div class="row">
                        <div class="col-3">
                            <label for="">{{$tc('common.type')}}:</label>
                            <b-form-radio-group stacked>
                                <b-form-radio value="categorical"><span class="fa fa-font"></span>
                                    Categórico</b-form-radio>
                                <b-form-radio value="numeric"># Numérico</b-form-radio>
                                <b-form-radio value="text"><span class="fa fa-italic"></span> Texto
                                </b-form-radio>
                                <!--
                        <b-form-radio value="vector">[ ] Arranjo</b-form-radio>
                        -->
                            </b-form-radio-group>
                        </div>
                        <div class="col-9">
                            <label for="">Tratamento para dado categórico:</label>
                            <select name="" id="" class="form-control form-control-sm">
                                <option value="">Dummy encoding</option>
                                <option value="">Feature hashing</option>
                                <option value="">Usar 0 ou 1 para indicar ausência/presença</option>
                            </select>

                            <label for="">Tratamento para dado numérico:</label>
                            <select name="" id="" class="form-control form-control-sm">
                                <option value="">Manter como está</option>
                                <option value="">Binarizar baseado em limiar</option>
                                <option value="">Usar 0 ou 1 para indicar ausência/presença</option>
                                <option value="">Dividir em quantis</option>
                            </select>

                            <label for="">Tratamento para valores ausentes:</label>
                            <select name="" id="" class="form-control form-control-sm">
                                <option value="">Média</option>
                                <option value="">Mediana</option>
                                <option value="">Moda</option>
                                <option value="">Valor constante</option>
                                <option value="">Ignorar todo o registro (não será usado)</option>
                            </select>

                            <label for="">Tratamento para valores textuais:</label>
                            <select name="" id="" class="form-control form-control-sm">
                                <option value="">Tokenizar e hash</option>
                                <option value="">Tokenizar e hash e SVD ?</option>
                                <option value="">Counts vectorization</option>
                                <option value="">Vetorizar usando TF/IDF</option>
                            </select>
                            <hr>
                            FIXME: mostrar distribuições dos dados
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h6>Selecione um atributo à esquerda para editá-lo.</h6>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            attributes: { type: Array, required: true }
        },
        data() {
            return {
                focusedAttribute: null,
            }
        },

    }
</script>