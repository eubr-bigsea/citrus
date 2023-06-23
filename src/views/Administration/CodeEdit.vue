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
                                        <button class="btn btn-success mr-1 btn-spinner" @click.stop="save">
                                            <font-awesome-icon icon="spinner" class="icon" />
                                            <font-awesome-icon icon="fa fa-save" />
                                            {{$tc('actions.save')}}
                                        </button>
                                        <router-link :to="{ name: 'codeLibrary' }" class="btn btn-secondary mr-1">
                                            {{$tc('actions.cancel')}}
                                        </router-link>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <prism-editor v-model="code" class="my-editor" :highlight="highlighter" line-numbers />
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
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles

export default {
    components: {
        PrismEditor
    },
    data: () => ({
        code: '',
        lineNumbers: true
    }),
    methods: {
        highlighter(code) {
            return highlight(code, languages.py); //returns html
        }
    }
};
</script>

<style>

</style>
