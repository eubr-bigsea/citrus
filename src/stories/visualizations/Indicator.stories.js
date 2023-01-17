
import Indicator from '../../components/visualization/Indicator.vue';

export default {
    title: 'Visualization/Indicator',
    component: Indicator,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Indicator },
    template: `<indicator v-bind="$props"/>`,
});

export const NumberIndicator = Template.bind({});
NumberIndicator.args = {
    visualizationData: {
        title: 'Indicator test',
        data: {
            footer: 'Test',
            value: 124
        }
    },
    height: 200,
};

export const DeltaIndicator = Template.bind({});
DeltaIndicator.args = {
    visualizationData: {
        title: 'Indicator test',
        data: {
            footer: 'Test',
            delta: { reference: 233 },
            mode: 'delta',
            value: 232
        }
    },
    height: 200,
};

export const GaugeIndicator = Template.bind({});
GaugeIndicator.args = {
    visualizationData: {
        title: 'Indicator test',
        data: {
            footer: 'Test',
            mode: 'number+gauge',
            value: 232
        }
    },
    height: 200,
};


