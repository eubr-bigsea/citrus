import { debounce } from "../util.js";
const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

export default () => {
    const loadDataSourceList = debounce(function (search, loading) {
        if (search) {
            this.asyncLoadDataSourceList(search, loading);
        }
    }, 800);
    const getAttributeList = async (id, loading) => {
        loading && loading(true);

        try {
            const dataSource = await axios.get(
                `${limoneroUrl}/datasources/${id}`);
            return dataSource.data.attributes.map(attr => attr.name).sort();
        } finally {
            loading && loading(false);
        }
    };
    const loadDataSources = async (search, loading) => {
        loading && loading(true);
        try {
            const params = {
                sort: 'name', size: 20, name: search,
                enabled: true, simple: true, fields: 'id,name'
            };
            const dataSourceList = await axios.get(
                `${limoneroUrl}/datasources`, { params });
            return dataSourceList.data.data;
        } finally {
            loading && loading(false);
        }
    };
    return { getAttributeList, loadDataSources, loadDataSourceList };
}