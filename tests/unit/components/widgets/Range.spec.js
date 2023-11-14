import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RangeComponent from '$SRC/components/widgets/Range.vue';

describe('RangeComponent.vue', () => {
    it('renderiza o componente', () => {
        const wrapper = shallowMount(RangeComponent);
        expect(wrapper.exists()).toBe(true);
    });

    

    it('verifica algumas ações do mouse', async () => {
        const wrapper = shallowMount(RangeComponent);
        const input = wrapper.find('input[type="range"]');

        await input.trigger('mousedown');

        expect(wrapper.vm.isDragging).toBe(true);

        await input.trigger('mouseup');

        expect(wrapper.vm.isDragging).toBe(false);
    });
});