import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import GridCoordinates from './../../../../src/components/widgets/GridCoordinates.vue';

describe('Decimal', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('checks coordinates', () => {
        const wrapper = shallowMount(GridCoordinates, {
            propsData: {
                coordinates: {
                    row: 1,
                    column: 1,
                    height: 3,
                    width: 12,
                }
            }
        });

        expect(wrapper.props().coordinates).toBe({row: 1, column: 1, height: 3, width: 12});
    });

});