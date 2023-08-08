import UserAdd from './UserAdd.vue';
import { mount } from "@vue/test-utils";

describe('<UserAdd />', () => {
    it('renders', () => {
        const wrapper = mount(UserAdd, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
        // see: https://on.cypress.io/mounting-vue
        // cy.mount(UserAdd);
    });
});
