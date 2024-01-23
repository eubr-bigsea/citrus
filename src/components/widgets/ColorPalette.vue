<template>
    <div>
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value" />

            <div class="palette clearfix">
                <template v-if="displayValue && displayValue.length > 0">
                    <div v-for="color in displayValue" :key="color">
                        <div class="color" :style="{ 'background-color': color }" />
                    </div>
                </template>
                <div v-else>
                    -
                </div>
            </div>
            <b-link variant="sm" @click.prevent="openModal">
                {{ $t('actions.chooseOption') }}
            </b-link>
            |
            <b-link variant="sm" @click.prevent="clear">
                {{ $t('actions.clear') }}
            </b-link>
        </span>
        <span v-else>{{ displayValue }}</span>

        <!---->
        <modal id="lookupModal" ref="modal" size="xl" :title="field.label" :hide-header="true"
            :cancel-title="$t('actions.cancel')" no-fade>
            <b-tabs>
                <b-tab title="Matplotlib">
                    <div class="color-select">
                        <div v-for="(palette, inx) in palettes" :key="palette[0]" class="palette clearfix"
                            @click="select(inx, 'palettes')">
                            <div class="palette-name">
                                {{ palette[0] }}
                            </div>
                            <div v-for="color in palette[1]" :key="color">
                                <div class="color" :style="{ 'background-color': color }" />
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Color blind">
                    <div class="color-select">
                        <div v-for="(palette, inx) in colorBlindPalettes" :key="palette[0]" class="palette clearfix"
                            @click="select(inx, 'colorBlindPalettes')">
                            <div class="palette-name">
                                {{ palette[0] }}
                            </div>
                            <div v-for="color in palette[1]" :key="color">
                                <div class="color" :style="{ 'background-color': color }" />
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Wes Anderson Palettes">
                    <div class="color-select">
                        <div v-for="(palette, inx) in wesAndersonPalettes" :key="palette[0]" class="palette clearfix"
                            @click="select(inx, 'wesAndersonPalettes')">
                            <div class="palette-name">
                                {{ palette[0] }}
                            </div>
                            <div v-for="color in palette[1]" :key="color">
                                <div class="color" :style="{ 'background-color': color }" />
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
            <template #footer>
                <div class="w-100 text-end">
                    <b-button variant="secondary" class="btn-sm " @click="cancelClicked">
                        {{ $t('actions.cancel') }}
                    </b-button>
                </div>
            </template>
        </modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '@/mixins/Widget.js';


