<template>
    <main role="main">
        <div class="row">
            <div class="col">
                <div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h1>{{$t('actions.add', {type: $t('titles.platform', 1).toLowerCase()})}}</h1>
                    </div>
                    <hr>
                </div>
                <div class="row">
                    <div class="col-md-12 col-xg-12 mx-auto">
                        <span v-html="$t('platform.pluginExplanation')" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="font-weight-bold">{{$t('platform.gitUrl')}}:</label>
                        <input v-model="url" type="text" class="form-control"
                               placeholder="https://github.com/dccspeed/demo-plugin">
                    </div>
                </div>
                <div class="row border-bottom pb-3 mt-3">
                    <div class="col-md-4">
                        <label class="font-weight-bold">{{$t('common.userLogin')}}:</label>
                        <input v-model="login" type="text" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <label class="font-weight-bold">{{$t('common.password')}}:</label>
                        <input v-model="password" type="password" class="form-control">
                    </div>
                    <div class="col-md-2">
                        <label>{{$t('common.password')}} (Git):</label>
                        <input v-model="password" type="password" class="form-control"
                               :placeholder="$t('common.optional')">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-12">
                        <button class="btn btn-sm btn-danger" @click="importPlugin">
                            <span class="fas fa fa-exclamation-triangle" />
                            {{$t('actions.import')}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Notifier from '../../mixins/Notifier.js';

let tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    name: 'PlatformAdd',
    mixins: [Notifier],
    data() {
        return {
            platform: {},
            url: 'https://github.com/dccspeed/demo-plugin',
            login: '',
            password: ''
        };
    },
    methods: {
        importPlugin() {
            const data = {
                gitUrl: this.gitUrl, login: this.login,
                password: this.password
            };
            axios
                .post(`${tahitiUrl}/platforms/import`, data)
                .then(() => {
                    this.$router.push({
                        name: 'platforms'
                    });
                })
                .catch(
                    function (e) {
                        this.error(e);
                    }.bind(this)
                );
        }
    }
};
</script>