import ChartBuilderOptions from '@/components/chart-builder/ChartBuilderOptions.vue';

const field1 = {
    "type": { value: 'line' },
    "title": { value: "Testing example" },
    "display_legend": { value: "HIDE" },
    "template": { value: 'ggplot2' },
    "palette": { value: [ "#899DA4", "#C93312", "#FAEFD1", "#DC863B" ]},
    "color_attribute": { value: null },
    "size_attribute": { value: null },
    "color_scale": { value:  [ "#245668", "#0f7279", "#0d8f81", "#39ab7e", "#6ec574", "#a9dc67", "#edef5d" ] },
    "number_format": { value: null },
    "opacity": { value: 1 },
    "fill_opacity": { value: 1 },
    "hole": { value: 1 },
    "smoothing": { value: null },
    //FIXME: Review if it is needed
    "scatter_color": { value: null },
    "scatter_size": { value: null },
    "text_position": { value: null },
    "text_info": { value: null },

    "width": { value: null },
    "height": { value: null },
    "auto_margin": { value: null },
    "left_margin": { value: null },
    "right_margin": { value: null },
    "top_margin": { value: null },
    "bottom_margin": { value: null },
 
    "limit": { value: null },
    //FIXME: Not working
    "filter": { value: 'a == 1' },
    
    "subgraph": { value: null },
    "subgraph_orientation": { value: null },

    "animation": { value: null },

};


export default {
    title: 'VisBuilder/Options',
    component: ChartBuilderOptions,
    argTypes: {
        options: { type: Object, required: true },
        readOnly: false,
        value: '',
        attributes: ['name', 'age']
    },
};

const Template = (args) => ({
    data() {
        return { args, valor: '', rotulo: '' };
    },
    components: { ChartBuilderOptions },
    methods: {
        handleUpdate(field, value) {
            this.valor = value;
        }
    },
    template:
        `<div>
        <small ><span class="px-1 border me-1 mb-1" v-for="opt,k in args.options">{{k}} == {{opt.value}}</span></small>
        
        <chart-builder-options 
            v-model="args.options" :attributes="args.attributes" 
            v-model:title="args.options.title.value"
            v-model:type="args.options.type.value"
            v-model:displayLegend="args.options.display_legend.value"
            v-model:template="args.options.template.value"
            v-model:palette="args.options.palette.value"
            v-model:colorAttribute="args.options.color_attribute.value"
            v-model:sizeAttribute="args.options.size_attribute.value"
            v-model:colorScale="args.options.color_scale.value"
            v-model:numberFormat="args.options.number_format.value"
            v-model:opacity="args.options.opacity.value"
            v-model:fillOpacity="args.options.fill_opacity.value"
            v-model:hole="args.options.hole.value"
            v-model:smoothing="args.options.smoothing.value"
            v-model:scatterColor="args.options.scatter_color.value"
            v-model:scatterSize="args.options.scatter_size.value"
            v-model:textPosition="args.options.text_position.value"
            v-model:textInfo="args.options.text_info.value"
            v-model:width="args.options.width.value"
            v-model:height="args.options.height.value"
            v-model:autoMargin="args.options.auto_margin.value"
            v-model:topMargin="args.options.top_margin.value"
            v-model:leftMargin="args.options.left_margin.value"
            v-model:rightMargin="args.options.right_margin.value"
            v-model:bottomMargin="args.options.bottom_margin.value"
            v-model:limit="args.options.limit.value"
            v-model:filter="args.options.filter.value"
            
            v-model:subgraph="args.options.subgraph.value"
            v-model:subgraphOrientation="args.options.subgraph_orientation.value"
            v-model:animation="args.options.animation.value"
            />
    </div>`,
});

export const Basic = {
    render: (args) => Template(args),
    args: {
        options: field1,
        value: 'Text number 1',
        readOnly: false,
        attributes: ['name', 'age', 'address', 'postcode']
    }
};
/*
export const ReadOnly = {
    render: (args) => Template(args),
    args: {
        options: field1,
        value: 'Apenas leitura',
        readOnly: true,
    }
};

*/