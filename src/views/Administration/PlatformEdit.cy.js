import PlatformEdit from './PlatformEdit.vue';
import { mount } from "@vue/test-utils";

describe('<PlatformEdit />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(PlatformEdit, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});