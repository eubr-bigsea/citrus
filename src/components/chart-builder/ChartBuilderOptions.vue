<template>
    <div class="chart-builder-options">
        <h4>Opções</h4>

        {{ form }}

        <b-form>
            <b-form-group
              id="title"
              label="Título"
              label-for="title"
            >
                <b-form-input
                    id="title"
                    v-model="form.title"
                    type="text"
            ></b-form-input>
            </b-form-group>

            <b-form-checkbox v-model="form.showlegend">Exibir legenda</b-form-checkbox>
        </b-form>
    </div>
</template>
<script>

  export default {
    components: {},
    props: {},
    data() {
    	return {
            form: {
                title: ""
            }
    	}
    },
    computed: {
    },
    methods: {
    }
  }
  </script>
  <style scoped lang="scss">

  </style>
  