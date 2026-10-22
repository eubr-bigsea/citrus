<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center">
            <h1>{{props.add ? $t('sourceCode.addTitle') : $t('sourceCode.editTitle')}}</h1>
        </div>
        <hr>
        <div v-if="loadError" class="alert alert-danger" role="alert">
            {{loadError}}
            <router-link :to="{ name: 'sourceCodeList' }" class="alert-link ms-2">
                {{$t('actions.back')}}
            </router-link>
        </div>
        <form v-else-if="sourceCode" class="codeEdit" novalidate @submit.prevent="save">
            <div class="row">
                <div class="col-xl-5 col-lg-6">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="h6 text-uppercase text-muted">
                                {{$t('sourceCode.identification')}}
                            </h2>
                            <div class="row g-3">
                                <div class="col-12">
                                    <label for="source-code-name" class="form-label fw-bold">{{$t('common.name')}}</label>
                                    <input id="source-code-name" ref="nameInput" v-model="sourceCode.name" type="text"
                                           class="form-control" :class="{ 'is-invalid': errors.name }" required
                                           @input="errors.name = ''">
                                    <div class="invalid-feedback">
                                        {{errors.name}}
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="enabled-box">
                                        <b-form-checkbox v-model="sourceCode.enabled" switch>
                                            {{$t('common.enabled')}}
                                        </b-form-checkbox>
                                        <div class="form-text enabled-hint">
                                            {{$t('sourceCode.enabledHint')}}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label for="source-code-help" class="form-label fw-bold">{{$t('titles.help')}}</label>
                                    <textarea id="source-code-help" v-model="sourceCode.help" class="form-control"
                                              rows="2" />
                                    <div class="form-text">
                                        {{$t('sourceCode.helpHint')}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="h6 text-uppercase text-muted">
                                {{$t('sourceCode.dependencies')}}
                            </h2>
                            <div class="row g-3">
                                <div class="col-12">
                                    <label for="source-code-requirements" class="form-label fw-bold">
                                        {{$t('titles.requirement', 2)}}
                                    </label>
                                    <textarea id="source-code-requirements" v-model="sourceCode.requirements"
                                              class="form-control code-text" rows="5" placeholder="pandas==2.0" />
                                    <div class="form-text">
                                        {{$t('sourceCode.requirementsHint')}}
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-bold" @click="focusTextarea">{{$t('titles.imports', 2)}}</label>
                                    <div @click="focusTextarea">
                                        <prism-editor v-model="sourceCode.imports" :highlight="highlighterImport"
                                                      class="prism-editor-wrapper-disabled code3" :readonly="false"
                                                      aria-label="Imports" />
                                    </div>
                                    <div class="form-text">
                                        {{$t('sourceCode.importsHint')}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-7 col-lg-6">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="h6 text-uppercase text-muted">
                                {{$t('sourceCode.codeSection')}}
                            </h2>
                            <div class="form-text mb-2">
                                {{$t('sourceCode.codeHint')}}
                            </div>
                            <div :class="{ 'code-invalid': errors.code }" @click="focusTextarea">
                                <prism-editor v-model="sourceCode.code" :highlight="highlighter" line-numbers
                                              class="prism-editor-wrapper-disabled code2 scroll-area" :readonly="false"
                                              aria-label="Code" @input="errors.code = ''" />
                            </div>
                            <div v-if="errors.code" class="text-danger small mt-1" role="alert">
                                {{errors.code}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="action-bar d-flex align-items-center gap-2">
                <button type="submit" class="btn btn-primary" :disabled="saving">
                    <font-awesome-icon v-if="saving" icon="spinner" pulse />
                    <font-awesome-icon v-else icon="fa fa-save" />
                    {{$t('actions.save')}}
                </button>
                <router-link :to="{ name: 'sourceCodeList' }" class="btn btn-outline-secondary">
                    {{$t('actions.cancel')}}
                </router-link>
                <span v-if="isDirty" class="text-warning-emphasis small ms-2" role="status">
                    <font-awesome-icon icon="fa fa-circle" /> {{$t('sourceCode.unsaved')}}
                </span>
            </div>
        </form>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-dark.css'; // import syntax highlighting styles
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import useNotifier from '../../composables/useNotifier.js';

const vm = getCurrentInstance();
const route = vm.proxy.$route;
const router = vm.proxy.$router;
const { t } = useI18n();
const { success, error } = useNotifier(vm.proxy);

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;
const props = defineProps({
    add: { type: Boolean, required: false, default: false },
});

const sourceCode = ref();
const loadError = ref('');
const saving = ref(false);
const errors = ref({ name: '', code: '' });
const nameInput = ref();
// JSON of the last loaded/saved state, used to detect unsaved changes
const snapshot = ref('');
const isDirty = computed(() => Boolean(sourceCode.value) && JSON.stringify(sourceCode.value) !== snapshot.value);

const load = async () => {
    try {
        if (props.add) {
            sourceCode.value = { id: null, name: '', enabled: true, help: '', requirements: '', imports: '', code: '' };
        } else {
            const resp = await axios.get(`${tahitiUrl}/source-codes/${route.params.id}`);
            sourceCode.value = resp.data.data[0];
        }
        snapshot.value = JSON.stringify(sourceCode.value);
    } catch (ex) {
        loadError.value = t('sourceCode.loadError');
        error(ex);
    }
};

const validate = () => {
    errors.value = {
        name: sourceCode.value.name?.trim() ? '' : t('sourceCode.nameRequired'),
        code: sourceCode.value.code?.trim() ? '' : t('sourceCode.codeRequired'),
    };
    return !errors.value.name && !errors.value.code;
};

const save = async () => {
    if (saving.value || !validate()) {
        nameInput.value?.focus();
        return;
    }
    const url = props.add ? `${tahitiUrl}/source-codes` : `${tahitiUrl}/source-codes/${sourceCode.value.id}`;
    saving.value = true;
    try {
        await (props.add ? axios.post : axios.patch)(url, sourceCode.value);
        snapshot.value = JSON.stringify(sourceCode.value);
        success(t('messages.savedWithSuccess', { what: t('titles.code') }));
        router.push({ name: 'sourceCodeList' });
    } catch (ex) {
        error(ex);
    } finally {
        saving.value = false;
    }
};

// Unsaved changes: leaving the route, closing the tab, Ctrl+S to save
onBeforeRouteLeave(() => !isDirty.value || window.confirm(t('sourceCode.unsavedConfirm')));
const beforeUnload = (ev) => {
    if (isDirty.value) ev.preventDefault();
};
const saveShortcut = (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
        ev.preventDefault();
        save();
    }
};
onMounted(() => {
    load();
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('keydown', saveShortcut);
});
onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnload);
    window.removeEventListener('keydown', saveShortcut);
});

