import axios from 'axios';
import { debounce, pad } from "../util.js";

const tahitiUrl = import.meta.env.VITE_TAHITI_URL;

export default {
    data() {
        return {
            workflowList: [],
            // shared by ModalAddPipelineStep.vue and EditPipelineStep.vue's
            // createWorkflow() - the two used to disagree (1 vs 1000/meta),
            // silently creating workflows against different platforms
            workflowPlatform: 1,
        };
    },
    methods: {
        pad,
        loadWorkflowList: debounce(function (search, loading) {
            if (search) {
                this.asyncLoadWorkflowList(search, loading);
            }
        }, 800),
        async asyncLoadWorkflowList(search, loading) {
            this.$Progress.start();
            const params = {
                sort: 'name', size: 10, name: search,
                types: 'SQL',
                enabled: 1, simple: true, fields: 'id,name,type',
                platform: 'META'
            };
            try {
                const workflowList = await axios.get(
                    `${tahitiUrl}/workflows`, { params });
                this.workflowList = workflowList.data.data;
                console.log(this.workflowList);
            } catch (e) {
                this.error(e);
            } finally {
                this.$Progress.finish();
                loading(false);
            }
        }
    }
};
