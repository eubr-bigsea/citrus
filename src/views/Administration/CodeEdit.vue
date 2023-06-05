<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>Editar Código</h1>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    Last update: 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="d-flex justify-content-between col-md-12 border-bottom pt-3 pb-3">
                                    <h4>File Name</h4> 
                                    <router-link class="btn btn-success btn-sm" :to="{name: 'codeLibrary'}">
                                      Salvar
                                    </router-link>
                                </div>
                                <div class="card-body">
                                  <pre>
                                    <code>
                                      <textarea name="" id="" cols="200" rows="10"></textarea>

                                    </code>
                                  </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>

export default {
    components: {
    },
    data() {
        return {

        };
    },
    methods: {
       
    },

};
</script>

<style scoped>

</style>
