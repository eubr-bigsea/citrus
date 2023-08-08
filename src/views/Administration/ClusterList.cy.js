import ClusterList from './ClusterList.vue';
import { mount } from "@vue/test-utils";

describe('<ClusterList />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(ClusterList, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    // cy.mount(ClusterList)
    });
});