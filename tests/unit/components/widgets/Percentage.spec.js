import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Percentage from './../../../../src/components/widgets/Percentage.vue';


describe('Percentage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('checks positive value input', () => {
        const wrapper = shallowMount(Percentage, {
            propsData: {
                value: 123456
            }
        });

        expect(wrapper.props().value).toBe(123456);

    });

    it('checks negative value input', () => {
        const wrapper = shallowMount(Percentage, {
            propsData: {
                value: -10
            }
        });

        expect(wrapper.props().value).toBe(-10);

    });

   

});
