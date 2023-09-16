import { describe, expect, test, vi, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Markdown from './../../../../src/components/widgets/Markdown.vue';

const textExample1 = "<h1>Hello, World!</h1>";
const textExample2 = "<p>23 + 2578 = 2601</p>";
const textExample3 = "<span>365 days!</span>";

describe('Markdown', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    });

    it('renders text', () => {
        const wrapper = shallowMount(Markdown, {
            propsData: {
                text: textExample1
            }
        });

        expect(wrapper.text()).toBe("Hello, World!");

    });

    it('renders numeric text', () => {
        const wrapper = shallowMount(Markdown, {
            propsData: {
                text: textExample2
            }
        });

        expect(wrapper.text()).toBe("23 + 2578 = 2601");

    });

    it('renders alphanumeric text', () => {
        const wrapper = shallowMount(Markdown, {
            propsData: {
                text: textExample3
            }
        });

        expect(wrapper.text()).toBe("365 days!");

    });

});
