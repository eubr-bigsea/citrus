<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{$tc('titles.administration')}}</h1>
        </div>
        <div class="card">
            <div class="card-body">
                <b-link class="  mr-2"
                        :to="{ name: 'AdministrationUserList' }">
                    {{$tc('titles.user', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'AdministrationRoleList' }">
                    {{$tc('titles.role', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'configuration' }">
                    {{$tc('titles.configuration', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'clusters' }">
                    {{$tc('titles.cluster', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'storages' }">
                    {{$tc('titles.storage', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'platforms' }">
                    {{$tc('titles.platform', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'models' }">
                    {{$tc('titles.model', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'deployments' }">
                    {{$tc('titles.deployment', 2)}}
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'admin-openid' }">
                    OpenId Sandbox
                </b-link>
                <b-link class="  mr-2"
                        :to="{ name: 'webSocketPing' }">
                    Test Websocket
                </b-link>
            </div>
        </div>
    </main>
</template>
<script>
export default {

}
</script>