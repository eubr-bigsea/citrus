import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Date from './../../../../src/components/widgets/Date.vue';

const maxDate = "2199-12-31";

describe('Date', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('tests max date', () => {
        const wrapper = shallowMount(Date, {
            propsData: {
                value: maxDate
            }
        });

        expect(wrapper.props().value).toBe(maxDate);
    });

});