/* Prism */
const highlighter = () => highlight(sourceCode.value?.code || '', languages.py, 'py');
const highlighterImport = () => highlight(sourceCode.value?.imports || '', languages.py, 'py');
const focusTextarea = (event) => {
    const elem = event.currentTarget.querySelector('textarea') || event.currentTarget.parentElement?.querySelector('textarea');
    if (elem) {
        elem.focus();
    }
};
</script>
<style scoped>
.code2:deep(textarea), .code3:deep(textarea),
.code2:deep(pre), .code3:deep(pre) {
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace !important;
    font-size: 14px !important;
    line-height: 1.5;
    padding: 10px;
}

.code2 {
    border: 1px solid #ddd;
    border-radius: 3px;
    overflow-y: scroll;
    height: 70vh;
    min-height: 20rem;
}

.code3 {
    border: 1px solid #ddd;
    border-radius: 3px;
    overflow-y: scroll;
    height: 140px;

}

.code-invalid .code2 {
    border-color: var(--bs-form-invalid-border-color, #dc3545);
}

.code-text {
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
}

/* in its own block, below the floated switch input, with room for the label offset */
.enabled-hint {
    position: relative;
    clear: both;
    margin: 0.35rem 0 0;
    padding-left: 2.5em;
}

.action-bar {
    position: sticky;
    bottom: 0;
    padding: 0.75rem 0;
    background: var(--bs-body-bg, #fff);
    border-top: 1px solid #dee2e6;
}
</style>
