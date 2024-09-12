
import Treemap from '@/components/visualization/Treemap.vue';

const chart1 = {
    "data": {
        "type": "treemap",
        "labels": ["Iris", "Iris-setosa", "Iris-versicolor", "Iris-virginica", "5.0", "5.1", "6.3", "6.4", "5.5", "5.7", "5.6", "5.4", "4.8", "6.7", "4.6", "6.0", "7.7", "4.9", "6.1", "6.5", "6.7", "5.8", "6.3", "5.2", "6.9", "5.8", "4.4", "7.2", "5.9", "6.2", "6.0", "6.4", "5.5", "5.0", "4.7", "6.6", "6.8", "6.2", "6.1", "5.7", "6.9", "5.2", "6.8", "7.9", "5.8", "5.3", "5.7", "5.6", "6.5", "5.4", "5.1", "7.3", "4.9", "4.9", "4.3", "7.4", "7.0", "7.6", "4.5", "7.1", "5.9"],
        "parents": ["", "Iris", "Iris", "Iris", "Iris-setosa", "Iris-setosa", "Iris-virginica", "Iris-virginica", "Iris-versicolor", "Iris-versicolor", "Iris-versicolor", "Iris-setosa", "Iris-setosa", "Iris-virginica", "Iris-setosa", "Iris-versicolor", "Iris-virginica", "Iris-setosa", "Iris-versicolor", "Iris-virginica", "Iris-versicolor", "Iris-versicolor", "Iris-versicolor", "Iris-setosa", "Iris-virginica", "Iris-virginica", "Iris-setosa", "Iris-virginica", "Iris-versicolor", "Iris-versicolor", "Iris-virginica", "Iris-versicolor", "Iris-setosa", "Iris-versicolor", "Iris-setosa", "Iris-versicolor", "Iris-virginica", "Iris-virginica", "Iris-virginica", "Iris-setosa", "Iris-versicolor", "Iris-versicolor", "Iris-versicolor", "Iris-virginica", "Iris-setosa", "Iris-setosa", "Iris-virginica", "Iris-virginica", "Iris-versicolor", "Iris-versicolor", "Iris-versicolor", "Iris-virginica", "Iris-virginica", "Iris-versicolor", "Iris-setosa", "Iris-virginica", "Iris-versicolor", "Iris-virginica", "Iris-setosa", "Iris-virginica", "Iris-virginica"],
        "values": [150, 50, 50, 50, 8, 8, 6, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "title": "Treemap",
        "colors": ["#506FBB", "#3054AD", "#113A9F", "#0C2D7F", "#072163", "#3FA8AD", "#1E969C", "#01898F", "#016D72", "#005559", "#71AD3F", "#579C1E", "#428F01", "#347201", "#285900", "#FFCA5C", "#FFBB30", "#ED9F00", "#BD7F00", "#936300", "#FFA75C", "#FF9030", "#ED6E00", "#BD5700", "#934400", "#AD443F", "#9C241E", "#8F0701", "#720601", "#590400"],
        "textinfo": "label+value"
    }
};

export default {
    title: 'Visualization/Treemap',
    component: Treemap,
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Treemap },
    template: `<treemap v-bind="$props" />`,
});

export const TreemapExample = Template.bind({});
TreemapExample.args = {
    visualizationData: chart1,
};
