import ChartBuilderDatasource from '../../components/chart-builder/ChartBuilderDatasource.vue';
import ChartBuilderColumnItem from '../../components/chart-builder/ChartBuilderColumnItem.vue';
import draggable from 'vuedraggable'

const data = [
    {name: "date", label: "Data", type: "date"},
    {name: "name", label: "Nome", type: "string"},
    {name: "age", label: "Idade", type: "int"},
]

export default {
    title: 'Chart Builder/Data Source',
    components: {
        ChartBuilderDatasource,
        draggable
    },
    argTypes: data
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChartBuilderColumnItem, ChartBuilderDatasource, draggable },
    template: '<div class="row"><div class="col-xs-12 col-md-3"><chart-builder-datasource v-bind="$props" /></div><div class="col-xs-12 col-md-3"><draggable :style="dropArea" group="chart" v-model="columns2" @start="drag=true" @end="drag=false"><chart-builder-column-item v-for="column in columns2" v-bind:key="column.name" :column="column"></chart-builder-column-item></draggable></div></div>',
    data() {
        return {
            columns2: [],
            dropArea: {
                display: "block",
                height: "100%",
                border: "1px dashed rgba(0,0,0,.16)"
            }
        }
    },
    computed: {
        myList: {
            get() {
                console.log(this.columns2);
                return this.columns2
            },
            set(value) {
                console.log(value);
                this.columns2.push(value);
            }
        }
    }
});

export const Primary = Template.bind({});
Primary.args = {
    columns: data
};