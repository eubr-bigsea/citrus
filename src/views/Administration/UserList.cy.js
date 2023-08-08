import UserList from './UserList.vue';
import { mount } from "@vue/test-utils";


describe('<UserList />', () => {
    it('renders', () => {
        
        // see: https://on.cypress.io/mounting-vue
        const wrapper = mount(UserList, {
            mocks: {
                $t: () => {},
                $tc: () => {}
            }
        });
    });
});