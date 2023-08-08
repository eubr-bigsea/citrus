import CodeAdd from './CodeAdd.vue';
import { mount } from "@vue/test-utils";
import { vi } from 'vitest';


describe('<CodeAdd />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(CodeAdd, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});