import axios from 'axios';
import { debounce } from "../util.js";

const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default {
    data() {
        return {
            modelList: [],
        };
    },
    methods: {
        pad: (num, places, ch) => String(num).padStart(places, ch),
        loadModelList: debounce(function (search, loading) {
            if (search) {
                this.loadModelList(search, loading);
            }
        }, 800),
        async loadModelList(search, loading) {
            this.$Progress.start();
            const params = {
                sort: 'name', size: 10, query: search,
                //types: 'SQL',
                enabled: 1, simple: true, fields: 'id,name,type',
                //platform: 'META'
            };
            try {
                const modelList = await axios.get(
                    `${limoneroUrl}/models`, { params });
                this.modelList = modelList.data.data;
                console.log(this.modelList);
            } catch (e) {
                this.error(e);
            } finally {
                this.$Progress.finish();
                loading(false);
            }
        }
    }
};
