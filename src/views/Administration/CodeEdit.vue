<template>
    <main role="main">
        <div class="row codeEdit">
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
                                    <div>
                                        <button class="btn btn-success mr-1 btn-spinner"
                                                @click.stop="save">
                                            <font-awesome-icon icon="spinner"
                                                               pulse
                                                               class="icon" />
                                            <font-awesome-icon icon="fa fa-save" />
                                            {{$tc('actions.save')}}
                                        </button>
                                        <router-link :to="{name: 'codeLibrary'}"
                                                     class="btn btn-secondary mr-1">
                                            {{$tc('actions.cancel')}}
                                        </router-link>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <textarea id="" name="" cols="1000" rows="10"></textarea>
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

<style>
.codeEdit textarea {
  width: 100%;
  resize: none;
  background-color: unset;
  border: none;
  tab-size: 8;
  outline: none;
  overflow: auto hidden;
  font-size: 12px;
  line-height: 20px;
  overflow-wrap: normal;
  /* white-space: pre; */
  /* caret-color: transparent; */
}





</style>
