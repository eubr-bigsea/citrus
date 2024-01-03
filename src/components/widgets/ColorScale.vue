<template>
    <div>
        <span v-if="!readOnly">
            <LabelComponent :field="field" :value="value" />
            <div v-if="displayValue" class="scale clearfix">
                <div class="gradient" :style="getColorScale(displayValue)" />
            </div>
            <p>
                <b-link variant="sm" @click.prevent="openModal">
                    {{$t('actions.chooseOption')}}
                </b-link>
            </p>
        </span>
        <span v-else>{{displayValue}}</span>
        <b-modal id="lookupModal" ref="modal" size="lg" :title="field.label"
                 :hide-header="true"
                 :cancel-title="$t('actions.cancel')" no-fade>
            <p>
                <em>Color scale</em>
            </p>
            <div class="color-select">
                <div v-for="(scale, inx) in scales" :key="scale[0]" class="scale clearfix" @click="select(inx)">
                    <div class="scale-name">
                        {{scale[0]}}
                    </div>
                    <div class="gradient color" :style="getColorScale(scale[1])" />
                </div>
            </div>
            <template #modal-footer>
                <div class="w-100 text-right">
                    <b-btn variant="secondary" class="btn-sm " @click="cancelClicked">
                        {{$t('actions.cancel')}}
                    </b-btn>
                </div>
            </template>
        </b-modal>
    </div>
</template>
<script>
import LabelComponent from './Label.vue';
import Widget from '../../mixins/Widget.js';

