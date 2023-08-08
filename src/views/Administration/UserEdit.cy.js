import UserEdit from './UserEdit.vue';
import { mount } from "@vue/test-utils";

describe('<UserEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(UserEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
        // cy.mount(UserEdit);
    });
});