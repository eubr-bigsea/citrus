<template>
    <div class="mb-1">
        <LabelComponent :field="field"></LabelComponent>

        <input disabled :value="label ? (selected + ' - ' + label): ''" class="form-control" />

        <b-link v-b-modal="'lookupModal'" variant="sm">
            <span v-if="selected === '' || selected === null ">{{$t('actions.chooseOption')}}</span>
            <span v-if="selected !== '' && selected !== null ">{{$t('actions.changeOption')}}</span>
        </b-link>
        <b-modal id="lookupModal" size="lg" :title="field.label" ok-disabled :cancel-title="$t('actions.cancel')" ref="modal">
            {{field.help}}
            <v-client-table :data="options" :columns="['key', 'value','tags']" class="lookupTable" :options="tableOptions">
                <template slot="value" slot-scope="props">
                    <a href="#" @click.prevent="select($event, props.row)">{{props.row.value}}</a>
                </template>
            </v-client-table>
            <div slot="modal-footer" class="w-100">
                <b-btn @click="closeModal" variant="secondary_sm" class="float-right">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue'
    import axios from 'axios'

    let limoneroUrl = process.env.VUE_APP_LIMONERO_URL
    export default {
        components: { LabelComponent },
        data() {
            return {
                label: '',
                options: [],
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
                        filter: this.$t('common.filter'),
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
                        this.options = data.map((v) => {
                            return {
                                "key": v.id, "value": v.name,
                                "tags": (v.tags || '').split(',')
                            };
                        });
                        this.label = (self.value) 
                            ? this.options.find((item) => {
                                return Number(item.key) === Number(self.value)}).value
                            : '';
                    }
                ).catch(function (e) {
                    this.$root.$emit('on-error', e);
                }.bind(this));
            } else {
                JSON.parse(this.field.values).forEach((opt) => {
                    this.options.push(opt);
                });
            }
        },
        computed: {
            pairOptionValueList() {
                return JSON.parse(this.field.values);
            },
            selected: {
                get() {
                    return this.value || this.field.default;
                },
                set(newValue) {
                    this.value = newValue
                }
            }
        },
        methods: {
            closeModal() {
                this.$refs.modal.hide()
            },
            replacer(tpl, data) {
                let re = /(\$\{(.+)\})/g;
                let match = null;
                while (match = re.exec(tpl)) {
                    if (data[match[2]]) {
                        tpl = tpl.replace(match[1], data[match[2]])
                    }
                    re.lastIndex = 0;
                }
                return tpl;
            },
            updated(e) {
                this.selected = e.target.value;
                this.$root.$emit(this.message, this.field, e.target.value);
            },
            select(evt, newValue) {
                this.selected = newValue.key;
                this.label = newValue.value;
                this.$root.$emit(this.message, this.field, this.selected);
                this.closeModal()
            }
        },
        props: {
            value: 0, field: null, language: { default: 'en' },
            message: {
                type: String,
                default: 'update-form-field-value'
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