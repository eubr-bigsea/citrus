<template>
    <main role="main">
        <div class="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
            <h1>{{ $tc('titles.administration') }}</h1>
        </div>
        <div class="col-2">
            <ul class="list-group">
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'AdministrationUserList' }">
                        <font-awesome-icon icon="fa fa-user" size="lg" fixed-width />
                        {{ $tc('titles.user', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'AdministrationRoleList' }">
                        <font-awesome-icon icon="fa fa-user-group" size="lg" fixed-width />
                        {{ $tc('titles.role', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'configuration' }">
                        <font-awesome-icon icon="fa fa-gear" size="lg" fixed-width />
                        {{ $tc('titles.configuration', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'clusters' }">
                        <font-awesome-icon icon="fa fa-circle-nodes" size="lg" fixed-width />
                        {{ $tc('titles.cluster', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'storages' }">
                        <font-awesome-icon icon="fa fa-warehouse" size="lg" fixed-width />
                        {{ $tc('titles.storage', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'platforms' }">
                        <font-awesome-icon icon="fa fa-server" size="lg" fixed-width />
                        {{ $tc('titles.platform', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'models' }">
                        <font-awesome-icon icon="fa fa-robot" size="lg" fixed-width />
                        {{ $tc('titles.model', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'deployments' }">
                        <font-awesome-icon icon="fa fa-box" size="lg" fixed-width />
                        {{ $tc('titles.deployment', 2) }}
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="mr-2" :to="{ name: 'codeList' }">
                        <font-awesome-icon icon="fa fa-file-code" size="lg" />
                        Code List
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'admin-openid' }">
                        <font-awesome-icon icon="fa fa-key" size="lg" fixed-width />
                        OpenId Sandbox
                    </b-link>
                </li>
                <li class="list-group-item">
                    <b-link class="  mr-2" :to="{ name: 'webSocketPing' }">
                        <font-awesome-icon icon="fa fa-rocket" size="lg" fixed-width />
                        Test Websocket
                    </b-link>
                </li>
            </ul>

        </div>
    </main>
</template>
<script>
export default {

}
</script>