import { shallowMount } from '@vue/test-utils';
import Tag from '$SRC/components/widgets/Tag.vue';
import LabelComponent from '$SRC/components/widgets/Label.vue';
import { expect, it } from 'vitest';

describe('Tag.vue', () => {
  it('ReadOnly true', () => {
    const wrapper = shallowMount(Tag, {
      propsData: {
        readOnly: true,
        value: 'Abcd',
      },
    });
    expect(wrapper.text()).toBe('Abcd');
  });

  it('ReadOnly false', () => {
    const wrapper = shallowMount(Tag, {
      propsData: {
        readOnly: false,
        field: { name: 'FieldName' },
        value: 'SomeValue',
      },
    });
    expect(wrapper.findComponent(LabelComponent).exists()).toBe(true);
  });

  it('snapshots the component', () => {
    const wrapper = shallowMount(Tag, { propsData: { field: {} } });
    expect(wrapper.text()).toMatchSnapshot();
});
});


