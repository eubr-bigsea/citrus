<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h1>{{$t('actions.create', {type: $tc('titles.cluster', 1).toLowerCase()})}}</h1>
          </div>
          <hr>
        </div>
        <div class="row">
          <div class="col-md-12 col-xg-12 mx-auto">
            <div class="row">
              <div class="col-md-6">
                <label class="font-weight-bold">{{$tc('common.name')}}:</label>
                <input type="text" class="form-control" v-model="cluster.name">
              </div>
              <div class="col-md-3">
                <label class="font-weight-bold">{{$tc('common.type')}}:</label>
                <select class="form-control" v-model="cluster.type">
                  <option v-for="typ in types" v-bind:value="typ" :key="typ">{{typ}}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="font-weight-bold">{{$t('cluster.address')}}:</label>
                <input v-model="cluster.address" class="form-control">
              </div>
              <div class="col-md-3">
                <label class="font-weight-bold">{{$tc('cluster.executors')}}:</label>
                <input v-model="cluster.executors" class="form-control">
              </div>
              <div class="col-md-3">
                <label class="font-weight-bold">{{$tc('cluster.executor_cores')}}:</label>
                <input v-model="cluster.executor_cores" class="form-control">
              </div>
              <div class="col-md-3">
                <label class="font-weight-bold">{{$tc('cluster.executor_memory')}}:</label>
                <input v-model="cluster.executor_memory" class="form-control">
              </div>
              <div class="col-md-6 mt-3 mb-3 mt-3">
                <b-form-checkbox v-model="cluster.enabled">{{ $t('common.enabled') }}</b-form-checkbox>
              </div>
              <div class="col-md-6">
                <label>{{$tc('common.description')}}:</label>
                <textarea class="form-control" v-model="cluster.description"></textarea>
              </div>
              <div class="col-md-6">
                <label>{{$tc('common.general_parameters')}}:</label>
                <textarea class="form-control" v-model="cluster.general_parameters"></textarea>
              </div>
            </div>
            <div class="col-md-12 mb-4 border-top pt-2">
              <button class="btn btn-primary mr-1 btn-spinner" @click.stop="save">
                <font-awesome-icon icon="spinner" pulse class="icon"/>
                <span class="fa fa-save"></span>
                {{$tc('actions.save')}}
              </button>
              <router-link
                :to="{name: 'clusters'}"
                class="btn btn-secondary mr-1"
              >{{$tc('actions.cancel')}}</router-link>
            </div>
          </div>
        </div>
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
  name: 'ClusterAdd',
  data() {
    return {
      cluster: {},
      types: ['SPARK_LOCAL', 'MESOS', 'YARN'].sort()
    };
  },
  mounted() {},
  computed: {},
  methods: {
    save(event) {
      const data = this.cluster;

      let url = `${standUrl}/clusters`;

      axios
        .post(url, data)
        .then(resp => {
          this.$router.push({
            name: 'clusters'
          });
        })
        .catch(
          function(e) {
            this.error(e);
          }.bind(this)
        );
    }
  }
};
</script>