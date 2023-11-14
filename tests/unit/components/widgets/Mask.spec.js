import { shallowMount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import Label from '$SRC/components/widgets/Label.vue';
import Mask from '$SRC/components/widgets/Mask.vue';

describe('Mask.vue', () => {
  it('ReadOnly True', () => {
    const wrapper = shallowMount(Mask, {
        propsData: {
            field: {
                value: null,
                default: 'User input'
            },
            readOnly: true,
            value: null,
        },
    });

    expect(wrapper.findComponent(Label).exists()).toBe(true);
    expect(wrapper.text()).toBe("User input");
  });

  it('ReadOnly false', () => {
    const wrapper = shallowMount(Mask, {
        propsData: {
            field: {
                value: 'Text', default: 0
            },
            readOnly: false, value: null
        }
    });

    expect(wrapper.findComponent(Label).exists()).toBe(false);
    const masktext = wrapper.find('masktext');
    expect(masktext.exists()).toBeTruthy();
  });
  
  it('snapshots the component', () => {
    const wrapper = shallowMount(Mask, { propsData: { field: {} } });
    expect(wrapper.text()).toMatchSnapshot();
});
});
