import { shallowMount } from '@vue/test-utils';
import UrlComponent from '$SRC/components/widgets/Url.vue';
import Label from '$SRC/components/widgets/Label.vue';
import { expect, it } from 'vitest';

describe('Url.vue', () => {
    it('read-only is true and value is null', () => {
        const wrapper = shallowMount(UrlComponent, {
            propsData: {
                field: {
                    value: null,
                    default: 'https://www.google.com.br/'
                },
                readOnly: true,
                value: null
            }
        });

        expect(wrapper.findComponent(Label).exists()).toBe(false);
        expect(wrapper.text()).toBe("https://www.google.com.br/");

    });
    
    it('read-only is false and value is correct', () => {
        const wrapper = shallowMount(UrlComponent, {
            propsData: {
                field: {
                    value: 'https://www.google.com.br/',
                    default: 0
                },
                readOnly: false,
                value: null
            }
        });

        expect(wrapper.findComponent(Label).exists()).toBeTruthy();
        const urlarea = wrapper.find('urlarea');
    });

    it('snapshots the component', () => {
        const wrapper = shallowMount(UrlComponent, { propsData: { field: {} } });
        expect(wrapper.text()).toMatchSnapshot();
    });
});