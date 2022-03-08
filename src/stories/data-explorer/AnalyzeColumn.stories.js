import AnalyzeColumnComponent from '../../components/data-explorer/AnalyzeColumn.vue';
export default {
    title: 'DataExplorer/AnalyzeColumn'
};

const Template = (args, { argTypes }) => ({
    components: { AnalyzeColumnComponent },
    props: Object.keys(argTypes),
    mounted() {
    },
    methods: {
        show() {
            this.$refs.analyze.show();
        }
    },
    data() {
        return {
        };
    },
    template: `<div>
                    <vue-snotify/>
                    <b-button @click="show">Show</b-button>
                    <analyze-column-component :attributes="attributes" ref="analyze"/>
                </div>`
});

export const Default = Template.bind({});
Default.args = {

};
