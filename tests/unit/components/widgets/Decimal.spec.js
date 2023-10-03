import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Decimal from './../../../../src/components/widgets/Decimal.vue';

const minimumValue = -999999999;
const maximumValue = 999999999999;
const intermediateValue = 999999999999;

describe('Decimal', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('checks minimum value', () => {
        const range = shallowMount(Decimal, {
            propsData: {
                value: minimumValue
            }
        });

        expect(range.props().value).toBe(minimumValue);
    });

    it('checks maximum value', () => {
        const range = shallowMount(Decimal, {
            propsData: {
                value: maximumValue
            }
        });

        expect(range.props().value).toBe(maximumValue);
    });

    it('checks intermediate value', () => {
        const range = shallowMount(Decimal, {
            propsData: {
                value: intermediateValue
            }
        });

        expect(range.props().value).toBe(intermediateValue);
    });
});
