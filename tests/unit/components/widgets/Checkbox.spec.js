import { shallowMount } from '@vue/test-utils';
import CheckboxComponent from '$SRC/components/widgets/Checkbox.vue';
import { describe, expect, it } from 'vitest';

describe('CheckboxComponent.vue', () => {
    it('renderiza o componente', () => {
        const wrapper = shallowMount(CheckboxComponent);
        expect(wrapper.exists()).toBe(true);
    });

    it('testa a mudança de valor', async () => {
        const wrapper = shallowMount(CheckboxComponent, {
            propsData: {
                field: {
                    name: 'exampleField',
                },
            },
        });
        await wrapper.setData({ checked: true });
        expect(wrapper.vm.checked).toBe(true);
    });

});
