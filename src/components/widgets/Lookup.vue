<template>
    <div>
        <LabelComponent :field="field" :value="value" />
        <div v-if="readOnly || !field.editable">
            <input disabled :value="displayLabel" class="form-control form-control-sm">
        </div>
        <div v-else class="mb-1">
            <input disabled :value="displayLabel" class="form-control form-control-sm">
            <b-link variant="sm" @click.prevent="openModal">
                <span v-if="selected === '' || selected === null">{{ $t('actions.chooseOption') }}</span>
                <span v-if="selected !== '' && selected !== null">{{ $t('actions.changeOption') }}</span>
            </b-link>
            <b-modal ref="modal" size="lg" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')" no-fade>
                {{ field.help }}
                <v-server-table :show-skeleton="false" :columns="['id', 'name', 'tags']" class="lookupTable"
                    :options="tableOptions" ref="table">
                    <template #value="props">
                        <a href="#" @click.prevent="select($event, props.row)">{{ props.row.value }}</a>
                    </template>
                    <template #name="props">
                        <a href="#" @click.prevent="select($event, props.row)">{{ props.row.name }}</a>
                    </template>
                    <template #id="props">
                        <a href="#" @click.prevent="select($event, props.row)">{{ props.row.id }}</a>
                    </template>
                    <!--

                        <template #tags="props">
                            <div v-show="props.row.tags.length && props.row.tags[0]">
                                <span v-for="t in props.row.tags" :key="t" class="badge badge-pill bg-primary">
                                    {{ t }}
                                </span>
                            </div>
                        </template>
                    -->
                </v-server-table>
                <template #footer>
                    <div class="w-100">
                        <b-button variant="secondary" size="sm" class="btn-sm ms-1 float-end" @click="closeModal">
                            {{ $t('actions.cancel') }}
                        </b-button>
                        <b-button variant="outline-primary" size="sm" class="btn-sm float-end" @click="removeValue">
                            {{ $t('actions.removeValue') }}
                        </b-button>
                    </div>
                </template>
            </b-modal>
        </div>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import axios from 'axios';
import Widget from '@/mixins/Widget.js';
import Notifier from '@/mixins/Notifier.js';
let limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
export default {
    name: 'LookupComponent',
    components: { LabelComponent },
    mixins: [Widget, Notifier],
    data() {
        const self = this;
        return {
            label: '',
            lookupOptions: [],
            selectedValue: null,
            finalUrl: null,
            tableOptions: {
                perPage: 5,
                perPageValues: [],
                filterable: true,
                skin: "table-sm table table-hover table-bordered table-sm",
                sortIcon: {
                    base: 'sort-base',
                    is: 'sort-is ms-10',
                    up: 'sort-up',
                    down: 'sort-down'
                },
                columnsClasses: {
                    key: 'text-center',
                    value: '',
                    tags: ''
                },
                texts: {
                    count: this.$t('common.pagerShowing'),
                    filter: this.$t('common.filter', 1),
                    limit: this.$t('common.limit'),
                },
                headings: {
                    key: 'Id',
                    user: this.$t('common.name'),
                    tags: this.$t('common.tag', 2)
                },
                requestFunction: async function (data) {
                    data.sort = data.orderBy;
                    data.asc = data.ascending === 1 ? 'true' : 'false';
                    data.size = data.limit;
                    data.name = data.query;
                    if (self.finalUrl) {
                        try {
                            const resp = await axios.get(self.finalUrl, { params: data });
                            return {
                                data: resp.data.data,
                                count: resp.data.pagination.total
                            };
                        } catch (e) {
                            self.error(e);
                        }
                    } else {
                        return {data: [], count: 0}
                    }
                }
            }
        }
    },
    computed: {
        pairOptionValueList() {
            return JSON.parse(this.field.values);
        },
        selected: {
            get() {
                return this.selectedValue || this.field.default;
            },
            set(newValue) {
                this.selectedValue = newValue;
            }
        },
        displayLabel() {
            return this.label ? (this.selected + ' - ' + this.label) : '';
        }
    },
    async mounted() {
        if (this.field.values_url) {
            let self = this;
            let url = self.field.values_url;
            if (url.startsWith('`')) {
                url = self.replacer(url.substring(1, url.length - 1),
                    { LIMONERO_URL: limoneroUrl });
            }
            this.finalUrl = url;
            if (this.value){
                url += `&id=${this.value}`; //FIXME
            }
            try {
                debugger
                const resp = await axios.get(url);
                self.selected = self.value;
                let data = resp.data.data || resp.data;
                this.lookupOptions = data.map((v) => {
                    return {
                        "key": v.id, "value": v.name,
                        "tags": (v.tags || '').split(',')
                    };
                });
                if (self.value) {
                    const sel = this.lookupOptions.find((item) => {
                        return Number(item.key) === Number(self.value);
                    });
                    this.label = sel ? sel.value : '';
                } else {
                    this.label = '';
                }
            } catch (e) {
                this.error(e);
            }
        } else if (this.field.values) {
            JSON.parse(this.field.values).forEach((opt) => {
                this.lookupOptions.push(opt);
            });
        }
    },
    methods: {
        removeValue() {
            this.label = '';
            this.triggerUpdateEvent(this.message, this.field, null, null);
            this.closeModal();
        },
        closeModal() {
            this.$refs.modal.hide();
        },
        openModal() {
            this.$refs.table.refresh();
            this.$refs.modal.show();
        },
        replacer(tpl, data) {
            let re = /(\$\{(.+)\})/g;
            let match = null;
            while ((match = re.exec(tpl))) {
                if (data[match[2]]) {
                    tpl = tpl.replace(match[1], data[match[2]]);
                }
                re.lastIndex = 0;
            }
            tpl = tpl.replace('&list=true', '');
            return tpl;
        },
        select(evt, newValue) {
            this.selected = newValue.id;
            this.label = newValue.name;
            this.triggerUpdateEvent(this.message, this.field, this.selected,
                this.label);
            this.closeModal();
        }
    },
    ready: function () {
        //console.debug(this.field, this.field['default'], this.value)
        if (this.field['default'] && (this.value === null || this.value === '')) {
            this.value = this.field['default'];
        }
    },

};

</script>
<style scoped>
.lookupTable tr:nth-child(1) {
    width: 200px;
}

.lookupTable th {
    background: red
}
</style>
