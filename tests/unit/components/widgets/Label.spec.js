import { shallowMount, createLocalVue } from '@vue/test-utils';
import Label from '$SRC/components/widgets/Label.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

describe('Label.vue', () => {
    const localVue = createLocalVue();
    localVue.component("FontAwesomeIcon", FontAwesomeIcon);


    it('renders a required field label', () => {
        const text = 'Please, inform required item';
        const wrapper = shallowMount(Label, {
            localVue,
            propsData: {
                field: {
                    label: text,
                    required: true
                }
            },
            mocks: {
                $t: (msg) => msg,
                $tc: (msg) => msg,
            }
        });
        const label = wrapper.find('[class="label"]');
        expect(label.exists()).toBeTruthy();
        // xa0 = &nbsp;
        expect(label.text()).toBe(`${text}\xa0*:`);
        const labelHelp = wrapper.find('[class="data-help"]');
        expect(labelHelp.exists()).toBeFalsy();

    });
    it('renders label with help', () => {
        const text = 'Inform your name';
        const help = 'Inform your name, as recorded';
        const wrapper = shallowMount(Label, {
            propsData: {
                localVue,
                field: {
                    label: text,
                    required: false,
                    help
                },
                showHelp: true
            }
        });
        const label = wrapper.find('[class="label"]');
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toBe(`${text}:`);
        const labelHelp = wrapper.find('[icon*="fa"]');
        expect(labelHelp.exists()).toBeTruthy();
        expect(labelHelp.attributes('title')).toBe(help);
    });  
});
