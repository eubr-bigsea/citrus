import StorageEdit from './StorageEdit.vue';
import { mount } from "@vue/test-utils";

describe('<StorageEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(StorageEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});