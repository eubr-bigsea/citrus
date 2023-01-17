import { shallowMount } from '@vue/test-utils'
import FeatureReduction from '$SRC/views/data-explorer/model-builder/FeatureReduction.vue'
//import Vue from 'vue'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
//Vue.component('FontAwesomeIcon', FontAwesomeIcon);

describe('FeatureReduction.vue', () => {
    const fieldsMap = new Map();
    const methods = ['disabled', 'pca']
    fieldsMap.set('method', { values: methods.map(t => { return { key: t } }) });

    test('renders "choose reduction method" form', () => {
        const wrapper = shallowMount(FeatureReduction, {
            propsData: {
                reduction: {
                    forms: {
                        method: { value: '' }
                    },
                    operation: {
                        fieldsMap
                    }
                },
            }
        });
        expect(wrapper.find("[data-test='reduction']").exists()).toBe(true);
    });
})
