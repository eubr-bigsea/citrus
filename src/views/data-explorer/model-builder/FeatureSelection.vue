<template>
    <div>
        <h5>Seleção e ajustes</h5>
        <hr />
        <div class="row">
            <div class="col-md-4">
                <b-list-group>
                    <b-list-group-item v-for="attr in attributes" :key="attr.name" class="p-0 pl-2">
                        <div class="d-flex w-100 justify-content-between p-1">
                            <b-form-checkbox switch>
                                {{attr}}
                            </b-form-checkbox>
                        </div>
                    </b-list-group-item>
                </b-list-group>

            </div>
            <div xv-if="selectedAttribute" class="col-md-8 border-right">
                <h6>Tratar FIXME_NOME</h6>

                <label for="">{{$tc('common.type')}}:</label>
                <b-form-radio-group stacked>
                    <b-form-radio value="categorical"><span class="fa fa-font"></span>
                        Categórico</b-form-radio>
                    <b-form-radio value="numeric"># Numérico</b-form-radio>
                    <b-form-radio value="text"><span class="fa fa-italic"></span> Text
                    </b-form-radio>
                    <b-form-radio value="vector">[ ] Vetor</b-form-radio>
                </b-form-radio-group>

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
</template>
<script>
    export default {
        props: {
            attributes: {type: Array, required: true}
        }
    }
</script>