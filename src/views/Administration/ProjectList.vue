<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h1>{{ $tc('titles.project', 2) }}</h1>
            <router-link
              :to="{ name: 'AdministrationAddProject' }"
              class="btn btn-sm btn-outline-primary"
            >
              {{ $t('actions.addItem') }}
            </router-link>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-body">
                  <v-server-table
                    ref="projectList"
                    :columns="columns"
                    :options="options"
                    name="projectList"
                  >
                    <template slot="id" slot-scope="props">
                      <router-link
                        :to="{
                          name: 'AdministrationEditProject',
                          params: { id: props.row.id }
                        }"
                      >
                        {{ props.row.id }}
                      </router-link>
                    </template>
                    <template slot="name" slot-scope="props">
                      <router-link
                        :to="{
                          name: 'AdministrationEditProject',
                          params: { id: props.row.id }
                        }"
                      >
                        {{ props.row.name }}
                      </router-link>
                    </template>
                    <template slot="category" slot-scope="props">
                      <router-link
                        :to="{
                          name: 'AdministrationEditProject',
                          params: { id: props.row.id }
                        }"
                      >
                        {{ props.row.category }}
                      </router-link>
                    </template>
                    <template slot="subcategory" slot-scope="props">
                      <router-link
                        :to="{
                          name: 'AdministrationEditProject',
                          params: { id: props.row.id }
                        }"
                      >
                        {{ props.row.subcategory}}
                      </router-link>
                    </template>
                    <template slot="managers" slot-scope="props">
                      <router-link
                        :to="{
                          name: 'AdministrationEditProject',
                          params: { id: props.row.id }
                        }"
                      >
                        <span v-if="props.row.managers">
                          <p v-for="manager in props.row.managers">
                          {{ manager.full_name }}</p>
                        </span>
                      </router-link>
                    </template>
                    <template slot="actions" slot-scope="props">
                      <button
                        class="btn btn-sm btn-light"
                        @click="remove(props.row.id)"
                      >
                        <font-awesome-icon icon="trash" />
                      </button>
                    </template>
                  </v-server-table>
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
import axios from 'axios';
import Notifier from '../../mixins/Notifier';
import { deserialize } from 'jsonapi-deserializer';

let thornUrl = process.env.VUE_APP_THORN_URL;

export default {
  mixins: [Notifier],
  data() {
    return {
      platform: '',
      platforms: [],
      columns: ['id', 'name', 'category', 'subcategory','managers', 'actions'],
      options: {
        debounce: 800,
        skin: 'table-sm table table-hover',
        dateColumns: ['updated'],
        columnClasses: { actions: 'th-10' },
        headings: {
          id: 'ID',
          name: this.$tc('common.project.name'),
          category: this.$tc('common.project.category'),
          subcategory: this.$tc('common.project.subcategory'),
          managers: this.$tc('common.project.managers'),
          actions: this.$tc('common.action', 2)
        },
        sortable: ['name', 'id', 'category', 'subcategory'],
        filterable: ['name', 'id', 'category', 'subcategory'],
        sortIcon: {
          base: 'fa fas',
          is: 'fa-sort ml-10',
          up: 'fa-sort-amount-up',
          down: 'fa-sort-amount-down'
        },
        preserveState: true,
        saveState: true,
        customFilters: ['platform'],
        filterByColumn: false,
        requestFunction: function(data) {
          data.sort = data.orderBy;
          data.asc = data.ascending === 1 ? 'true' : 'false';
          data.size = data.limit;
          data.full_name = data.query;

          data.fields = 'id,name,category,subcategory';

          let url = `${thornUrl}/administration/projects`;
          this.$Progress.start();
          return axios
            .get(url, {
              params: data
            })
            .then(resp => {
              this.$Progress.finish();
              return {
                data: deserialize(resp.data),
                count: resp.data.meta.pagination.total_pages
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
    };
  },
  mounted() {},
  /* Methods */
  methods: {
    clearFilters() {
      this.$refs.projectList.setFilter('');
      this.$refs.projectList.customQueries = {};
    },
    isConfirmedUser(confirmed_at) {
      return confirmed_at !== null;
    },
    remove(projectId) {
      const self = this;
      this.confirm(
        this.$t('actions.delete'),
        this.$t('messages.doYouWantToDelete'),
        () => {
          const url = `${thornUrl}/administration/projects/${projectId}`;
          axios
            .delete(url, {})
            .then(resp => {
              self.success(
                self.$t('messages.successDeletion', {
                  what: this.$tc('titles.project', 1)
                })
              );
              self.$refs.projectList.refresh();
            })
            .catch(e => self.error(e));
        }
      );
    }
  }
};
</script>
