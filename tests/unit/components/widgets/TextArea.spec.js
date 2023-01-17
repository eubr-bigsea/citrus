import { shallowMount } from '@vue/test-utils';
import TextArea from '$SRC/components/widgets/TextArea.vue';
import Label from '$SRC/components/widgets/Label.vue';
import { expect } from 'vitest';

describe('TextArea.vue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });
    it('renders read-only widget with default value', () => {
        const wrapper = shallowMount(TextArea, {
            propsData: {
                field: {
                    value: null,
                    default: 'User input'
                },
                readOnly: true,
                value: null,
            }
        });
        expect(wrapper.findComponent(Label).exists()).toBe(false);
        expect(wrapper.text()).toBe("User input");
    });
    it('renders with field value', () => {
        const wrapper = shallowMount(TextArea, {
            propsData: {
                field: {
                    value: 3001,
                    default: 0
                },
                readOnly: false,
                value: null
            }
        });
        expect(wrapper.findComponent(Label).exists()).toBeTruthy();
        const textarea = wrapper.find('textarea');
        expect(textarea.exists()).toBeTruthy();

    });
    it('renders and emits after input ', async () => {
        const spy = vi.spyOn(TextArea.methods, 'updated');
        const wrapper = shallowMount(TextArea, {
            propsData: {
                field: {
                    value: 'Text', default: 0
                },
                readOnly: false, value: null
            }
        });

        const textarea = wrapper.find('textarea');
        const text = 'New data for property';
        textarea.setValue(text);
        textarea.trigger('keyup');
        vi.advanceTimersByTime(2000);
        const payload = wrapper.emitted();
        expect(payload.update[0][1]).toBe(text);
        expect(spy).toBeCalled();

    });
    it('snapshots the component', () => {
        const wrapper = shallowMount(TextArea, { propsData: { field: {} } });
        expect(wrapper.text()).toMatchSnapshot();
    });
});
