<template>
	<main role="main">
		<div class="row">
			<div class="col">
				<div class="title">
					<h1>{{$tc('titles.jobs', 2)}}</h1>
				</div>
				<v-server-table
				ref="jobList"
				:data="tableData"
				:columns="columns"
				:options="options"
				name="jobList"
				>
				<template slot="id" slot-scope="props">
					<router-link
					:to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}"
					>{{props.row.id}}</router-link>
				</template>
				<template slot="name" slot-scope="props">
					<router-link
					:to="{name: 'jobDetail', params: {platform: props.row.workflow.platform.id, id: props.row.id}}"
					>{{props.row.name}}</router-link>
				</template>
				<template slot="actions" slot-scope="props">
					<button v-if="props.row.status === 'RUNNING' || props.row.status === 'PENDING' || props.row.status === 'WAITING'  " class="btn btn-sm btn-outline-danger mr-1"
    					:title="$t('actions.stop')"
	    				@click="stop(props.row)">
    					<font-awesome-icon icon="stop"></font-awesome-icon>
					</button>

					<button class="btn btn-sm btn-danger"
    					:title="$t('actions.delete')"
	    				@click="remove(props.row)">
    					<font-awesome-icon icon="trash"></font-awesome-icon>
					</button>
				</template>
				<template slot="status" slot-scope="props">
					<div
					class="lemonade-job"
					:class="props.row.status.toLowerCase()"
					>{{props.row.status}}</div>
				</template>
				<template
					slot="created"
					slot-scope="props"
				>{{props.row.created | formatJsonDate}}</template>
				<template slot="workflow" slot-scope="props">
					<router-link
					:to="{name: 'editWorkflow', params: {'id': props.row.workflow.id, platform: props.row.workflow.platform.id}}"
					>{{props.row.workflow.id}} - {{props.row.workflow.name}}</router-link>
				</template>
				</v-server-table>
			</div>
		</div>
	</main>
</template>

<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier';

let standUrl = process.env.VUE_APP_STAND_URL;

export default {
  mixins: [Notifier],
  data() {
    return {
      columns: [
        'status',
        'id',
        'name',
        'workflow',
        'created',
        'user.name',
        'actions'
      ],
      tableData: [],
      showSideBar: false,
      options: {
        skin: 'table-sm table table-hover',
        columnsClasses: {
          name: 'th-20',
          description: 'th-20',
          actions: 'th-5 text-center',
          status: 'th-5 text-center'
        },
        headings: {
          id: 'ID',
          created: this.$t('common.created'),
          actions: this.$tc('common.action', 2),
          name: this.$tc('common.name'),
          'user.name': this.$t('common.user.name')
        },
        sortable: ['name', 'id', 'created'],
        sortIcon: {
          base: 'fa fas',
          is: 'fa-sort ml-10',
          up: 'fa-sort-amount-up',
          down: 'fa-sort-amount-down'
        },
        preserveState: true,
        saveState: true,
        filterable: ['name', 'album'],
        requestFunction: this.load,
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
  /* Methods */
  methods: {
    load(data) {
      data.sort = data.orderBy;
      data.asc = data.ascending === 1 ? 'true' : 'false';
      data.size = data.limit;
      data.name = data.query;
      this.$Progress.start();
      return axios
        .get(`${standUrl}/jobs`, {
          params: data
        })
        .then(resp => {
          this.$Progress.finish();
          return { data: resp.data.data, count: resp.data.pagination.total };
        })
        .catch(
          function(e) {
            this.error(e);
          }.bind(this)
        );
    },
    stop(job){
      this.confirm(
        this.$t('actions.stop'),
        this.$t('messages.doYouWantToStop'),
        () => {
          this.$Progress.start();
          axios
            .post(`${standUrl}/jobs/${job.id}/stop`, {})
            .then(resp => {
              this.success(
                this.$t('messages.successStop', {
                  what: this.$tc('titles.job', 1)
                })
              );
              this.$refs.jobList.refresh();
              this.$Progress.finish();
            })
            .catch(
              function(e) {
                this.$Progress.finish();
                this.dispatch('error', e);
              }.bind(this)
            );
        }
      );
    },
    remove(job) {
      this.confirm(
        this.$t('actions.delete'),
        this.$t('messages.doYouWantToDelete'),
        () => {
          this.$Progress.start();
          axios
            .delete(`${standUrl}/jobs/${job.id}`, {})
            .then(resp => {
              this.success(
                this.$t('messages.successDeletion', {
                  what: this.$tc('titles.job', 1)
                })
              );
              this.$refs.jobList.refresh();
              this.$Progress.finish();
            })
            .catch(
              function(e) {
                this.$Progress.finish();
                this.dispatch('error', e);
              }.bind(this)
            );
        }
      );
    }
  }
};
</script>
