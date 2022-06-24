<template>
    <div>
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value"></LabelComponent>

            <div class="palette clearfix">
                <template v-if="displayValue && displayValue.length > 0">
                    <div v-for="color in displayValue" :key="color">
                        <div class="color" :style="{'background-color': color}"></div>
                    </div>
                </template>
                <div v-else>
                    -
                </div>
            </div>
            <p>
                <b-link variant="sm" @click.prevent="openModal">
                    {{$t('actions.chooseOption')}}
                </b-link>
                |
                <b-link variant="sm" @click.prevent="clear">
                    {{$t('actions.clear')}}
                </b-link>

            </p>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal id="lookupModal" ref="modal" size="lg" :title="field.label"
            :hide-header="true" :cancel-title="$t('actions.cancel')" no-fade>
            <p>
                {{field.label || field.name}}
            </p>
            <div class="color-select">
                <div v-for="(palette, inx) in palettes" :key="palette[0]" class="palette clearfix" @click="select(inx)">
                    <div class="palette-name">{{palette[0]}}</div>
                    <div v-for="color in palette[1]" :key="color">
                        <div class="color" :style="{'background-color': color}"></div>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="secondary" class="btn-sm " @click="cancelClicked">{{$t('actions.cancel')}}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import LabelComponent from './Label.vue';
    import Widget from '../../mixins/Widget.js';

    // Colors from plotly in Python. Is there a method to retrieve them in JS?
    const palettes = [
        ["Alphabet", ["#AA0DFE", "#3283FE", "#85660D", "#782AB6", "#565656", "#1C8356", "#16FF32", "#F7E1A0", "#E2E2E2", "#1CBE]4F", "#C4451C", "#DEA0FD", "#FE00FA", "#325A9B", "#FEAF16", "#F8A19F", "#90AD1C", "#F6222E", "#1CFFCE", "#2ED9FF", "#B10DA1", "#C075A6", "#FC1CBF", "#B00068", "#FBE426", "#FA0087"]],
        ["Alphabet_r", ["#FA0087", "#FBE426", "#B00068", "#FC1CBF", "#C075A6", "#B10DA1", "#2ED9FF", "#1CFFCE", "#F6222E", "#90AD1C", "#F8A19F", "#FEAF16", "#325A9B", "#]FE00FA", "#DEA0FD", "#C4451C", "#1CBE4F", "#E2E2E2", "#F7E1A0", "#16FF32", "#1C8356", "#565656", "#782AB6", "#85660D", "#3283FE", "#AA0DFE"]],
        ["Antique", ["rgb(133, 92, 117)", "rgb(217, 175, 107)", "rgb(175, 100, 88)", "rgb(115, 111, 76)", "rgb(82, 106, 131)", "rgb(98, 83, 119)", "rgb(104, 133, 92)", "rgb(156, 156, 94)", "rgb(160, 97, 119)", "rgb(140, 120, 93)", "rgb(124, 124, 124)"]],
        ["Antique_r", ["rgb(124, 124, 124)", "rgb(140, 120, 93)", "rgb(160, 97, 119)", "rgb(156, 156, 94)", "rgb(104, 133, 92)]", "rgb(98, 83, 119)", "rgb(82, 106, 131)", "rgb(115, 111, 76)", "rgb(175, 100, 88)", "rgb(217, 175, 107)", "rgb(133, 92, 117)"]],
        ["Bold", ["rgb(127, 60, 141)", "rgb(17, 165, 121)", "rgb(57, 105, 172)", "rgb(242, 183, 1)", "rgb(231, 63, 116)", "rgb(1]28, 186, 90)", "rgb(230, 131, 16)", "rgb(0, 134, 149)", "rgb(207, 28, 144)", "rgb(249, 123, 114)", "rgb(165, 170, 153)"]],
        ["Bold_r", ["rgb(165, 170, 153)", "rgb(249, 123, 114)", "rgb(207, 28, 144)", "rgb(0, 134, 149)", "rgb(230, 131, 16)", "rgb(128, 186, 90)", "rgb(231, 63, 116)", "rgb(242, 183, 1)", "rgb(57, 105, 172)", "rgb(17, 165, 121)", "rgb(127, 60, 141)"]],
        ["D3", ["#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD", "#8C564B", "#E377C2", "#7F7F7F", "#BCBD22", "#17BECF"]],
        ["D3_r", ["#17BECF", "#BCBD22", "#7F7F7F", "#E377C2", "#8C564B", "#9467BD", "#D62728", "#2CA02C", "#FF7F0E", "#1F77B4"]],
        ["Dark2", ["rgb(27,158,119)", "rgb(217,95,2)", "rgb(117,112,179)", "rgb(231,41,138)", "rgb(102,166,30)", "rgb(230,171,2)", "rgb(166,118,29)", "rgb(102,102,102)"]],
        ["Dark24", ["#2E91E5", "#E15F99", "#1CA71C", "#FB0D0D", "#DA16FF", "#222A2A", "#B68100", "#750D86", "#EB663B", "#511CFB", "#00A08B", "#FB00D1", "#FC0080", "#B2828D]", "#6C7C32", "#778AAE", "#862A16", "#A777F1", "#620042", "#1616A7", "#DA60CA", "#6C4516", "#0D2A63", "#AF0038"]],
        ["Dark24_r", ["#AF0038", "#0D2A63", "#6C4516", "#DA60CA", "#1616A7", "#620042", "#A777F1", "#862A16", "#778AAE", "#6C7C32", "#B2828D", "#FC0080", "#FB00D1", "#00A08B", "#511CFB", "#EB663B", "#750D86", "#B68100", "#222A2A", "#DA16FF", "#FB0D0D", "#1CA71C", "#E15F99", "#2E91E5"]],
        ["Dark2_r", ["rgb(102,102,102)", "rgb(166,118,29)", "rgb(230,171,2)", "rgb(102,166,30)", "rgb(231,41,138)", "rgb(117,112],179)", "rgb(217,95,2)", "rgb(27,158,119)"]],
        ["G10", ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395"]],
        ["G10_r", ["#316395", "#B82E2E", "#66AA00", "#DD4477", "#0099C6", "#990099", "#109618", "#FF9900", "#DC3912", "#3366CC"]],
        ["Light24", ["#FD3216", "#00FE35", "#6A76FC", "#FED4C4", "#FE00CE", "#0DF9FF", "#F6F926", "#FF9616", "#479B55", "#EEA6FB", "#DC587D", "#D626FF", "#6E899C", "#00B5F7", "#B68E00", "#C9FBE5", "#FF0092", "#22FFA7", "#E3EE9E", "#86CE00", "#BC7196", "#7E7DCD", "#FC6955", "#E48F72"]],
        ["Light24_r", ["#E48F72", "#FC6955", "#7E7DCD", "#BC7196", "#86CE00", "#E3EE9E", "#22FFA7", "#FF0092", "#C9FBE5", "#B68E00", "#00B5F7", "#6E899C", "#D626FF", "#DC587D", "#EEA6FB", "#479B55", "#FF9616", "#F6F926", "#0DF9FF", "#FE00CE", "#FED4C4", "#6A76FC", "#00FE35", "#FD3216"]],
        ["Pastel", ["rgb(102, 197, 204)", "rgb(246, 207, 113)", "rgb(248, 156, 116)", "rgb(220, 176, 242)", "rgb(135, 197, 95)", "rgb(158, 185, 243)", "rgb(254, 136, 177)", "rgb(201, 219, 116)", "rgb(139, 224, 164)", "rgb(180, 151, 231)", "rgb(179, 179, 179)"]],
        ["Pastel1", ["rgb(251,180,174)", "rgb(179,205,227)", "rgb(204,235,197)", "rgb(222,203,228)", "rgb(254,217,166)", "rgb(255,255,204)", "rgb(229,216,189)", "rgb(253,218,236)", "rgb(242,242,242)"]],
        ["Pastel1_r", ["rgb(242,242,242)", "rgb(253,218,236)", "rgb(229,216,189)", "rgb(255,255,204)", "rgb(254,217,166)", "rgb(222,203,228)", "rgb(204,235,197)", "rgb(179,205,227)", "rgb(251,180,174)"]],
        ["Pastel2", ["rgb(179,226,205)", "rgb(253,205,172)", "rgb(203,213,232)", "rgb(244,202,228)", "rgb(230,245,201)", "rgb(255,242,174)", "rgb(241,226,204)", "rgb(204,204,204)"]],
        ["Pastel2_r", ["rgb(204,204,204)", "rgb(241,226,204)", "rgb(255,242,174)", "rgb(230,245,201)", "rgb(244,202,228)", "rgb(203,213,232)", "rgb(253,205,172)", "rgb(179,226,205)"]],
        ["Pastel_r", ["rgb(179, 179, 179)", "rgb(180, 151, 231)", "rgb(139, 224, 164)", "rgb(201, 219, 116)", "rgb(254, 136, 177)", "rgb(158, 185, 243)", "rgb(135, 197, 95)", "rgb(220, 176, 242)", "rgb(248, 156, 116)", "rgb(246, 207, 113)", "rgb(102, 197, 204)"]],
        ["Plotly", ["#636EFA", "#EF553B", "#00CC96", "#AB63FA", "#FFA15A", "#19D3F3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52"]],
        ["Plotly_r", ["#FECB52", "#FF97FF", "#B6E880", "#FF6692", "#19D3F3", "#FFA15A", "#AB63FA", "#00CC96", "#EF553B", "#636EFA"]],
        ["Prism", ["rgb(95, 70, 144)", "rgb(29, 105, 150)", "rgb(56, 166, 165)", "rgb(15, 133, 84)", "rgb(115, 175, 72)", "rgb(237, 173, 8)", "rgb(225, 124, 5)", "rgb(204, 80, 62)", "rgb(148, 52, 110)", "rgb(111, 64, 112)", "rgb(102, 102, 102)"]],
        ["Prism_r", ["rgb(102, 102, 102)", "rgb(111, 64, 112)", "rgb(148, 52, 110)", "rgb(204, 80, 62)", "rgb(225, 124, 5)", "rgb(237, 173, 8)", "rgb(115, 175, 72)", "rgb(15, 133, 84)", "rgb(56, 166, 165)", "rgb(29, 105, 150)", "rgb(95, 70, 144)"]],
        ["Safe", ["rgb(136, 204, 238)", "rgb(204, 102, 119)", "rgb(221, 204, 119)", "rgb(17, 119, 51)", "rgb(51, 34, 136)", "rgb(170, 68, 153)", "rgb(68, 170, 153)", "rgb(153, 153, 51)", "rgb(136, 34, 85)", "rgb(102, 17, 0)", "rgb(136, 136, 136)"]],
        ["Safe_r", ["rgb(136, 136, 136)", "rgb(102, 17, 0)", "rgb(136, 34, 85)", "rgb(153, 153, 51)", "rgb(68, 170, 153)", "rgb(170, 68, 153)", "rgb(51, 34, 136)", "rgb(17, 119, 51)", "rgb(221, 204, 119)", "rgb(204, 102, 119)", "rgb(136, 204, 238)"]],
        ["Set1", ["rgb(228,26,28)", "rgb(55,126,184)", "rgb(77,175,74)", "rgb(152,78,163)", "rgb(255,127,0)", "rgb(255,255,51)", "rgb(166,86,40)", "rgb(247,129,191)", "rgb(153,153,153)"]],
        ["Set1_r", ["rgb(153,153,153)", "rgb(247,129,191)", "rgb(166,86,40)", "rgb(255,255,51)", "rgb(255,127,0)", "rgb(152,78,163)", "rgb(77,175,74)", "rgb(55,126,184)", "rgb(228,26,28)"]],
        ["Set2", ["rgb(102,194,165)", "rgb(252,141,98)", "rgb(141,160,203)", "rgb(231,138,195)", "rgb(166,216,84)", "rgb(255,217,47)", "rgb(229,196,148)", "rgb(179,179,179)"]],
        ["Set2_r", ["rgb(179,179,179)", "rgb(229,196,148)", "rgb(255,217,47)", "rgb(166,216,84)", "rgb(231,138,195)", "rgb(141,160,203)", "rgb(252,141,98)", "rgb(102,194,165)"]],
        ["Set3", ["rgb(141,211,199)", "rgb(255,255,179)", "rgb(190,186,218)", "rgb(251,128,114)", "rgb(128,177,211)", "rgb(253,180,98)", "rgb(179,222,105)", "rgb(252,205,229)", "rgb(217,217,217)", "rgb(188,128,189)", "rgb(204,235,197)", "rgb(255,237,111)"]],
        ["Set3_r", ["rgb(255,237,111)", "rgb(204,235,197)", "rgb(188,128,189)", "rgb(217,217,217)", "rgb(252,205,229)", "rgb(179,222,105)", "rgb(253,180,98)", "rgb(128,177,211)", "rgb(251,128,114)", "rgb(190,186,218)", "rgb(255,255,179)", "rgb(141,211,199)"]],
        ["T10", ["#4C78A8", "#F58518", "#E45756", "#72B7B2", "#54A24B", "#EECA3B", "#B279A2", "#FF9DA6", "#9D755D", "#BAB0AC"]],
        ["T10_r", ["#BAB0AC", "#9D755D", "#FF9DA6", "#B279A2", "#EECA3B", "#54A24B", "#72B7B2", "#E45756", "#F58518", "#4C78A8"]],
        ["Vivid", ["rgb(229, 134, 6)", "rgb(93, 105, 177)", "rgb(82, 188, 163)", "rgb(153, 201, 69)", "rgb(204, 97, 176)", "rgb(36, 121, 108)", "rgb(218, 165, 27)", "rgb(47, 138, 196)", "rgb(118, 78, 159)", "rgb(237, 100, 90)", "rgb(165, 170, 153)"]],
        ["Vivid_r", ["rgb(165, 170, 153)", "rgb(237, 100, 90)", "rgb(118, 78, 159)", "rgb(47, 138, 196)", "rgb(218, 165, 27)", "rgb(36, 121, 108)", "rgb(204, 97, 176)", "rgb(153, 201, 69)", "rgb(82, 188, 163)", "rgb(93, 105, 177)", "rgb(229, 134, 6)"]]
    ]
    export default {
        components: { LabelComponent },
        mixins: [Widget],
        props: {
            value: {type: String, default: () => null},
            field: {type: Object, default: () => null},
            message: {
                type: String,
                default: () => 'update-form-field-value'
            }
        },
        data() {
            return {
                displayValue: '',
                internalValue: null,
                palettes
            }
        },
        mounted() {
            this.displayValue = this.value;
            if (this.value === null || this.value === undefined){
                this.internalValue = this.palettes[6][1]; // D3
                this.triggerUpdateEvent(this.message, this.field, this.internalValue);
                this.displayValue = this.internalValue;
            }
        },
        methods: {
            clear() {
                this.$root.$emit(this.message, this.field, null);
                this.displayValue = null;
            },
            openModal() {
                this.$refs.modal.show();
                if (this.suggestionEvent) {
                    this.suggestions = this.suggestionEvent();
                }
            },
            select(inx) {
                this.triggerUpdateEvent(this.message, this.field, this.palettes[inx][1]);
                this.$refs.modal.hide();
                this.displayValue = this.palettes[inx][1];
            },
            cancelClicked() {
                this.$refs.modal.hide();
            }
        },
    }
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
        width: 60px;
    }

    div.color {
        border-bottom: 1px solid #222;
        border-top: 1px solid #222;
        float: left;
        height: 18px;
        width: 24px;
    }

    div.color-select {
        height: 400px;
        overflow: auto;
        padding: 5px;
        border: 1px solid #aaa;
    }
</style>
