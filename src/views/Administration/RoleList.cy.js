import RoleList from './RoleList.vue';
import { mount } from "@vue/test-utils";

describe('<RoleList />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(RoleList, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});