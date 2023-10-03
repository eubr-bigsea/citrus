import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Range from './../../../../src/components/widgets/Range.vue';

describe('Range', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('checks minimum value', () => {
        const range = shallowMount(Range, {
            propsData: {
                value: 1
            }
        });

        expect(range.props().value).toBe(1);
    });

    it('checks maximum value', () => {
        const range = shallowMount(Range, {
            propsData: {
                value: 99
            }
        });

        expect(range.props().value).toBe(99);
    });

    it('checks intermediate value', () => {
        const range = shallowMount(Range, {
            propsData: {
                value: 50
            }
        });

        expect(range.props().value).toBe(50);
    });
});