// Colors from plotly in Python. Is there a method to retrieve them in JS?
const scales = [
    ['Aggrnyl', ['#245668', '#0f7279', '#0d8f81', '#39ab7e', '#6ec574', '#a9dc67', '#edef5d']],
    ['Aggrnyl_r', ['#edef5d', '#a9dc67', '#6ec574', '#39ab7e', '#0d8f81', '#0f7279', '#245668']],
    ['Agsunset', ['#4b2991', '#872ca2', '#c0369d', '#ea4f88', '#fa7876', '#f6a97a', '#edd9a3']],
    ['Agsunset_r', ['#edd9a3', '#f6a97a', '#fa7876', '#ea4f88', '#c0369d', '#872ca2', '#4b2991']],
    ['Blackbody', ['#000000', '#e60000', '#e6d200', '#ffffff', '#a0c8ff']],
    ['Blackbody_r', ['#a0c8ff', '#ffffff', '#e6d200', '#e60000', '#000000']],
    ['Bluered', ['#0000ff', '#ff0000']],
    ['Bluered_r', ['#ff0000', '#0000ff']],
    ['Blues', ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']],
    ['Blues_r', ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7', '#f7fbff']],
    ['Blugrn', ['#c4e6c3', '#96d2a4', '#6dbc90', '#4da284', '#36877a', '#266b6e', '#1d4f60']],
    ['Blugrn_r', ['#1d4f60', '#266b6e', '#36877a', '#4da284', '#6dbc90', '#96d2a4', '#c4e6c3']],
    ['Bluyl', ['#f7feae', '#b7e6a5', '#7ccba2', '#46aea0', '#089099', '#00718b', '#045275']],
    ['Bluyl_r', ['#045275', '#00718b', '#089099', '#46aea0', '#7ccba2', '#b7e6a5', '#f7feae']],
    ['Brwnyl', ['#ede5cf', '#e0c2a2', '#d39c83', '#c1766f', '#a65461', '#813753', '#541f3f']],
    ['Brwnyl_r', ['#541f3f', '#813753', '#a65461', '#c1766f', '#d39c83', '#e0c2a2', '#ede5cf']],
    ['BuGn', ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b']],
    ['BuGn_r', ['#00441b', '#006d2c', '#238b45', '#41ae76', '#66c2a4', '#99d8c9', '#ccece6', '#e5f5f9', '#f7fcfd']],
    ['BuPu', ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b']],
    ['BuPu_r', ['#4d004b', '#810f7c', '#88419d', '#8c6bb1', '#8c96c6', '#9ebcda', '#bfd3e6', '#e0ecf4', '#f7fcfd']],
    ['Burg', ['#ffc6c4', '#f4a3a8', '#e38191', '#cc607d', '#ad466c', '#8b3058', '#672044']],
    ['Burg_r', ['#672044', '#8b3058', '#ad466c', '#cc607d', '#e38191', '#f4a3a8', '#ffc6c4']],
    ['Burgyl', ['#fbe6c5', '#f5ba98', '#ee8a82', '#dc7176', '#c8586c', '#9c3f5d', '#70284a']],
    ['Burgyl_r', ['#70284a', '#9c3f5d', '#c8586c', '#dc7176', '#ee8a82', '#f5ba98', '#fbe6c5']],
    ['Cividis', ['#00224e', '#123570', '#3b496c', '#575d6d', '#707173', '#8a8678', '#a59c74', '#c3b369', '#e1cc55', '#fee838']],
    ['Cividis_r', ['#fee838', '#e1cc55', '#c3b369', '#a59c74', '#8a8678', '#707173', '#575d6d', '#3b496c', '#123570', '#00224e']],
    ['Darkmint', ['#d2fbd4', '#a5dbc2', '#7bbcb0', '#559c9e', '#3a7c89', '#235d72', '#123f5a']],
    ['Darkmint_r', ['#123f5a', '#235d72', '#3a7c89', '#559c9e', '#7bbcb0', '#a5dbc2', '#d2fbd4']],
    ['Electric', ['#000000', '#1e0064', '#780064', '#a05a00', '#e6c800', '#fffadc']],
    ['Electric_r', ['#fffadc', '#e6c800', '#a05a00', '#780064', '#1e0064', '#000000']],
    ['Emrld', ['#d3f2a3', '#97e196', '#6cc08b', '#4c9b82', '#217a79', '#105965', '#074050']],
    ['Emrld_r', ['#074050', '#105965', '#217a79', '#4c9b82', '#6cc08b', '#97e196', '#d3f2a3']],
    ['GnBu', ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']],
    ['GnBu_r', ['#084081', '#0868ac', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#e0f3db', '#f7fcf0']],
    ['Greens', ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b']],
    ['Greens_r', ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0', '#f7fcf5']],
    ['Greys', ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000']],
    ['Greys_r', ['#000000', '#252525', '#525252', '#737373', '#969696', '#bdbdbd', '#d9d9d9', '#f0f0f0', '#ffffff']],
    ['Hot', ['#000000', '#e60000', '#ffd200', '#ffffff']],
    ['Hot_r', ['#ffffff', '#ffd200', '#e60000', '#000000']],
    ['Inferno', ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4']],
    ['Inferno_r', ['#fcffa4', '#f7d13d', '#fb9b06', '#ed6925', '#cf4446', '#a52c60', '#781c6d', '#4a0c6b', '#1b0c41', '#000004']],
    ['Jet', ['#000083', '#003caa', '#05ffff', '#ffff00', '#fa0000', '#800000']],
    ['Jet_r', ['#800000', '#fa0000', '#ffff00', '#05ffff', '#003caa', '#000083']],
    ['Magenta', ['#f3cbd3', '#eaa9bd', '#dd88ac', '#ca699d', '#b14d8e', '#91357d', '#6c2167']],
    ['Magenta_r', ['#6c2167', '#91357d', '#b14d8e', '#ca699d', '#dd88ac', '#eaa9bd', '#f3cbd3']],
    ['Magma', ['#000004', '#180f3d', '#440f76', '#721f81', '#9e2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d', '#fcfdbf']],
    ['Magma_r', ['#fcfdbf', '#feca8d', '#fd9668', '#f1605d', '#cd4071', '#9e2f7f', '#721f81', '#440f76', '#180f3d', '#000004']],
    ['Mint', ['#e4f1e1', '#b4d9cc', '#89c0b6', '#63a6a0', '#448c8a', '#287274', '#0d585f']],
    ['Mint_r', ['#0d585f', '#287274', '#448c8a', '#63a6a0', '#89c0b6', '#b4d9cc', '#e4f1e1']],
    ['OrRd', ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']],
    ['OrRd_r', ['#7f0000', '#b30000', '#d7301f', '#ef6548', '#fc8d59', '#fdbb84', '#fdd49e', '#fee8c8', '#fff7ec']],
    ['Oranges', ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704']],
    ['Oranges_r', ['#7f2704', '#a63603', '#d94801', '#f16913', '#fd8d3c', '#fdae6b', '#fdd0a2', '#fee6ce', '#fff5eb']],
    ['Oryel', ['#ecda9a', '#efc47e', '#f3ad6a', '#f7945d', '#f97b57', '#f66356', '#ee4d5a']],
    ['Oryel_r', ['#ee4d5a', '#f66356', '#f97b57', '#f7945d', '#f3ad6a', '#efc47e', '#ecda9a']],
    ['Peach', ['#fde0c5', '#facba6', '#f8b58b', '#f59e72', '#f2855d', '#ef6a4c', '#eb4a40']],
    ['Peach_r', ['#eb4a40', '#ef6a4c', '#f2855d', '#f59e72', '#f8b58b', '#facba6', '#fde0c5']],
    ['Pinkyl', ['#fef6b5', '#ffdd9a', '#ffc285', '#ffa679', '#fa8a76', '#f16d7a', '#e15383']],
    ['Pinkyl_r', ['#e15383', '#f16d7a', '#fa8a76', '#ffa679', '#ffc285', '#ffdd9a', '#fef6b5']],
    ['Plasma', ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921']],
    ['Plasma_r', ['#f0f921', '#fdca26', '#fb9f3a', '#ed7953', '#d8576b', '#bd3786', '#9c179e', '#7201a8', '#46039f', '#0d0887']],
    ['Plotly3', ['#0508b8', '#1910d8', '#3c19f0', '#6b1cfb', '#981cfd', '#bf1cfd', '#dd2bfd', '#f246fe', '#fc67fd', '#fe88fc', '#fea5fd', '#febefe', '#fec3fe']],
    ['Plotly3_r', ['#fec3fe', '#febefe', '#fea5fd', '#fe88fc', '#fc67fd', '#f246fe', '#dd2bfd', '#bf1cfd', '#981cfd', '#6b1cfb', '#3c19f0', '#1910d8', '#0508b8']],
    ['PuBu', ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858']],
    ['PuBuGn', ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636']],
    ['PuBuGn_r', ['#014636', '#016c59', '#02818a', '#3690c0', '#67a9cf', '#a6bddb', '#d0d1e6', '#ece2f0', '#fff7fb']],
    ['PuBu_r', ['#023858', '#045a8d', '#0570b0', '#3690c0', '#74a9cf', '#a6bddb', '#d0d1e6', '#ece7f2', '#fff7fb']],
    ['PuRd', ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f']],
    ['PuRd_r', ['#67001f', '#980043', '#ce1256', '#e7298a', '#df65b0', '#c994c7', '#d4b9da', '#e7e1ef', '#f7f4f9']],
    ['Purp', ['#f3e0f7', '#e4c7f1', '#d1afe8', '#b998dd', '#9f82ce', '#826dba', '#63589f']],
    ['Purp_r', ['#63589f', '#826dba', '#9f82ce', '#b998dd', '#d1afe8', '#e4c7f1', '#f3e0f7']],
    ['Purples', ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d']],
    ['Purples_r', ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc', '#dadaeb', '#efedf5', '#fcfbfd']],
    ['Purpor', ['#f9ddda', '#f2b9c4', '#e597b9', '#ce78b3', '#ad5fad', '#834ba0', '#573b88']],
    ['Purpor_r', ['#573b88', '#834ba0', '#ad5fad', '#ce78b3', '#e597b9', '#f2b9c4', '#f9ddda']],
    ['Rainbow', ['#96005a', '#0000c8', '#0019ff', '#0098ff', '#2cff96', '#97ff00', '#ffea00', '#ff6f00', '#ff0000']],
    ['Rainbow_r', ['#ff0000', '#ff6f00', '#ffea00', '#97ff00', '#2cff96', '#0098ff', '#0019ff', '#0000c8', '#96005a']],
    ['RdBu', ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061']],
    ['RdBu_r', ['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2182b', '#67001f']],
    ['RdPu', ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a']],
    ['RdPu_r', ['#49006a', '#7a0177', '#ae017e', '#dd3497', '#f768a1', '#fa9fb5', '#fcc5c0', '#fde0dd', '#fff7f3']],
    ['Redor', ['#f6d2a9', '#f5b78e', '#f19c7c', '#ea8171', '#dd686c', '#ca5268', '#b13f64']],
    ['Redor_r', ['#b13f64', '#ca5268', '#dd686c', '#ea8171', '#f19c7c', '#f5b78e', '#f6d2a9']],
    ['Reds', ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d']],
    ['Reds_r', ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2', '#fff5f0']],
    ['Sunset', ['#f3e79b', '#fac484', '#f8a07e', '#eb7f86', '#ce6693', '#a059a0', '#5c53a5']],
    ['Sunset_r', ['#5c53a5', '#a059a0', '#ce6693', '#eb7f86', '#f8a07e', '#fac484', '#f3e79b']],
    ['Sunsetdark', ['#fcde9c', '#faa476', '#f0746e', '#e34f6f', '#dc3977', '#b9257a', '#7c1d6f']],
    ['Sunsetdark_r', ['#7c1d6f', '#b9257a', '#dc3977', '#e34f6f', '#f0746e', '#faa476', '#fcde9c']],
    ['Teal', ['#d1eeea', '#a8dbd9', '#85c4c9', '#68abb8', '#4f90a6', '#3b738f', '#2a5674']],
    ['Teal_r', ['#2a5674', '#3b738f', '#4f90a6', '#68abb8', '#85c4c9', '#a8dbd9', '#d1eeea']],
    ['Tealgrn', ['#b0f2bc', '#89e8ac', '#67dba5', '#4cc8a3', '#38b2a3', '#2c98a0', '#257d98']],
    ['Tealgrn_r', ['#257d98', '#2c98a0', '#38b2a3', '#4cc8a3', '#67dba5', '#89e8ac', '#b0f2bc']],
    ['Viridis', ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725']],
    ['Viridis_r', ['#fde725', '#b5de2b', '#6ece58', '#35b779', '#1f9e89', '#26828e', '#31688e', '#3e4989', '#482878', '#440154']],
    ['YlGn', ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529']],
    ['YlGnBu', ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']],
    ['YlGnBu_r', ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1', '#ffffd9']],
    ['YlGn_r', ['#004529', '#006837', '#238443', '#41ab5d', '#78c679', '#addd8e', '#d9f0a3', '#f7fcb9', '#ffffe5']],
    ['YlOrBr', ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506']],
    ['YlOrBr_r', ['#662506', '#993404', '#cc4c02', '#ec7014', '#fe9929', '#fec44f', '#fee391', '#fff7bc', '#ffffe5']],
    ['YlOrRd', ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']],
    ['YlOrRd_r', ['#800026', '#bd0026', '#e31a1c', '#fc4e2a', '#fd8d3c', '#feb24c', '#fed976', '#ffeda0', '#ffffcc']],
    ['algae', ['#d6f9cf', '#bae4ae', '#9cd18f', '#7cbf73', '#55ae5b', '#259d51', '#078a4e', '#0d7547', '#175f3d', '#194b31', '#173723', '#112414']],
    ['algae_r', ['#112414', '#173723', '#194b31', '#175f3d', '#0d7547', '#078a4e', '#259d51', '#55ae5b', '#7cbf73', '#9cd18f', '#bae4ae', '#d6f9cf']],
    ['amp', ['#f1ecec', '#e6d1cb', '#ddb6aa', '#d59c89', '#cd8167', '#c46649', '#ba4a2f', '#ac2c24', '#951327', '#780e28', '#590d1f', '#3c0911']],
    ['amp_r', ['#3c0911', '#590d1f', '#780e28', '#951327', '#ac2c24', '#ba4a2f', '#c46649', '#cd8167', '#d59c89', '#ddb6aa', '#e6d1cb', '#f1ecec']],
    ['deep', ['#fdfdcc', '#ceecb3', '#9cdba5', '#6fc9a3', '#56b1a3', '#4c99a0', '#44829b', '#3e6c96', '#3e528f', '#403c73', '#362b4d', '#271a2c']],
    ['deep_r', ['#271a2c', '#362b4d', '#403c73', '#3e528f', '#3e6c96', '#44829b', '#4c99a0', '#56b1a3', '#6fc9a3', '#9cdba5', '#ceecb3', '#fdfdcc']],
    ['dense', ['#e6f0f0', '#bfdde5', '#9cc9e2', '#81b4e3', '#739ae4', '#757fdd', '#7864ca', '#774aaf', '#71328d', '#641f68', '#501442', '#360e24']],
    ['dense_r', ['#360e24', '#501442', '#641f68', '#71328d', '#774aaf', '#7864ca', '#757fdd', '#739ae4', '#81b4e3', '#9cc9e2', '#bfdde5', '#e6f0f0']],
    ['gray', ['#000000', '#101010', '#262626', '#3b3b3b', '#515050', '#666565', '#7c7b7a', '#929291', '#ababaa', '#c5c5c3', '#e0e0df', '#fefefd']],
    ['gray_r', ['#fefefd', '#e0e0df', '#c5c5c3', '#ababaa', '#929291', '#7c7b7a', '#666565', '#515050', '#3b3b3b', '#262626', '#101010', '#000000']],
    ['haline', ['#29186b', '#2a23a0', '#0f4799', '#125f8e', '#267489', '#358888', '#419d85', '#51b27c', '#6fc66b', '#a0d65b', '#d4e170', '#fdee99']],
    ['haline_r', ['#fdee99', '#d4e170', '#a0d65b', '#6fc66b', '#51b27c', '#419d85', '#358888', '#267489', '#125f8e', '#0f4799', '#2a23a0', '#29186b']],
    ['ice', ['#030512', '#191933', '#2c2a57', '#3a3c7d', '#3e53a0', '#3e6db2', '#4886bb', '#599fc4', '#72b8cd', '#95cfd8', '#c0e5e8', '#eafcfd']],
    ['ice_r', ['#eafcfd', '#c0e5e8', '#95cfd8', '#72b8cd', '#599fc4', '#4886bb', '#3e6db2', '#3e53a0', '#3a3c7d', '#2c2a57', '#191933', '#030512']],
    ['matter', ['#fdedb0', '#facd91', '#f6ad77', '#f08e62', '#e76d54', '#d85053', '#c3385a', '#a82860', '#8a1d63', '#6b185d', '#4c1550', '#2f0f3d']],
    ['matter_r', ['#2f0f3d', '#4c1550', '#6b185d', '#8a1d63', '#a82860', '#c3385a', '#d85053', '#e76d54', '#f08e62', '#f6ad77', '#facd91', '#fdedb0']],
    ['solar', ['#331317', '#4f1c21', '#6c2424', '#872f20', '#9d4219', '#ae5814', '#bc6f13', '#c78916', '#d1a420', '#d9c02c', '#dede3b', '#e0fd4a']],
    ['solar_r', ['#e0fd4a', '#dede3b', '#d9c02c', '#d1a420', '#c78916', '#bc6f13', '#ae5814', '#9d4219', '#872f20', '#6c2424', '#4f1c21', '#331317']],
    ['speed', ['#fefccd', '#efe19c', '#ddc96a', '#c2b63b', '#9da715', '#749905', '#4b8a14', '#237924', '#0b642c', '#124e2b', '#193822', '#172312']],
    ['speed_r', ['#172312', '#193822', '#124e2b', '#0b642c', '#237924', '#4b8a14', '#749905', '#9da715', '#c2b63b', '#ddc96a', '#efe19c', '#fefccd']],
    ['tempo', ['#fef5f4', '#dee0d2', '#bdceb5', '#99bd9c', '#6ead8a', '#419d81', '#19897d', '#127475', '#195e6a', '#1c485d', '#193350', '#141d43']],
    ['tempo_r', ['#141d43', '#193350', '#1c485d', '#195e6a', '#127475', '#19897d', '#419d81', '#6ead8a', '#99bd9c', '#bdceb5', '#dee0d2', '#fef5f4']],
    ['thermal', ['#032333', '#0d3064', '#35329b', '#5d3e99', '#7e4d8f', '#9e5987', '#c16479', '#e17161', '#f68b45', '#fbad3c', '#f6d346', '#e7fa5a']],
    ['thermal_r', ['#e7fa5a', '#f6d346', '#fbad3c', '#f68b45', '#e17161', '#c16479', '#9e5987', '#7e4d8f', '#5d3e99', '#35329b', '#0d3064', '#032333']],
    ['turbid', ['#e8f5ab', '#dcdb89', '#d1c16b', '#c7a853', '#ba8f42', '#aa793c', '#97673a', '#815738', '#684835', '#503b2e', '#392d25', '#221e1b']],
    ['turbid_r', ['#221e1b', '#392d25', '#503b2e', '#684835', '#815738', '#97673a', '#aa793c', '#ba8f42', '#c7a853', '#d1c16b', '#dcdb89', '#e8f5ab']],
];
export default {
    components: { LabelComponent },
    mixins: [Widget],
    props: {
        value: { type: Array, default: () => [] },
        field: { type: Object, default: () => null },
        message: {
            type: String,
            default: 'update-form-field-value'
        }
    },
    data() {
        return {
            displayValue: '',
            scales
        };
    },
    mounted() {
        this.displayValue = this.value;
    },
    methods: {
        getColorScale(scale) {
            return {
                background: `linear-gradient(to right, ${scale.join(',')})`
            };
        },
        openModal() {
            this.$refs.modal.show();
            if (this.suggestionEvent) {
                this.suggestions = this.suggestionEvent();
            }
        },
        select(inx) {
            this.triggerUpdateEvent(this.message, this.field, this.scales[inx][1]);
            this.$refs.modal.hide();
            this.displayValue = this.scales[inx][1];
        },
        cancelClicked() {
            this.$refs.modal.hide();
        }
    },
};
</script>
<style scoped>
div.gradient {
    height: 16px;
    width: 220px;
    border: 1px solid #ccc;
    float: left;
}

div.scale {
    cursor: pointer;
    clear: both;
    margin: 1px 0;
    padding-top: 3px;
}

div.scale-name {
    float: left;
    font-size: .7em;
    width: 60px;
}

div.color-select {
    height: 400px;
    overflow: auto;
    padding: 5px;
    border: 1px solid #aaa;
}
</style>
