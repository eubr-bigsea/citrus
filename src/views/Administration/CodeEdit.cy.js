import CodeEdit from './CodeEdit.vue';
import { mount } from "@vue/test-utils";

describe('<CodeEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(CodeEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    // cy.mount(CodeEdit);
    });
});