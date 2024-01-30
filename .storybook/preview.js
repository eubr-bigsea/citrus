import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import '@/fa-icons.js';
import { setup } from "@storybook/vue3";
import '@/assets/main.scss';
import messages from '@/i18n/messages.js';
import 'vue-select/dist/vue-select.css';
import { createI18n } from 'vue-i18n';


/* Widgets */
import AttributeFunctionComponent from '@/components/widgets/AttributeFunction.vue';
import AttributeSelector2Component from '@/components/widgets/AttributeSelector2.vue';
import AttributeAliasSelectorComponent from '@/components/widgets/AttributeAliasSelector.vue';
import CheckboxComponent from '@/components/widgets/Checkbox.vue';
import CastComponent from '@/components/widgets/Cast.vue';
import CodeComponent from '@/components/widgets/Code.vue';
import ColorComponent from '@/components/widgets/Color.vue';
import ColorPaletteComponent from '@/components/widgets/ColorPalette.vue';
import ColorScaleComponent from '@/components/widgets/ColorScale.vue';
import DateComponent from '@/components/widgets/Date.vue';
import DecimalComponent from '@/components/widgets/Decimal.vue';
import DropDownComponent from '@/components/widgets/DropDown.vue';
import ExpressionComponent from '@/components/widgets/ExpressionEditor.vue';
import FilterComponent from '@/components/widgets/FilterEditor.vue';
import GridCoordinatesComponent from '@/components/widgets/GridCoordinates.vue';
import IntegerComponent from '@/components/widgets/Integer.vue';
import JoinComponent from '@/components/widgets/Join.vue';
import LookupComponent from '@/components/widgets/Lookup.vue';
import MarkdownEditorComponent from '@/components/widgets/MarkdownEditor.vue';
import MarkdownComponent from '@/components/widgets/Markdown.vue';
import PercentageComponent from '@/components/widgets/Percentage.vue';
import RadioComponent from '@/components/widgets/Radio.vue';
import RangeComponent from '@/components/widgets/Range.vue';
import SampleLookupComponent from '@/components/widgets/SampleLookup.vue';
import Select2Component from '@/components/widgets/Select2.vue';
import TagComponent from '@/components/widgets/Tag.vue';
import TextComponent from '@/components/widgets/Text.vue';
import TextAreaComponent from '@/components/widgets/TextArea.vue';
import UrlComponent from '@/components/widgets/Url.vue';
import Plotly from '@/components/visualization/Plotly.vue';
import ConfirmComponenent from '@/components/ConfirmComponent.vue';
import VueSelect from "vue-select";
import VueGridLayout from 'vue3-grid-layout-next';
import InputTagComponent from '@/components/widgets/InputTag.vue';
import NumericRangeOrSetComponent from '@/components/widgets/NumericRangeOrSet.vue';


const widgets = new Map([
    ['attribute-function-component', AttributeFunctionComponent],
    ['attribute-selector-component', AttributeSelector2Component],
    ['attribute-alias-selector-component', AttributeAliasSelectorComponent],
    ['cast-component', CastComponent],
    ['checkbox-component', CheckboxComponent],
    ['code-component', CodeComponent],
    ['color-component', ColorComponent],
    ['color-palette-component', ColorPaletteComponent],
    ['color-pallete-component', ColorPaletteComponent], // FIXME: Remove
    ['color-scale-component', ColorScaleComponent],
    ['date-component', DateComponent],
    ['decimal-component', DecimalComponent],
    ['dropdown-component', DropDownComponent],
    ['expression-component', ExpressionComponent],
    ['filter-component', FilterComponent],
    ['grid-coordinates-component', GridCoordinatesComponent],
    ['integer-component', IntegerComponent],
    ['join-component', JoinComponent],
    ['lookup-component', LookupComponent],
    ['markdown-component', MarkdownComponent],
    ['percentage-component', PercentageComponent],
    ['radio-component', RadioComponent],
    ['range-component', RangeComponent],
    ['rich-text-component', MarkdownEditorComponent],
    ['sample-lookup-component', SampleLookupComponent],
    ['select2-component', Select2Component],
    ['single-tag-component', Select2Component],
    ['tag-component', Select2Component],
    ['tag2-component', TagComponent],
    ['text-component', TextComponent],
    ['textarea-component', TextAreaComponent],
    ['url-component', UrlComponent],
    ['input-tag-component', InputTagComponent],
    ['numeric-range-or-set-component', NumericRangeOrSetComponent],
]);

setup((app) => {

    const i18n = createI18n({
        allowComposition: true,
        globalInjection: true,
        global: true,
        legacy: false,
        locale: 'pt',
        fallbackLocale: 'en',
        messages
    });

    app.component('FontAwesomeIcon', FontAwesomeIcon);
    app.component('FontAwesomeLayers', FontAwesomeLayers);
    app.use(i18n);
    widgets.forEach((w, k) => app.component(k, w));
    app.directive('focus', {
        inserted: function (el) {
            el.focus();
        }
    });
});

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}