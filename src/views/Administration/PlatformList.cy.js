import PlatformList from './PlatformList.vue';
import { mount } from "@vue/test-utils";

describe('<PlatformList />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(PlatformList, {
            mocks: {
                $t: () => {},
                $tc: () => {},
            },
        });
    // cy.mount(PlatformList)
    });
});