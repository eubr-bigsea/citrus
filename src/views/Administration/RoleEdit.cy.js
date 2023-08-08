import RoleEdit from './RoleEdit.vue';
import { mount } from "@vue/test-utils";

describe('<RoleEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(RoleEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});