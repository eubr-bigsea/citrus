import { shallowMount } from '@vue/test-utils'
import ChooseTask from '@/views/data-explorer/model-builder/ChooseTask.vue'


describe('ChooseTask.vue', () => {
    it('renders "choose task" form', () => {
        const wrapper = shallowMount(ChooseTask, {
            propsData: {
            }
        });

    });
})
