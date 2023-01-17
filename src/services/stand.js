import axios from "axios";

const standUrl = import.meta.env.VITE_STAND_URL
export default {
    async getLatestJob(workflowId) {
        return await axios.get(`${standUrl}/jobs/latest`,
            { params: { workflow_id: workflowId } })
            .then((response => {
                const result = {
                    steps: new Map(),
                    results: new Map()
                };
                const job = response.data;
                job.steps.forEach((step) => {
                    if (!result.steps.has(step.task.id)) {
                        result.steps.set(step.task.id, [step]);
                    } else {
                        result.steps.get(step.task.id).push(step);
                    }
                });
                job.results.forEach((result) => {
                    if (!result.results.has(result.task.id)) {
                        result.results.set(result.task.id, [result]);
                    } else {
                        result.results.get(result.task.id).push(result);
                    }
                });
                return result
            })).catch(() => { return new Map() });
    },
    async getEnabledClusters() {
        return await axios.get(`${standUrl}/clusters?enabled=true`, {})
            .then((response) => {
                self.clusters.length = 0;
                Array.prototype.push.apply(self.clusters, response.data);
                if (self.clusters.length) {
                    self.clusterInfo.id = self.clusters[0].id;
                    self.clusterInfo.name = self.clusters[0].name;
                    self.clusterInfo.description = self.clusters[0].description;
                    self.$refs.executeModal.show();
                    if (self.name === '') {
                        self.clusterInfo.workflowName = self.workflow.name;
                    }
                } else {
                    self.error("Unable to execute workflow: There is not cluster available.");
                }
            }).catch((ex) => {
                self.error(ex);
            });
    },
}