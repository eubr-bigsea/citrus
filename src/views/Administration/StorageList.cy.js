import StorageList from './StorageList.vue';
import { mount } from "@vue/test-utils";
import { vi } from 'vitest';

vi.mock('vue-router', () => ({
    resolve: vi.fn(),
}));

describe('<StorageList />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(StorageList, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});