<template>
    <main role="main">
        <div class="row codeEdit">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>Editar Código</h1>
                    </div>
                    <hr>
                    <div class="row" v-if="sourceCode">
                        <div class="col-md-12 col-xg-12 mx-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="font-weight-bold">{{ $tc('common.name') }}:</label>
                                                <input v-model="sourceCode.name" type="text" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{ $t('titles.requirement', 2)
                                                    }}:</label>
                                                <input v-model="sourceCode.requirements" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{ $tc('titles.imports', 2) }}:</label>
                                                <input v-model="sourceCode.imports" class="form-control">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="font-weight-bold">{{ $tc('titles.help') }}:</label>
                                                <input v-model="sourceCode.help" class="form-control">
                                            </div>
                                            <div class="col-md-3 mt-3 mb-3 mt-3">
                                                <b-form-checkbox v-model="sourceCode.enabled">
                                                    {{$t('common.enabled')}}
                                                </b-form-checkbox>
                                            </div>
                                            <div class="col-md-12">
                                                <label>{{ $tc('common.parameters', 2) }}:</label>
                                                <textarea v-model="sourceCode.code" class="form-control" rows="8" />
                                            </div>
                                        </div>
                                    </form>
                                    <div class="row">
                                        <div class="col-md-12 mt-4 border-top pt-2">
                                            <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                                                <font-awesome-icon icon="spinner" pulse class="icon" />
                                                <font-awesome-icon icon="fa fa-save" />
                                                {{ $tc('actions.save') }}
                                            </button>
                                            <router-link :to="{ name: 'sourceCodeList' }"
                                                class="btn btn-outline-secondary mr-1">
                                                {{ $tc('actions.cancel') }}
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
import { ref, watch, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles
import axios from 'axios';

const vm = getCurrentInstance();
const route = vm.proxy.$route;
const router = vm.proxy.$router;
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
        sourceCode.value = {id: null, suspicious: false,};
    } else {
        const resp = await axios
            .get(`${tahitiUrl}/source-codes/${route.params.id}`);
        sourceCode.value = resp.data;
    }
};
const save = async (event) => {
    let url = `${tahitiUrl}/source-codes/${sourceCode.id}`;
    let axiosCall = axios.patch;


    if (props.add) {
        url = `${tahitiUrl}/source-codes`;
        axiosCall = axios.post
    }
    event.target.setAttribute('disabled', 'disabled');
    event.target.classList.remove('btn-spinner');

    try {
        const resp = await axiosCall(url, sourceCode.value);
        sourceCode.value = resp.data;
        Vue.nextTick(() => {
            isDirty.value = false;
        });
        /*
        self.success(
            this.$t('messages.savedWithSuccess', {
                what: this.$tc('titles.sourceCode', 1)
            })
        );*/
        router.push({ name: 'sourceCodeList' });
    } catch (ex) {
        console.debug(ex)
    } finally {
        event.target.removeAttribute('disabled');
        event.target.classList.add('btn-spinner');
    }
};
</script>
