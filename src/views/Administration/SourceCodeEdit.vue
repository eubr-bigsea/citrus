<template>
    <main role="main">
        <div class="row codeEdit">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>Editar Variável Global</h1>
                    </div>
                    <hr>
                    <div class="row" v-if="globalVariable">
                        <div class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-md-9">
                                                <label class="font-weight-bold">{{ $t('common.name')
                                                }}:</label>
                                                <input v-model="globalVariable.name" type="text" class="form-control" v-focus maxlength="50">
                                            </div>
                                            <div class="col-md-3 mt-3 mb-3 mt-3">
                                                <b-form-checkbox v-model="globalVariable.enabled">
                                                    {{ $t('common.enabled') }}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <label class="font-weight-bold">{{ $t('common.description', 2)
                                                }}:</label>
                                                <textarea v-model="globalVariable.description" class="form-control"
                                                    rows="3"></textarea>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <label class="font-weight-bold">{{ $t('titles.value')
                                                }}:</label>
                                                <textarea v-model="globalVariable.value" class="form-control"
                                                    rows="3"></textarea>
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
                                            <router-link :to="{ name: 'globalVariableList' }"
                                                class="btn btn-outline-secondary mr-1">
                                                {{ $t('actions.cancel') }}
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
import { ref, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles
import axios from 'axios';
import Notifier from '@/notifier.js';

const vm = getCurrentInstance();
const route = vm.proxy.$route;
const router = vm.proxy.$router;
const i18n = vm.proxy.$i18n.vm;
const { success, error } = useNotifier(vm.proxy);


onMounted(() => {
    load();
});
const standUrl = import.meta.env.VITE_STAND_URL;
const props = defineProps({
    add: { type: Boolean, required: false, default: false },
});
const isDirty = ref(false);
const globalVariable = ref();

const load = async () => {
    if (props.add) {
        globalVariable.value = { id: null, description: '', name: '', value: '', enabled: true };
    } else {
        const resp = await axios
            .get(`${standUrl}/global-variables/${route.params.id}`);
        globalVariable.value = resp.data.data[0];
    }
};
const save = async (event) => {
    let url = `${standUrl}/global-variables/${globalVariable.value.id}`;
    let axiosCall = axios.patch;


    if (props.add) {
        url = `${standUrl}/global-variables`;
        axiosCall = axios.post
    }
    event.target.setAttribute('disabled', 'disabled');
    event.target.classList.remove('btn-spinner');

    try {
        const resp = await axiosCall(url, globalVariable.value);
        globalVariable.value = resp.data;
        Vue.nextTick(() => {
            isDirty.value = false;
        });
        success(i18n.$t('messages.savedWithSuccess', { what: 'Variável' }));
        /*
        self.success(
            this.$t('messages.savedWithSuccess', {
                what: this.$t('titles.globalVariable', 1)
            })
        );*/
        router.push({ name: 'globalVariableList' });
    } catch (ex) {
        notifier.error(ex);
    } finally {
        event.target.removeAttribute('disabled');
        event.target.classList.add('btn-spinner');
    }
};
/* Prism */
const highlighter = () => {
    if (globalVariable.value !== '') {
        return highlight(globalVariable.value.code, languages.py, 'py');
    }
};
const highlighterImport = () => {
    if (globalVariable.value !== '') {
        return highlight(globalVariable.value.imports || '', languages.py, 'py');
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
.code2>>>textarea,
.code3>>>textarea,
.code2>>>pre,
.code3>>>pre {
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