<template>
    <div class="row">
        <div class="col-md-4 mx-auto">
            <div class="card fat">
                <div class="card-header text-center bg-secondary text-white">
                    {{$t('titles.profile')}}
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">{{$t('common.firstName')}}</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" required autofocus v-model="user.attributes['first-name']">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">{{$t('common.lastName')}}</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" required v-model="user.attributes['last-name']">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-3 col-form-label">{{$t('common.email')}}</label>
                            <div class="col-sm-9">
                                <input type="email" class="form-control" required v-model="user.attributes['email']">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-3 col-form-label">{{$t('common.language')}}</label>
                            <div class="col-sm-9">
                                <select class="form-control" v-model="user.attributes['locale']">
                                    <option value="en">English/Inglês</option>
                                    <option value="pt">Português/Portuguese</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-md-12">
                                <b-link v-b-toggle.changePassword class="float-right">{{$t('profile.alsoChangePassword')}}</b-link>
                            </div>
                            <div class="col-md-12">
                                <b-collapse id="changePassword">
                                    <div class="form-group row">
                                        <label for="inputPassword3" class="col-sm-3 col-form-label">{{$t('common.password')}}</label>
                                        <div class="col-sm-9">
                                            <input type="password" class="form-control" id="inputPassword3">
                                        </div>
                                    </div>
                                </b-collapse>
                            </div>
                        </div>
                        <div class="form-group row border-top clearfix pt-3">
                            <div class="col-sm-12 text-center">
                                <button type="submit" class="btn btn-primary mr-2 pr-5 pl-5">{{$t('common.ok')}}</button>
                                <router-link class="btn btn-secondary text-white" :to="{name: 'home'}">{{$t('actions.cancel')}}</router-link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import SlideOutPanel from '../components/SlideOutPanel.vue'
    import axios from 'axios'
    export default {
        name: 'Profile',
        components: {
            'slideout-panel': SlideOutPanel
        },
        mounted() {
            let thornUrl = process.env.VUE_APP_THORN_URL
            let userId = this.$store.getters.user.id
            let url = `${thornUrl}/api/users/${userId}`;
            let self = this;
            axios.get(url).then(resp => {
                self.user = resp.data.data
            }).catch(function (e) {
                self.$snotify.error(
                    self.$t('errors.sendingData'),
                    self.$t('titles.error'),

                );
            }.bind(this));
        },
        data() {
            return {
                changePassword: false,
                user: { attributes: {} }
            }
        },
        props: {
        },
        methods: {
            save() {
                let self = this
                let thornUrl = process.env.VUE_APP_THORN_URL
                this.$store.dispatch('changeProfile', { thornUrl, user: this.user })
                    .then(() => {
                        self.$snotify.success(
                            self.$t('profile.updated'),
                            self.$t('titles.success'),
                        );
                        this.$router.push('/')
                    })
                    .catch(err => {
                        let msg = err.message.startsWith('errors.')
                            ? self.$t(err.message) : err.message
                        self.$snotify.error(
                            msg,
                            self.$t('titles.error'),

                        );
                    })
            }
        }
    }
</script>