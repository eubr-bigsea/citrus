// Common operations need by more than one view. Related to loading data source
import axios from 'axios';
import { debounce } from "../../util.js";

const limoneroUrl = process.env.VUE_APP_LIMONERO_URL;
export default {
    data() {
        return {
            dataSourceList: [],
            attributes: [], type: 'fast'
        };
    },
    methods: {
        pad: (num, places, ch) => String(num).padStart(places, ch),
        loadDataSourceList: debounce(function (search, loading) {
            if (search) {
                this.asyncLoadDataSourceList(search, loading);
            }
        }, 800),
        async retrieveAttributes() {
            if (this.selectedDataSource) {
                this.$Progress.start();
                const params = {
                    fields: 'id,name,attributes'
                };
                try {
                    const dataSourceList = await axios.get(
                        `${limoneroUrl}/datasources/${this.selectedDataSource.id}`);
                    this.attributes = dataSourceList.data.attributes.map(attr => attr.name).sort();
                } catch (e) {
                    this.error(e);
                } finally {
                    this.$Progress.finish();
                }
            } else {
                this.selectedAttribute = null;
                this.attributes = [];
            }
        },
        async asyncLoadDataSourceList(search, loading) {
            this.$Progress.start();
            const params = {
                sort: 'name', size: 20, name: search,
                enabled: true, simple: true, fields: 'id,name'
            };
            try {
                const dataSourceList = await axios.get(
                    `${limoneroUrl}/datasources`, { params });
                this.dataSourceList = dataSourceList.data.data;
            } catch (e) {
                this.error(e);
            } finally {
                this.$Progress.finish();
                loading(false);
            }
        }
    }
}