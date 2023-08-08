import ClusterEdit from './ClusterEdit.vue';
import { mount } from "@vue/test-utils";

describe('<ClusterEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(ClusterEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});