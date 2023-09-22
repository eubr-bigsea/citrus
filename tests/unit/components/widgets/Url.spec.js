import { shallowMount } from '@vitest/vue';
import PropertyLabel from '$SRC/components/widgets/Label.vue';
import UrlComponent from '$SRC/components/widgets/Url.vue';
import { expect } from 'vitest';

describe('UrlComponent.vue', () => {
  it('renders if read-only is true', () => {
    const wrapper = shallowMount(UrlComponent, {
      props: {
        field: {
          value: 'https://google.com',
          default: 'Default URL',
        },
        readOnly: true,
      },
    });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.text()).toContain('Default URL');
  });

  it('renders if read-only is false', () => {
    const wrapper = shallowMount(UrlComponent, {
      props: {
        field: {
          value: 'https://google.com',
          default: 'Default URL',
        },
        readOnly: false,
      },
    });

    expect(wrapper.find('div').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(true);

    expect(wrapper.findComponent({ name: 'LabelComponent' }).exists()).toBe(true);

    expect(wrapper.find('input').element.value).toBe('https://google.com');
  });

  it('emits input event when input value changes', async () => {
    const wrapper = shallowMount(UrlComponent, {
      props: {
        field: {
          value: 'https://google.com',
          default: 'Default URL',
        },
        readOnly: false,
      },
    });

    const input = wrapper.find('input');

    await input.setValue('https://youtube.com');
    await input.trigger('input');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual(['https://youtube.com']);
  });
});
