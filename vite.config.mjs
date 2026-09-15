//import { createVuePlugin } from 'vite-plugin-vue2';
import vue from '@vitejs/plugin-vue';
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

// Route -> chunk group, mirrors the lazy imports in src/router.js.
// Native Rollup manualChunks instead of vite-plugin-webpackchunkname's
// webpackChunkName-comment parsing: that plugin's transform-time rewrite
// broke unplugin-vue-components' auto-import for bootstrap-vue-next tags
// (b-tabs/b-card/b-modal/... silently unresolved in prod) in every view
// it grouped.
const routeChunkGroups = {
    'src/views/ChangePassword.vue': 'group-user-profile',
    'src/views/Login.vue': 'group-user-profile',
    'src/views/Logout.vue': 'group-user-profile',
    'src/views/Disconnected.vue': 'group-user-profile',
    'src/views/Register.vue': 'group-user-profile',
    'src/views/ResetPassword.vue': 'group-user-profile',
    'src/views/Profile.vue': 'group-user-profile',
    'src/views/DataSourceList.vue': 'group-data-source',
    'src/views/DataSourceEdit.vue': 'group-data-source',
    'src/views/DataSourceAdd.vue': 'group-data-source',
    'src/views/data-source/DataSourceStorage.vue': 'group-data-source',
    'src/views/data-source/DataSourceAnalysis.vue': 'group-data-source',
    'src/views/JobList.vue': 'group-job',
    'src/views/JobDetail.vue': 'group-job',
    'src/views/WorkflowList.vue': 'group-workflow',
    'src/views/WorkflowEdit.vue': 'group-workflow',
    'src/views/WorkflowAdd.vue': 'group-workflow',
    'src/views/About.vue': 'group-global',
    'src/views/PageNotFound.vue': 'group-global',
    'src/views/Home.vue': 'group-global',
    'src/views/Index.vue': 'group-global',
    'src/views/TermsOfService.vue': 'group-global',
    'src/views/Welcome.vue': 'group-global',
    'src/views/ConfigurationList.vue': 'group-configuration',
    'src/views/Administration/Start.vue': 'admin-role',
    'src/views/Administration/RoleList.vue': 'group-role',
    'src/views/Administration/RoleEdit.vue': 'group-app',
    'src/views/Administration/UserList.vue': 'group-user',
    'src/views/Administration/UserAdd.vue': 'group-user',
    'src/views/Administration/UserEdit.vue': 'group-user',
    'src/views/Administration/ClusterList.vue': 'group-cluster',
    'src/views/Administration/ClusterEdit.vue': 'group-cluster',
    'src/views/Administration/StorageList.vue': 'group-storage',
    'src/views/Administration/StorageEdit.vue': 'group-storage',
    'src/views/ModelList.vue': 'group-model',
    'src/views/ModelAdd.vue': 'group-model',
    'src/views/ModelEdit.vue': 'group-model',
    'src/views/DashboardList.vue': 'group-dashboard',
    'src/views/DashboardDetail.vue': 'group-dashboard',
    'src/views/DashboardBuilder.vue': 'group-dashboard',
    'src/views/WebSocketPing.vue': 'group-util',
    'src/views/JsPlumbSandbox.vue': 'group-util',
    'src/views/OpenIdSandbox.vue': 'group-util',
    'src/views/NotificationList.vue': 'group-notification',
    'src/views/Administration/PlatformList.vue': 'group-platform',
    'src/views/Administration/PlatformAdd.vue': 'group-platform',
    'src/views/Administration/PlatformEdit.vue': 'group-platform',
    'src/views/TrackPanel.vue': 'group-app',
    'src/views/Track.vue': 'group-app',
    'src/views/TrackAdd.vue': 'group-app',
    'src/views/DisplayHtml.vue': 'group-app',
    'src/views/DeploymentList.vue': 'group-deployment',
    'src/views/DeploymentEdit.vue': 'group-deployment',
    'src/views/OperationList.vue': 'group-operation',
};
function routeChunkOf(id) {
    const normalized = id.replace(/\\/g, '/');
    for (const suffix in routeChunkGroups) {
        if (normalized.endsWith(suffix)) return routeChunkGroups[suffix];
    }
    return undefined;
}

import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'


export default defineConfig({
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    plugins: [
        //createVuePlugin(/* options */)
        vue({
            template: {
                /*compilerOptions: {
                    compatConfig: {
                        MODE: 2,
                        ATTR_FALSE_VALUE: false,
                        WATCH_ARRAY: false,
                        RENDER_FUNCTION: true,
                        INSTANCE_SCOPED_SLOTS: true,

                    }
                }*/
            }
        }),
        visualizer(),
        /* for boostrap-vue-next */
        Components({
            resolvers: [BootstrapVueNextResolver()],
          }),
    ],
    resolve: {
        alias: [
            /*
            {
                find: 'vue',
                replacement: '@vue/compat'
            },
            */
            {
                // this is required for the SCSS modules
                find: /^~(.*)$/,
                replacement: '$1',
            },
            /*
            {
                find: /^\/(.*)$/,
                replacement: path.resolve(__dirname, './src/$1')
            },*/
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
    test: {
        globals: true,
        environment: "jsdom",
        isolate: false,
        threads: false,
        include: [
            'tests/**/*.spec.js',
        ],
        deps: {
            inline: [/vue/]
        }
    },
    build: {
        rollupOptions:{
            output: {
                manualChunks:  (id) => {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                    return routeChunkOf(id);
                }
            }
        }
    }
})
;
