import { shallowMount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import SampleLookup from '$SRC/components/widgets/SampleLookup.vue';
import { _loadLookup } from '$SRC/components/widgets/SampleLookup.vue';
import Label from '$SRC/components/widgets/Label.vue';
import axios from 'axios';

vi.mock('axios')

describe('SampleLookup.vue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('renders', () => {
        const wrapper = shallowMount(SampleLookup, {
            propsData: {
                field: {
                    value: [],
                },
            }
        });
        expect(wrapper.findComponent(Label).exists()).toBe(true);
        expect(wrapper.text()).toBe("");
    })

    test('Mocking test', async () => {
        const limoneroUrl = import.meta.env.VITE_LIMONERO_URL;

        const usersMock = [{ id: 1 }, { id:2 }]

        // axios.get.mockResolvedValue({
        //     data: usersMock,
        // })

        vi.mocked(axios.get).mockReturnValue(usersMock)

        const users = await _loadLookup()

        expect(axios.get).toHaveBeenCalledWith(limoneroUrl)
        expect(users).toStrictEqual(usersMock)
    })
})
