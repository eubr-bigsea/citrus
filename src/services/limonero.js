import axios from 'axios';
let limoneroUrl = import.meta.env.VITE_LIMONERO_URL;
export default {
    queryDataSource(id, callback) {
        let attributes = null;
        let self = this;
        id = parseInt(id);
        if (window.TahitiAttributeSuggester.cached === undefined) {
            window.TahitiAttributeSuggester.cached = {};
        }
        if (window.TahitiAttributeSuggester.cached[id]) {
            attributes = window.TahitiAttributeSuggester.cached[id];
            callback(attributes);
        } else {
            let url = `${limoneroUrl}/datasources/${id}`;
            axios.get(url).then(
                (response) => {
                    //console.debug(response.data)
                    let ds = response.data;
                    attributes = ds.attributes.map(function (attr) { return attr.name; });
                    window.TahitiAttributeSuggester.cached[id] = attributes;
                    callback(attributes);
                },
                () => {
                    self.warning(self.$t('errors.invalidDataSource'));
                    callback([]);
                }
            );
        }
    },
};
