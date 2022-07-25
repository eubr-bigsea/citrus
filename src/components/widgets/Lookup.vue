<template>
    <div>
        <LabelComponent :field="field" :value="value"></LabelComponent>
        <div v-if="readOnly || !field.editable">
            <input disabled :value="label ? (selected + ' - ' + label): ''" class="form-control form-control-sm" />
        </div>
        <div v-else class="mb-1">
            <input disabled :value="label ? (selected + ' - ' + label): ''" class="form-control form-control-sm" />
            <b-link variant="sm" @click.prevent="$refs.modal.show()">
                <span v-if="selected === '' || selected === null ">{{$t('actions.chooseOption')}}</span>
                <span v-if="selected !== '' && selected !== null ">{{$t('actions.changeOption')}}</span>
            </b-link>
            <b-modal ref="modal" size="lg" :title="field.label"
                ok-disabled :cancel-title="$t('actions.cancel')" no-fade>
                {{field.help}}
                <v-client-table :data="lookupOptions" :columns="['key', 'value','tags']" class="lookupTable"
                    :options="tableOptions">
                    <template slot="value" slot-scope="props">
                        <a href="#" @click.prevent="select($event, props.row)">{{props.row.value}}</a>
                    </template>
                    <template slot="tags" slot-scope="props">
                        <div v-show="props.row.tags.length && props.row.tags[0]">
                            <span v-for="t in props.row.tags" :key="t" class="badge badge-pill badge-primary">
                                {{t}}
                            </span>
                        </div>
                    </template>
                </v-client-table>
                <div slot="modal-footer" class="w-100">
                    <b-btn variant="secondary" size="sm" class="btn-sm ml-1 float-right" @click="closeModal">{{$t('actions.cancel')}}
                    </b-btn>
                    <b-btn variant="outline-primary" size="sm" class="btn-sm float-right" @click="removeValue">
                        {{$t('actions.removeValue')}}
                    </b-btn>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import axios from 'axios'
    import Widget from '../../mixins/Widget.js';
    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        name: 'LookupComponent',
        components: { LabelComponent },
        mixins: [Widget],
        data() {
            return {
                label: '',
                lookupOptions: [],
                selectedValue: null,
                tableOptions: {
                    perPage: 5,
                    perPageValues: [],
                    sortIcon: {
                        base: 'fa fas',
                        is: 'fa-sort ml-10',
                        up: 'fa-sort-amount-up',
                        down: 'fa-sort-amount-down'
                    },
                    columnsClasses: {
                        key: 'text-center',
                        value: '',
                        tags: ''
                    },
                    texts: {
                        count: this.$t('common.pagerShowing'),
                        filter: this.$tc('common.filter', 1),
                        limit: this.$t('common.limit'),
                    },
                    headings: {
                        key: 'Id',
                        user: this.$t('common.name'),
                        tags: this.$tc('common.tag', 2)
                    },
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
            }
        },
        mounted() {
            if (this.field.values_url) {
                let self = this;
                let url = self.field.values_url;
                if (url.startsWith('`')) {
                    url = self.replacer(url.substring(1, url.length - 1),
                        { LIMONERO_URL: limoneroUrl });
                }
                axios.get(url).then(
                    (resp) => {
                        self.selected = self.value;
                        let data = resp.data.data || resp.data
                        this.lookupOptions = data.map((v) => {
                            return {
                                "key": v.id, "value": v.name,
                                "tags": (v.tags || '').split(',')
                            };
                        });
                        if (self.value) {
                            const sel = this.lookupOptions.find((item) => {
                                return Number(item.key) === Number(self.value)
                            });
                            this.label = sel ? sel.value : '';
                        } else {
                            this.label = '';
                        }
                    }
                ).catch(function (e) {
                    this.$root.$emit('on-error', e);
                }.bind(this));
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
                this.$refs.modal.hide()
            },
            replacer(tpl, data) {
                let re = /(\$\{(.+)\})/g;
                let match = null;
                while ((match = re.exec(tpl))) {
                    if (data[match[2]]) {
                        tpl = tpl.replace(match[1], data[match[2]])
                    }
                    re.lastIndex = 0;
                }
                return tpl;
            },
            select(evt, newValue) {
                this.selected = newValue.key;
                this.label = newValue.value;
                this.triggerUpdateEvent(this.message, this.field, this.selected,
                    this.label);
                this.closeModal()
            }
        },
        ready: function () {
            //console.debug(this.field, this.field['default'], this.value)
            if (this.field['default'] && (this.value === null || this.value === '')) {
                this.value = this.field['default'];
            }
        },

    }

</script>
<style scoped>
    .lookupTable tr:nth-child(1) {
        width: 200px;
    }

    .lookupTable th {
        background: red
    }
</style>
