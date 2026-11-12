<template>
    <b-modal ref="modal" size="lg" scrollable hide-footer
             title="Selecionar script" @show="load('')">
        <div class="text-muted small mb-2">
            <font-awesome-icon icon="fa fa-folder" class="me-1" />
            <code>{{serverBase}}</code>
        </div>
        <div v-if="error" class="alert alert-danger py-2 mb-0">
            <font-awesome-icon icon="fa fa-circle-xmark" class="me-1" />
            {{error}}
        </div>
        <div v-else-if="!entries['']" class="text-muted py-3 text-center">
            <font-awesome-icon icon="fa fa-circle-notch" spin class="me-1" />
            Carregando...
        </div>
        <div v-else-if="!visible.length" class="text-muted py-3 text-center">
            Nenhum arquivo encontrado.
        </div>
        <div v-if="entries[''] && visible.length" class="tree-header">
            <span>Nome</span>
            <span class="tree-size">Tamanho</span>
            <span class="tree-mtime">Modificado</span>
        </div>
        <ul v-if="!error && entries[''] && visible.length" class="file-tree list-unstyled mb-0">
            <li v-for="n in visible" :key="n.path">
                <div v-if="n.type === 'empty'" class="tree-row text-muted fst-italic"
                     :style="{ paddingLeft: `${n.depth * 1.5 + 2.25}rem` }">
                    (pasta vazia)
                </div>
                <button v-else type="button" class="tree-row"
                        :style="{ paddingLeft: `${n.depth * 1.5 + 0.5}rem` }"
                        :title="`${serverBase}/${n.path}`"
                        @click="n.type === 'directory' ? toggle(n) : select(n)">
                    <span class="tree-label">
                        <span class="tree-chevron">
                            <font-awesome-icon v-if="n.type === 'directory'"
                                               :icon="open[n.path] ? 'fa fa-chevron-down' : 'fa fa-chevron-right'" />
                        </span>
                        <font-awesome-icon v-if="n.type === 'directory'" fixed-width class="me-2 text-warning"
                                           :icon="open[n.path] ? 'fa fa-folder-open' : 'fa fa-folder'" />
                        <font-awesome-icon v-else fixed-width class="me-2"
                                           :icon="`fa ${fileIcon(n.name).icon}`"
                                           :style="{ color: fileIcon(n.name).color }" />
                        <span class="tree-name">{{n.name}}</span>
                        <font-awesome-icon v-if="loading[n.path]" icon="fa fa-circle-notch" spin
                                           class="ms-2 text-muted" />
                    </span>
                    <span class="tree-size">{{n.type === 'file' ? formatSize(n.size) : ''}}</span>
                    <span class="tree-mtime">{{formatDate(n.mtime)}}</span>
                </button>
            </li>
        </ul>
    </b-modal>
</template>

<script setup>
import axios from 'axios';
import { computed, reactive, ref } from 'vue';

const emit = defineEmits(['select']);
const modal = ref();

// nginx serves the listing next to the other services: .../api/v1/tahiti -> .../api/v1/scripts-lemonade/
const baseUrl = import.meta.env.VITE_TAHITI_URL.replace(/\/tahiti\/?$/, '/scripts-lemonade/');
// Server-side directory that nginx exposes; used to build the full path stored in the cell.
const serverBase = (import.meta.env.VITE_SCRIPTS_BASE_PATH || '/srv/scripts-lemonade').replace(/\/$/, '');

const entries = reactive({}); // directory ('' or 'a/b/') -> [{ name, type, size }]
const open = reactive({});
const loading = reactive({});
const error = ref('');

const FILE_ICONS = {
    py: { icon: 'fa-file-code', color: '#3572a5' },
    sql: { icon: 'fa-database', color: '#6c757d' },
    sh: { icon: 'fa-terminal', color: '#198754' },
};
const fileIcon = (name) =>
    FILE_ICONS[name.split('.').pop().toLowerCase()] ?? { icon: 'fa-file', color: '#8a8f98' };

// nginx autoindex gives mtime as an RFC 1123 string (GMT)
const formatDate = (value) => {
    const d = value ? new Date(value) : null;
    return d && !isNaN(d) ? d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';
};
const formatSize = (n) => {
    if (n === undefined) return '';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

const load = async (dir) => {
    if (entries[dir]) return;
    error.value = '';
    loading[dir] = true;
    try {
        const { data } = await axios.get(baseUrl + dir.split('/').map(encodeURIComponent).join('/'));
        entries[dir] = [...data].sort((a, b) =>
            (a.type === 'directory') === (b.type === 'directory')
                ? a.name.localeCompare(b.name)
                : (a.type === 'directory' ? -1 : 1));
    } catch (e) {
        error.value = `Não foi possível listar ${serverBase}/${dir}`;
    } finally {
        loading[dir] = false;
    }
};

const visible = computed(() => {
    const out = [];
    const walk = (dir, depth) => {
        for (const e of entries[dir] ?? []) {
            const path = `${dir}${e.name}${e.type === 'directory' ? '/' : ''}`;
            out.push({ ...e, path, depth });
            if (e.type === 'directory' && open[path] && entries[path]) {
                if (entries[path].length) {
                    walk(path, depth + 1);
                } else {
                    out.push({ type: 'empty', path: `${path}.empty`, depth: depth + 1 });
                }
            }
        }
    };
    walk('', 0);
    return out;
});

const toggle = (node) => {
    open[node.path] = !open[node.path];
    if (open[node.path]) load(node.path);
};
const select = (node) => {
    emit('select', `${serverBase}/${node.path}`);
    modal.value.hide();
};

defineExpose({ show: () => modal.value.show() });
</script>

<style scoped>
.file-tree {
    font-size: 0.9rem;
}
.tree-row {
    width: 100%;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-right: 0.5rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    text-align: left;
    color: inherit;
}
button.tree-row:hover {
    background: var(--bs-secondary-bg, #f1f3f5);
}
.tree-chevron {
    display: inline-block;
    width: 1rem;
    margin-right: 0.25rem;
    font-size: 0.7rem;
    color: var(--bs-secondary-color, #6c757d);
}
.tree-label {
    display: flex;
    align-items: center;
    min-width: 0;
}
.tree-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tree-mtime,
.tree-size {
    text-align: right;
    font-size: 0.75rem;
    white-space: nowrap;
    color: var(--bs-secondary-color, #6c757d);
}
/* header and rows share the same columns so they always line up */
.tree-row,
.tree-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 4.5rem 9rem;
    column-gap: 1rem;
    align-items: center;
}
.tree-header {
    padding: 0 0.5rem 0.3rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid var(--bs-border-color, #dee2e6);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--bs-secondary-color, #6c757d);
}
</style>
