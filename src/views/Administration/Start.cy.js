import Start from './Start.vue';
import { mount } from "@vue/test-utils";

describe('<Start />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(Start, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    // cy.mount(Start);
    });
});