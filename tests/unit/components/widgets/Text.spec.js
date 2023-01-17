import { shallowMount } from '@vue/test-utils';
import Text from '$SRC/components/widgets/Text.vue';
import Label from '$SRC/components/widgets/Label.vue';
import { expect } from 'vitest';

describe('Text.vue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });
    it('renders read-only widget with default value', () => {
        const wrapper = shallowMount(Text, {
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
        const wrapper = shallowMount(Text, {
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
        const inputText = wrapper.find('input[type="text"]');
        expect(inputText.exists()).toBeTruthy();

    });
    it('renders and emits after input ', async () => {
        const spy = vi.spyOn(Text.methods, 'updated');
        const wrapper = shallowMount(Text, {
            propsData: {
                field: {
                    value: 3001, default: 0
                },
                readOnly: false, value: null
            }
        });

        const inputText = wrapper.find('input');
        inputText.setValue(5000);
        vi.advanceTimersByTime(1000);
        const payload = wrapper.emitted();
        expect(payload.update[0][1]).toBe('5000');
        expect(spy).toBeCalled();

    });
    it('snapshots the component', () => {
        const wrapper = shallowMount(Text, { propsData: { field: {} } });
        expect(wrapper.text()).toMatchSnapshot();
    });
});
