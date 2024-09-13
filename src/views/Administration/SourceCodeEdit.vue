<template>
    <main role="main">
        <div class="row codeEdit">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>Editar Código</h1>
                    </div>
                    <hr>
                    <div v-if="sourceCode" class="row">
                        <div class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <label class="font-weight-bold">{{$t('common.name')}}:</label>
                                                        <input v-model="sourceCode.name" type="text"
                                                               class="form-control">
                                                    </div>
                                                    <div class="col-md-3 mt-3 mb-3 mt-3">
                                                        <b-form-checkbox v-model="sourceCode.enabled">
                                                            {{$t('common.enabled')}}
                                                        </b-form-checkbox>
                                                    </div>
                                                    <div class="col-md-12 mt-2">
                                                        <label class="font-weight-bold">{{$t('titles.requirement', 2)}}:</label>
                                                        <textarea v-model="sourceCode.requirements" class="form-control"
                                                                  rows="5" />
                                                    </div>
                                                    <div class="col-md-12 mt-2">
                                                        <label class="font-weight-bold">{{$t('titles.imports', 2)}}:</label>
                                                        <div @click="focusTextarea">
                                                            <prism-editor ref="prism" v-model="sourceCode.imports"
                                                                          :highlight="highlighterImport"
                                                                          class="prism-editor-wrapper-disabled code3"
                                                                          :readonly="false" />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 mt-2">
                                                        <label class="font-weight-bold">{{$t('titles.help')}}:</label>
                                                        <textarea v-model="sourceCode.help" class="form-control"
                                                                  rows="5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <label class="font-weight-bold">{{$t('titles.code')}}:</label>
                                                <div class="form-text">
                                                    Escreva o código Python na forma de um método/função, geralmente com
                                                    parâmetros.
                                                    Os módulos a serem importados com o comando <code>import</code>
                                                    devem estar no
                                                    campo "Importar".
                                                </div>
                                                <prism-editor ref="prism" v-model="sourceCode.code"
                                                              :highlight="highlighter"
                                                              class="prism-editor-wrapper-disabled code2 scroll-area"
                                                              :readonly="false" />
                                            </div>
                                        </div>
                                    </form>
                                    <div class="row">
                                        <div class="col-md-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary me-1 btn-spinner" @click.stop="save">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <font-awesome-icon icon="fa fa-save" />
                                                {{$t('actions.save')}}
                                            </button>
                                            <router-link :to="{ name: 'sourceCodeList' }"
                                                         class="btn btn-outline-secondary me-1">
                                                {{$t('actions.cancel')}}
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {nextTick, ref, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles
import axios from 'axios';
import useNotifier from '../../composables/useNotifier.js';

const vm = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const { t } = useI18n();
const { success, error } = useNotifier(vm.proxy);

/*
watch(route.params.id, () => {
    load().then(() => {
        Vue.nextTick(() => {
            isDirty.value = false;
        });
    });
});*/

onMounted(() => {
    load();
});
const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const props = defineProps({
    add: { type: Boolean, required: false, default: false },
});
const isDirty = ref(false);
const sourceCode = ref();

const load = async () => {
    if (props.add) {
        sourceCode.value = { id: null, suspicious: false, imports: '', code: ''};
    } else {
        const resp = await axios
            .get(`${tahitiUrl}/source-codes/${route.params.id}`);
        sourceCode.value = resp.data.data[0];
    }
};
const save = async (event) => {
    let url = `${tahitiUrl}/source-codes/${sourceCode.value.id}`;
    let axiosCall = axios.patch;


    if (props.add) {
        url = `${tahitiUrl}/source-codes`;
        axiosCall = axios.post;
    }
    event.target.setAttribute('disabled', 'disabled');
    event.target.classList.remove('btn-spinner');

    try {
        const resp = await axiosCall(url, sourceCode.value);
        sourceCode.value = resp.data.data[0];
        nextTick(() => {
            isDirty.value = false;
        });
        success(t('messages.savedWithSuccess', { what: t('titles.code') }));
        setTimeout(() => {
            router.push({ name: 'sourceCodeList' });
        }, 100)
    } catch (ex) {
        error(ex);
    } finally {
        event.target.removeAttribute('disabled');
        event.target.classList.add('btn-spinner');
    }
};
/* Prism */
const highlighter = () => {
    if (sourceCode.value !== '') {
        return highlight(sourceCode.value.code, languages.py, 'py');
    }
};
const highlighterImport = () => {
    if (sourceCode.value !== '') {
        return highlight(sourceCode.value.imports || '', languages.py, 'py');
    }
};
const focusTextarea = (event) => {
    const elem = event.target.querySelector('textarea');
    if (elem) {
        elem.focus();
    }
};
</script>
<style scoped>
.code2>>>textarea, .code3>>>textarea,
.code2>>>pre, .code3>>>pre {
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace !important;
    font-size: 14px !important;
    line-height: 1.5;
    padding: 10px;
}

.code2 {
    border: 1px solid #ddd;
    border-radius: 3px;
    overflow-y: scroll;
    height: 60vh;

}

.code3 {
    border: 1px solid #ddd;
    border-radius: 3px;
    overflow-y: scroll;
    height: 140px;

}
</style>