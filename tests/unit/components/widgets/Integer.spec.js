import { shallowMount } from '@vue/test-utils';
import Integer from '$SRC/components/widgets/Integer.vue';
import Label from '$SRC/components/widgets/Label.vue';
import { expect } from 'vitest';

describe('Integer.vue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });
    it('renders read-only widget with default value', () => {
        const wrapper = shallowMount(Integer, {
            propsData: {
                field: {
                    value: null,
                    default: 1984
                },
                readOnly: true,
                value: null,
            }
        });
        expect(wrapper.findComponent(Label).exists()).toBe(false);
        expect(wrapper.text()).toBe("1984");

        //expect(wrapper.text()).toBe('Teste');
        //expect(wrapper.find('[class="label"]').exists()).toBeTruthy();
        //expect(wrapper.find("span[class='label']").exists()).toBeTruthy();
        //expect(wrapper.find("span[class='label']").exists()).toBeTruthy();

    });
    it('renders with field value', () => {
        const wrapper = shallowMount(Integer, {
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
        expect(wrapper.text()).toBe("");
        const inputNumber = wrapper.find('input[type="number"]');

        expect(inputNumber.exists()).toBeTruthy();
        expect(inputNumber.element.pattern).toBe('\\\\d*');
        // console.debug(wrapper.html());
    });
    it('renders and emits after input ', async () => {
        const spy = vi.spyOn(Integer.methods, 'updated');
        const wrapper = shallowMount(Integer, {
            propsData: {
                field: {
                    value: 3001, default: 0
                },
                readOnly: false, value: null
            }
        });

        const inputNumber = wrapper.find('input');
        inputNumber.setValue(5000);
        // inputNumber.trigger('input');
        vi.advanceTimersByTime(1000);
        //await wrapper.vm.$nextTick();

        const payload = wrapper.emitted();
        // const spy = vi.spyOn(wrapper.vm, 'updated');
        // spy.mockImplementationOnce((e) => 'access-restricted');
        // expect(wrapper.vm.updated()).toEqual('access-restricted');
        // expect(spy.getMockName()).toEqual('updated');
        // console.debug(wrapper.vm.updated);
        // console.debug(wrapper.find('input[type="number"]').element.value);
        // console.table(payload)
        // console.table(payload.update[0][0])

        expect(payload.update[0][1]).toBe('5000');
        expect(spy).toBeCalled();

    });
    it('renders but with invalid value (non-integer) ', async () => {
        const spy = vi.spyOn(Integer.methods, 'updated');
        const wrapper = shallowMount(Integer, {
            propsData: {
                field: {
                    value: 'invalid number', default: 0
                },
                readOnly: false, value: null
            }
        });

        const inputNumber = wrapper.find('input');
        inputNumber.setValue('invalid');
        vi.advanceTimersByTime(1000);
        expect(inputNumber.element.value).toBe('');

        const payload = wrapper.emitted();
        expect(payload.update[0][1]).toBe('');
        expect(spy).toBeCalled();

    });
    it('snapshots the component', () => {
        const wrapper = shallowMount(Integer, { propsData: { field: {} } });
        expect(wrapper.text()).toMatchSnapshot();
    });
});