const wesAndersonPalettes = [
    ["BottleRocket1", ["#A42820", "#5F5647", "#9B110E", "#3F5151", "#4E2A1E", "#550307", "#0C1707"]],
    ["BottleRocket2", ["#FAD510", "#CB2314", "#273046", "#354823", "#1E1E1E"]],
    ["Rushmore1", ["#E1BD6D", "#EABE94", "#0B775E", "#35274A", "#F2300F"]],
    ["Royal1", ["#899DA4", "#C93312", "#FAEFD1", "#DC863B"]],
    ["Royal2", ["#9A8822", "#F5CDB4", "#F8AFA8", "#FDDDA0", "#74A089"]],
    ["Zissou1", ["#3B9AB2", "#78B7C5", "#EBCC2A", "#E1AF00", "#F21A00"]],
    ["Darjeeling1", ["#FF0000", "#00A08A", "#F2AD00", "#F98400", "#5BBCD6"]],
    ["Darjeeling2", ["#ECCBAE", "#046C9A", "#D69C4E", "#ABDDDE", "#000000"]],
    ["Chevalier1", ["#446455", "#FDD262", "#D3DDDC", "#C7B19C"]],
    ["FantasticFox1", ["#DD8D29", "#E2D200", "#46ACC8", "#E58601", "#B40F20"]],
    ["Moonrise1", ["#F3DF6C", "#CEAB07", "#D5D5D3", "#24281A"]],
    ["Moonrise2", ["#798E87", "#C27D38", "#CCC591", "#29211F"]],
    ["Moonrise3", ["#85D4E3", "#F4B5BD", "#9C964A", "#CDC08C", "#FAD77B"]],
    ["Cavalcanti1", ["#D8B70A", "#02401B", "#A2A475", "#81A88D", "#972D15"]],
    ["GrandBudapest1", ["#F1BB7B", "#FD6467", "#5B1A18", "#D67236"]],
    ["GrandBudapest2", ["#E6A0C4", "#C6CDF7", "#D8A499", "#7294D4"]],
    ["IsleofDogs1", ["#9986A5", "#79402E", "#CCBA72", "#0F0D0E", "#D9D0D3", "#8D8680"]],
    ["IsleofDogs2", ["#EAD3BF", "#AA9486", "#B6854D", "#39312F", "#1C1718"]]
];
// Colors from plotly in Python. Is there a method to retrieve them in JS?
const palettes = [
    ['Alphabet', ['#AA0DFE', '#3283FE', '#85660D', '#782AB6', '#565656', '#1C8356', '#16FF32', '#F7E1A0', '#E2E2E2', '#1CBE4F', '#C4451C', '#DEA0FD', '#FE00FA', '#325A9B', '#FEAF16', '#F8A19F', '#90AD1C', '#F6222E', '#1CFFCE', '#2ED9FF', '#B10DA1', '#C075A6', '#FC1CBF', '#B00068', '#FBE426', '#FA0087']],
    ['Alphabet_r', ['#FA0087', '#FBE426', '#B00068', '#FC1CBF', '#C075A6', '#B10DA1', '#2ED9FF', '#1CFFCE', '#F6222E', '#90AD1C', '#F8A19F', '#FEAF16', '#325A9B', '#FE00FA', '#DEA0FD', '#C4451C', '#1CBE4F', '#E2E2E2', '#F7E1A0', '#16FF32', '#1C8356', '#565656', '#782AB6', '#85660D', '#3283FE', '#AA0DFE']],
    ['Antique', ['#855c75', '#d9af6b', '#af6458', '#736f4c', '#526a83', '#625377', '#68855c', '#9c9c5e', '#a06177', '#8c785d', '#7c7c7c']],
    ['Antique_r', ['#7c7c7c', '#8c785d', '#a06177', '#9c9c5e', '#68855c', '#625377', '#526a83', '#736f4c', '#af6458', '#d9af6b', '#855c75']],
    ['Bold', ['#7f3c8d', '#11a579', '#3969ac', '#f2b701', '#e73f74', '#80ba5a', '#e68310', '#008695', '#cf1c90', '#f97b72', '#a5aa99']],
    ['Bold_r', ['#a5aa99', '#f97b72', '#cf1c90', '#008695', '#e68310', '#80ba5a', '#e73f74', '#f2b701', '#3969ac', '#11a579', '#7f3c8d']],
    ['D3', ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF']],
    ['D3_r', ['#17BECF', '#BCBD22', '#7F7F7F', '#E377C2', '#8C564B', '#9467BD', '#D62728', '#2CA02C', '#FF7F0E', '#1F77B4']],
    ['Dark2', ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']],
    ['Dark24', ['#2E91E5', '#E15F99', '#1CA71C', '#FB0D0D', '#DA16FF', '#222A2A', '#B68100', '#750D86', '#EB663B', '#511CFB', '#00A08B', '#FB00D1', '#FC0080', '#B2828D', '#6C7C32', '#778AAE', '#862A16', '#A777F1', '#620042', '#1616A7', '#DA60CA', '#6C4516', '#0D2A63', '#AF0038']],
    ['Dark24_r', ['#AF0038', '#0D2A63', '#6C4516', '#DA60CA', '#1616A7', '#620042', '#A777F1', '#862A16', '#778AAE', '#6C7C32', '#B2828D', '#FC0080', '#FB00D1', '#00A08B', '#511CFB', '#EB663B', '#750D86', '#B68100', '#222A2A', '#DA16FF', '#FB0D0D', '#1CA71C', '#E15F99', '#2E91E5']],
    ['Dark2_r', ['#666666', '#a6761d', '#e6ab02', '#66a61e', '#e7298a', '#7570b3', '#d95f02', '#1b9e77']],
    ['G10', ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395']],
    ['G10_r', ['#316395', '#B82E2E', '#66AA00', '#DD4477', '#0099C6', '#990099', '#109618', '#FF9900', '#DC3912', '#3366CC']],
    ['Light24', ['#FD3216', '#00FE35', '#6A76FC', '#FED4C4', '#FE00CE', '#0DF9FF', '#F6F926', '#FF9616', '#479B55', '#EEA6FB', '#DC587D', '#D626FF', '#6E899C', '#00B5F7', '#B68E00', '#C9FBE5', '#FF0092', '#22FFA7', '#E3EE9E', '#86CE00', '#BC7196', '#7E7DCD', '#FC6955', '#E48F72']],
    ['Light24_r', ['#E48F72', '#FC6955', '#7E7DCD', '#BC7196', '#86CE00', '#E3EE9E', '#22FFA7', '#FF0092', '#C9FBE5', '#B68E00', '#00B5F7', '#6E899C', '#D626FF', '#DC587D', '#EEA6FB', '#479B55', '#FF9616', '#F6F926', '#0DF9FF', '#FE00CE', '#FED4C4', '#6A76FC', '#00FE35', '#FD3216']],
    ['Pastel', ['#66c5cc', '#f6cf71', '#f89c74', '#dcb0f2', '#87c55f', '#9eb9f3', '#fe88b1', '#c9db74', '#8be0a4', '#b497e7', '#b3b3b3']],
    ['Pastel1', ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']],
    ['Pastel1_r', ['#f2f2f2', '#fddaec', '#e5d8bd', '#ffffcc', '#fed9a6', '#decbe4', '#ccebc5', '#b3cde3', '#fbb4ae']],
    ['Pastel2', ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc']],
    ['Pastel2_r', ['#cccccc', '#f1e2cc', '#fff2ae', '#e6f5c9', '#f4cae4', '#cbd5e8', '#fdcdac', '#b3e2cd']],
    ['Pastel_r', ['#b3b3b3', '#b497e7', '#8be0a4', '#c9db74', '#fe88b1', '#9eb9f3', '#87c55f', '#dcb0f2', '#f89c74', '#f6cf71', '#66c5cc']],
    ['Plotly', ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52']],
    ['Plotly_r', ['#FECB52', '#FF97FF', '#B6E880', '#FF6692', '#19D3F3', '#FFA15A', '#AB63FA', '#00CC96', '#EF553B', '#636EFA']],
    ['Prism', ['#5f4690', '#1d6996', '#38a6a5', '#0f8554', '#73af48', '#edad08', '#e17c05', '#cc503e', '#94346e', '#6f4070', '#666666']],
    ['Prism_r', ['#666666', '#6f4070', '#94346e', '#cc503e', '#e17c05', '#edad08', '#73af48', '#0f8554', '#38a6a5', '#1d6996', '#5f4690']],
    ['Safe', ['#88ccee', '#cc6677', '#ddcc77', '#117733', '#332288', '#aa4499', '#44aa99', '#999933', '#882255', '#661100', '#888888']],
    ['Safe_r', ['#888888', '#661100', '#882255', '#999933', '#44aa99', '#aa4499', '#332288', '#117733', '#ddcc77', '#cc6677', '#88ccee']],
    ['Set1', ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']],
    ['Set1_r', ['#999999', '#f781bf', '#a65628', '#ffff33', '#ff7f00', '#984ea3', '#4daf4a', '#377eb8', '#e41a1c']],
    ['Set2', ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']],
    ['Set2_r', ['#b3b3b3', '#e5c494', '#ffd92f', '#a6d854', '#e78ac3', '#8da0cb', '#fc8d62', '#66c2a5']],
    ['Set3', ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']],
    ['Set3_r', ['#ffed6f', '#ccebc5', '#bc80bd', '#d9d9d9', '#fccde5', '#b3de69', '#fdb462', '#80b1d3', '#fb8072', '#bebada', '#ffffb3', '#8dd3c7']],
    ['T10', ['#4C78A8', '#F58518', '#E45756', '#72B7B2', '#54A24B', '#EECA3B', '#B279A2', '#FF9DA6', '#9D755D', '#BAB0AC']],
    ['T10_r', ['#BAB0AC', '#9D755D', '#FF9DA6', '#B279A2', '#EECA3B', '#54A24B', '#72B7B2', '#E45756', '#F58518', '#4C78A8']],
    ['Vivid', ['#e58606', '#5d69b1', '#52bca3', '#99c945', '#cc61b0', '#24796c', '#daa51b', '#2f8ac4', '#764e9f', '#ed645a', '#a5aa99']],
    ['Vivid_r', ['#a5aa99', '#ed645a', '#764e9f', '#2f8ac4', '#daa51b', '#24796c', '#cc61b0', '#99c945', '#52bca3', '#5d69b1', '#e58606']],
];
const colorBlindPalettes = [
    ['ibm', ['#648fff', '#785ef0', '#dc267f', '#fe6100', '#ffb000', '#000000', '#ffffff']],
    ['ggplot.cbPalette', ["#999999", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"]],
    ['seaborn', ['#0173B2', '#DE8F05', '#029E73', '#D55E00', '#CC78BC', '#CA9161', '#FBAFE4', '#949494', '#ECE133', '#56B4E9']],
    ['tbl20blind', ['#006ba4', '#ff80e0', '#ababab', '#595959', '#5f9ed1', '#c85200', '#898989', '#a3c8ec', '#ffbc79', '#cfcfcf']]
    /*
    ['paletteMartin', ['#000000', '#004949', '#009292', '#FF6DB6', '#FFB6DB', '#490092', '#006DDB', '#B66DFF', '#6DB6FF', '#B6DBFF', '#920000', '#924900', '#DB6D00', '#24FF24', '#FFFF6D']],
    ['Blue2DarkOrange12Steps', ['#1E8E99', '#51C3CC', '#99F9FF', '#B2FCFF', '#CCFEFF', '#E5FFFF', '#FFE5CC', '#FFCA99', '#FFAD65', '#FF8E32', '#CC5800', '#993F00']],
    ['Blue2DarkOrange18Steps', ['#006666', '#009999', '#00CCCC', '#00FFFF', '#33FFFF', '#65FFFF', '#99FFFF', '#B2FFFF', '#CBFFFF', '#E5FFFF', '#FFE5CB', '#FFCA99', '#FFAD65', '#FF8E33', '#FF6E00', '#CC5500', '#993D00', '#662700']],
    ['Blue2DarkRed12Steps', ['#290AD8', '#264DFF', '#3FA0FF', '#72D9FF', '#AAF7FF', '#E0FFFF', '#FFFFBF', '#FFE099', '#FFAD72', '#F76D5E', '#D82632', '#A50021']],
    ['Blue2DarkRed18Steps', ['#2400D8', '#181CF7', '#2857FF', '#3D87FF', '#56B0FF', '#75D3FF', '#99EAFF', '#BCF9FF', '#EAFFFF', '#FFFFEA', '#FFF1BC', '#FFD699', '#FFAC75', '#FF7856', '#FF3D3D', '#F72735', '#D8152F', '#A50021']],
    ['Blue2Gray8Steps', ['#0099CC', '#66E5FF', '#99FFFF', '#CCFFFF', '#E5E5E5', '#999999', '#666666', '#333333']],
    ['Blue2Green14Steps', ['#0000FF', '#3333FF', '#6565FF', '#9999FF', '#B2B2FF', '#CBCBFF', '#E5E5FF', '#E5FFE5', '#CBFFCB', '#B2FFB2', '#99FF99', '#65FF65', '#33FF33', '#00FF00']],
    ['Blue2Orange10Steps', ['#0054FF', '#3299FF', '#65CCFF', '#99EDFF', '#CCFFFF', '#FFFFCC', '#FFEE99', '#FFCC65', '#FF9932', '#FF5500']],
    ['Blue2Orange12Steps', ['#002AFF', '#1965FF', '#3299FF', '#65CCFF', '#99EDFF', '#CCFFFF', '#FFFFCC', '#FFEE99', '#FFCC65', '#FF9932', '#FF6619', '#FF2A00']],
    ['Blue2Orange8Steps', ['#007FFF', '#4CC3FF', '#99EDFF', '#CCFFFF', '#FFFFCC', '#FFEE99', '#FFC34C', '#FF7F00']],
    ['Blue2OrangeRed14Steps', ['#075AFF', '#3276FF', '#5990FF', '#8CB2FF', '#BFD4FF', '#E5EEFF', '#F7F9FF', '#FFFFCC', '#FFFF99', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF0000']],
    ['Brown2Blue10Steps', ['#662F00', '#996035', '#CC9B7A', '#D8AF97', '#F2DACD', '#CCFDFF', '#99F8FF', '#65EFFF', '#32E3FF', '#00A9CC']],
    ['Brown2Blue12Steps', ['#331900', '#662F00', '#996035', '#CC9B7A', '#D8AF97', '#F2DACD', '#CCFDFF', '#99F8FF', '#65EFFF', '#32E3FF', '#00A9CC', '#007A99']],
    ['Green2Magenta16Steps', ['#005000', '#008600', '#00BB00', '#00F100', '#50FF50', '#86FF86', '#BBFFBB', '#FFFFFF', '#FFF1FF', '#FFBBFF', '#FF86FF', '#FF50FF', '#F100F1', '#BB00BB', '#860086', '#500050']],
    ['LightBlue2DarkBlue10Steps', ['#E5FFFF', '#CCFAFF', '#B2F2FF', '#99E5FF', '#7FD4FF', '#65BFFF', '#4CA5FF', '#3288FF', '#1965FF', '#003FFF']],
    ['LightBlue2DarkBlue7Steps', ['#FFFFFF', '#CCFDFF', '#99F8FF', '#66F0FF', '#33E4FF', '#00AACC', '#007A99']],
    ['ModifiedSpectralScheme11Steps', ['#A50021', '#D82632', '#F76D5E', '#FFAD72', '#FFE099', '#FFFFBF', '#E0FFFF', '#AAF7FF', '#72D8FF', '#3FA0FF', '#264CFF']],
    ['PairedColor12Steps', ['#FFBF7F', '#FF7F00', '#FFFF99', '#FFFF32', '#B2FF8C', '#32FF00', '#A5EDFF', '#19B2FF', '#CCBFFF', '#654CFF', '#FF99BF', '#E51932']],
    ['SteppedSequential5Steps', ['#990F0F', '#B22C2C', '#CC5151', '#E57E7E', '#FFB2B2', '#99540F', '#B26F2C', '#CC8E51', '#E5B17E', '#FFD8B2', '#6B990F', '#85B22C', '#A3CC51', '#C3E57E', '#E5FFB2', '#0F6B99', '#2C85B2', '#51A3CC', '#7EC3E5', '#B2E5FF', '#260F99', '#422CB2', '#6551CC', '#8F7EE5', '#BFB2FF']]
    */
];

export default {
    components: { LabelComponent },
    mixins: [Widget],
    props: {
        value: { type: Array, default: () => [] },
        field: { type: Object, default: () => null },
        message: {
            type: String,
            default: () => 'update-form-field-value'
        }
    },
    data() {
        return {
            displayValue: '',
            internalValue: null,
            palettes, wesAndersonPalettes, colorBlindPalettes,
            showModal: false,
        };
    },
    mounted() {
        this.displayValue = this.modelValue || this.value;
        if (this.displayValue === null || this.displayValue === undefined) {
            this.internalValue = this.palettes[6][1]; // D3
            this.triggerUpdateEvent(this.message, this.field, this.internalValue);
            this.displayValue = this.internalValue;
        }
    },
    computed: {
        
    },
    methods: {
        clear() {
            this.triggerUpdateEvent(this.message, this.field, []);
            this.displayValue = null;
        },
        openModal() {
            this.$refs.modal.show();
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            }
        },
        select(inx, type) {
            this.triggerUpdateEvent(this.message, this.field, this[type][inx][1]);
            this.$refs.modal.hide();
            this.displayValue = this[type][inx][1];
        },
        cancelClicked() {
            this.$refs.modal.hide();
        }
    },
};
</script>
<style scoped>
div.palette {
    cursor: pointer;
    clear: both;
    margin: 1px 0;
    padding-top: 3px;
}

div.palette-name {
    float: left;
    font-size: .7em;
    width: 160px;
}

div.color {
    border: 1px solid #bbb;
    margin-right: 1px;
    margin-bottom: 1px;
    float: left;
    height: 18px;
    width: 18px;
}

div.color-select {
    height: 400px;
    overflow: auto;
    padding: 5px;
    border: 1px solid #aaa;
}
</style>
