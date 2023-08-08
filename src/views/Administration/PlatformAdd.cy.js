import PlatformAdd from './PlatformAdd.vue';
import { mount } from "@vue/test-utils";

describe('<PlatformAdd />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(PlatformAdd, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    });
});