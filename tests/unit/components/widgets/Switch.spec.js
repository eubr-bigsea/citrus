import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Switch from './../../../../src/components/widgets/Switch.vue';


describe('Switch', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('checks value', () => {
        const wrapper = shallowMount(Switch, {
            propsData: {
                checked: true,
                onchange: (elem) => 1 + elem
            }
        });


        expect(wrapper.props().checked).toBe(true);

    });

    it('checks function', () => {
        const wrapper = shallowMount(Switch, {
            propsData: {
                onchange: (elem) => 1 + elem
            }
        });


        expect(wrapper.props().onchange(2)).toBe(3);
    });

    

   

});
