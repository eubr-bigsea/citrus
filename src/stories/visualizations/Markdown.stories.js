
import Markdown from '@/components/visualization/Markdown.vue';

export default {
    title: 'Visualization/Markdown',
    component: Markdown,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Markdown },
    template: `<markdown v-bind="$props"/>`,
});

export const MarkdownText = Template.bind({});
MarkdownText.args = {
    visualizationData: {
        data: {
            text: [
                'Example of Markdown',
                '===================',
                '## It is working'].join('\n')
        }
    },
    height: 500,
};
