<template>
  <main role="main">
        <div>
            <div class="title">
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{$tc('titles.configuration', 2)}}</h1>
                </div>
            </div>
            <v-server-table ref="configurationList" :columns="table.columns" :options="table.options" name="configurationList">
            <template slot="id" slot-scope="props">
                {{props.row.id}}
            </template>
            <template slot="name" slot-scope="props">
                {{props.row.name}}
            </template>
            <template slot="type" slot-scope="props">{{props.row.description}}</template>
            <template slot="type" slot-scope="props">{{props.row.category}}</template>
            <template slot="enabled" slot-scope="props">{{props.row.enabled ? $t('common.yes') : $t('common.no')}}</template>
            <template slot="actions" slot-scope="props">
                <button class="btn btn-sm btn-light" @click="edit(props.row)">
                <font-awesome-icon icon="edit"></font-awesome-icon>
                </button>
            </template>
            </v-server-table>
            
        </div>

    <b-modal id="modalConfig" ref="modalConfig" :title="currentRow? currentRow.name: ''" size="lg">
        <div v-if="currentRow" class="row">
            <div class="col-md-12">
                <label>{{currentRow.description}}:</label>
            </div>
            <div class="col-md-12">
                <template v-if="currentRow.editor === 'TEXTAREA'">
                    <textarea v-model="editableValue" class="form-control text-monospace" rows="20"></textarea>
                </template>
                <template v-if="currentRow.editor === 'TEXT' || currentRow.editor === 'URL'">
                    <input v-model="editableValue" type="text" class="form-control text-monospace"/>
                </template>
                <template v-if="currentRow.editor === 'EMAIL'">
                    <input v-model="editableValue" type="email" class="form-control text-monospace"/>
                </template>
                <template v-if="currentRow.editor === 'PASSWORD'">
                    <input v-model="editableValue" type="password" class="form-control text-monospace"/>
                </template>
                <template v-if="currentRow.editor === 'INTEGER'">
                    <input v-model="editableValue" type="number" class="form-control text-monospace"/>
                </template>
            </div>
        </div>
        <div slot="modal-footer" class="w-100 text-right">
            <button class="btn btn-sm btn-outline-success" @click.prevent.stop="save">
                <font-awesome-icon icon="fa fa-save" /> {{$t('actions.save')}}</button>
            <button class="ml-1 btn btn-sm btn-outline-dark"
                @click="cancel">{{$t('actions.cancel')}}</button>
        </div>

    </b-modal>
  </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier';

const thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  mixins: [Notifier],
  data() {
    return {
        table: {
          columns: ['id', 'name', 'description', 'enabled', 'actions'],
          options: {
            debounce: 800,
            skin: 'table-sm table table-hover',
            columnClasses: { actions: 'th-10'},
            headings: {
              id: 'ID',
              name: this.$tc('common.name'),
              category: this.$tc('common.category'),
              type: this.$tc('common.description'),
              enabled: this.$tc('common.enabled'),
              actions: this.$tc('common.action', 2)
            },
            sortable: ['name', 'id'],
            filterable: ['description', 'name'],
            sortIcon: {
              base: 'fa fas',
              is: 'fa-sort ml-10',
              up: 'fa-sort-amount-up',
              down: 'fa-sort-amount-down'
            },
            preserveState: true,
            saveState: true,
            filterByColumn: false,
            requestFunction: function(data) {
              data.sort = data.orderBy;
              data.asc = data.ascending === 1 ? 'true' : 'false';
              data.size = data.limit;
              data.name = data.query;
    
              data.fields = 'id,name,category,description,enabled,value,editor';
    
              let url = `${thornUrl}/configurations`;
              this.$Progress.start();
              return axios
                .get(url, { params: data })
                .then(resp => {
                  this.$Progress.finish();
                  return {
                    data: resp.data.data,
                    count: resp.data.pagination.total
                  };
                })
                .catch(
                  function(e) {
                    this.$Progress.finish();
                    this.error(e);
                  }.bind(this)
                );
            },
            texts: {
              filter: this.$tc('common.filter'),
              count: this.$t('common.pagerShowing'),
              limit: this.$t('common.limit'),
              noResults: this.$t('common.noData'),
              loading: this.$t('common.loading'),
              filterPlaceholder: this.$t('common.filterPlaceholder')
            }
          }
       },
       editableValue: '',
       currentRow: null,
    }
  },
  
  mounted() {},
  /* Methods */
  methods: {
    save(event){
        const self = this;
        const url = `${thornUrl}/configurations`;
        this.$Progress.start();
        event.target.setAttribute('disabled', 'disabled');
        event.target.classList.remove('btn-spinner');
        axios
          .patch(url, [{id: self.currentRow.id, value: self.editableValue}])
          .then(()=> {
            self.currentRow.value = self.editableValue;
            self.success(
                this.$t('messages.savedWithSuccess', {
                    what: this.$tc('titles.configuration', 1)
                })
            );
          })
          .catch(e => self.error(e))
          .finally(() => {
                 self.cancel();
                 self.$Progress.finish();
                 event.target.removeAttribute('disabled');
                 event.target.classList.add('btn-spinner');
              } 
          );
        return false;

    },
    cancel(){
      this.$refs.modalConfig.hide();
    },
    edit(configuration) {
      const self = this;
      self.currentRow = configuration;
      self.editableValue = configuration.value;
      self.$refs.modalConfig.show();
    }
  },
};
</script>
