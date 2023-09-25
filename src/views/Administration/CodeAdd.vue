<template>
    <main role="main" class="codeAdd">
        <div class="card">
            <div class="card-body d-flex justify-content-between flex-column ">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>
                            {{$t('actions.addSourceCode')}}
                        </h1>
                    </div>
                    <hr>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                        <br>
                        <input v-model="codeName" type="text" class="form-control"
                               required maxlength="100">
                    </div>
                    <div class="col-md-6">
                        <label for="enabled" class="font-weight-bold">{{$tc('common.status')}}:</label>
                        <b-form-checkbox id="enabled" v-model="codeStatus">
                            {{$tc('common.enabled')}}
                        </b-form-checkbox>
                    </div>
                </div>

                <div class="row mt-2">
                    <div class="col-md-6">
                        <label class="font-weight-bold">{{$tc('common.description')}}:</label>
                        <br>
                        <textarea id="" v-model="codeDescription" name="" class="form-control" 
                                  rows="3" />
                    </div>
                </div>

                <div class="row mt-4 mb-2">
                    <div class="col-md-10">
                        <input id="" type="file" name="" @change="addFile">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-12 pt-2">
                        <hr>
                        <button class="btn btn-primary mr-1 btn-spinner" @click="[addCode(), reset()]">
                            <font-awesome-icon icon="fa fa-save" />
                            {{$tc('actions.save')}}
                        </button>
                        <router-link :to="{name: 'codeLibrary'}"
                                     class="btn btn-secondary mr-1">
                            {{$tc('actions.cancel')}}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>

export default {
    data() {
        return {
            codeName: "",
            codeStatus: null,
            codeDescription: "",
            codeFile: null
        };
    },
    methods: {
        addFile(e) {
            this.codeFile = e.target.files[0];
        },
        addCode() {
            console.log(this.codeName, this.codeStatus, this.codeDescription, this.codeFile);
        },
        reset() {
            this.codeName = "";
            this.codeStatus = null;
            this.codeDescription = "";
            this.codeFile = null;
        }
    }
};
</script>

<style scoped>
.codeAdd textarea {
  resize: none;
}


</style>