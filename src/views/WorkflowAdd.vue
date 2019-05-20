<template>
  <main role="main">
    <div class="row">
      <div class="col">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h1>{{$t('actions.create', {type: $tc('titles.workflow', 1).toLowerCase()})}}</h1>
          </div>
          <hr>
          <b-card>
            <div class="row">
              <div class="col-md-4">
                <label>{{$tc('common.name')}}:</label>
                <input class="form-control mb-1" v-model="name">
              </div>
              <div class="col-md-12">
                <b-tabs @input="changeTab" class="mt-2" nav-class="custom-tab">
                  <b-tab :title="$t('workflow.forPlatform')" active>
                    <div class="col-md-12 mt-2">
                      <b-form-radio-group id="radios2" v-model="selectedPlatform" name="platform">
                        <table class="table table-striped">
                          <tr v-for="platform in platforms" :key="platform.id" class="d-flex">
                            <td class="col-1">
                              <b-form-radio
                                :value="platform.id"
                                name="platform"
                                v-model="selectedPlatform"
                              >{{platform.name}}</b-form-radio>
                            </td>
                            <td class="col-11">
                              <em>{{platform.description}}.</em>
                            </td>
                          </tr>
                        </table>
                      </b-form-radio-group>
                    </div>
                  </b-tab>
                  <b-tab :title="$t('workflow.fromTemplate')">
                    <div class="col-md-12 mt-2">
                      <table class="table" v-if="templates && templates.length">
                        <tr class="d-flex">
                          <th class="col-3">{{$tc('common.name')}}</th>
                          <th class="col-6">{{$tc('common.description')}}</th>
                          <th class="col-3">{{$tc('titles.platform')}}</th>
                        </tr>
                        <tr v-for="template in templates" :key="template.id" class="d-flex">
                          <td class="col-3">
                            <b-form-radio
                              :value="template.id"
                              name="templateCheck"
                              v-model="selectedTemplate"
                              @change="selectOne"
                            >{{template.name}}</b-form-radio>
                          </td>
                          <td class="col-6">
                            <em>{{template.description}}.</em>
                          </td>
                          <td class="col-3">{{template.platform ? template.platform.name: ''}}</td>
                        </tr>
                      </table>
                      <div v-else>
                        <div class="alert alert-info">{{$t('common.noData')}}</div>
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>
              </div>
              <div class="col-md-12 mt-3 border-top pt-1">
                <button
                  class="btn float-right"
                  :class="{'btn-primary': true }"
                  @click="choose($event)"
                  :disabled="!canCreate"
                >{{$t('common.ok')}}</button>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from 'axios';
import Notifier from '../mixins/Notifier';

let tahitiUrl = process.env.VUE_APP_TAHITI_URL;

export default {
  mixins: [Notifier],
  name: 'WorkflowAdd',
  data() {
    return {
      name: '',
      selectedTab: 0,
      selectedPlatform: null,
      selectedTemplate: null,
      platforms: [],
      templates: []
    };
  },
  mounted() {
    axios
      .get(`${tahitiUrl}/platforms?enabled=true`)
      .then(resp => {
        this.platforms = resp.data;
        if (this.platforms && this.platforms.length) {
          this.selectedPlatform = this.platforms[0].id;
        }
      })
      .then(() => {
        const params = {
          template: true,
          fields: 'id,name,description,platform',
          enabled: true
        };
        axios.get(`${tahitiUrl}/workflows`, { params }).then(resp => {
          this.templates = resp.data.data;
        });
      })
      .catch(
        function(e) {
          this.$toastr.e(e);
        }.bind(this)
      );
  },
  computed: {
    canCreate() {
      return (
        this.name !== null &&
        this.name.trim() != '' &&
        ((this.selectedTab === 0 && this.selectedPlatform !== null) ||
          (this.selectedTab === 1 && this.selectedTemplate !== null) ||
          (this.selectedTab === 2 && false))
      );
    }
  },
  methods: {
    selectOne(v) {
      // v-model is not working ! This is a workaround
      this.selectedTemplate = v;
    },
    changeTab(index) {
      this.selectedTab = index;
    },
    choose(event) {
      if (this.canCreate) {
        const data = {
          name: this.name,
          platform_id: this.selectedPlatform,
          template_id: this.selectedTemplate
        };
        let url = `${tahitiUrl}/workflows`;
        if (this.selectedTab === 1) {
          url = `${tahitiUrl}/workflows/from-template`;
        }
        axios
          .post(url, data)
          .then(resp => {
            this.$router.push({
              name: 'editWorkflow',
              params: { platform: resp.data.platform.id, id: resp.data.id }
            });
          })
          .catch(
            function(e) {
              this.error(e);
            }.bind(this)
          );
      }
    }
  }
};
</script>