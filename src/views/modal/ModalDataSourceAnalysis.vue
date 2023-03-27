<template>
    <b-modal id="modal" title="Adicionar Análise">
        <label for="exampleFormControlSelect1">Atributos</label>
        <select id="exampleFormControlSelect1" class="form-control">
            <option v-for="attr in atributtes" :key="attr.name" :value="attr.name">
                {{attr.name}}
            </option>
        </select>
        <label for="exampleFormControlSelect1">Tipo</label>
        <select id="exampleFormControlSelect1" class="form-control">
            <option>Unidimensional</option>
            <option>Bidimensional</option>
            <option>Multidimensional</option>
            <option>Testes Estatísticos</option>
            <option>Ajustar (fit) a uma distribuição</option>
            <option>Séries temporais</option>
        </select>
        <p>Análises:</p>
        <b-form-checkbox-group stacked>
            <b-form-checkbox value="orange">
                Arange
            </b-form-checkbox>
            <b-form-checkbox value="apple">
                Apple
            </b-form-checkbox>
            <b-form-checkbox value="pineapple">
                Pineapple
            </b-form-checkbox>
            <b-form-checkbox value="grape">
                Grape
            </b-form-checkbox>
        </b-form-checkbox-group>
        <template #modal-footer>
            <b-button variant="primary" @click="[addCard(), $bvModal.hide('modal')]">
                Ok
            </b-button>
            <b-button variant="secondary" @click="$bvModal.hide('modal')">
                Cancel
            </b-button>
        </template>
    </b-modal>
</template>

<script>

export default {
    props: {
        atributtes: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    methods: {
        addCard() {
            this.cards = this.cards + 1;
        }
    }
};
</script>
