
import JoinConditionComponent from '../components/widgets/JoinCondition.vue';

const suggestions1 = ['id', 'name', 'state', 'field_with_long_name', 'c5'];
const suggestions2 = ['id', 'age', 'name', 'gender', 'fair', 'incoming', 'destination', 'home town', 'siblings'];

export default {
    title: 'Widgets/JoinCondition',
    component: JoinConditionComponent,
    argTypes: {
        suggestions: suggestions1,
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { JoinConditionComponent },
    mounted() {
        this.$root.$on('update-form-field-value', (field, value) => {
            console.debug(field, value);
        });
    },
    methods: {
        add() {
            this.$refs.condition.add();
        },
        showValue() {
            alert(JSON.stringify(this.$refs.condition.getConditions()));
        }
    },
    template: `
        <div>
            <join-condition-component v-bind="$props" ref="condition"/>
            <button class="btn btn-sm btn-primary" @click="add">Add</button>
            <button class="btn btn-sm btn-secondary" @click="showValue">Show value</button>
        </div>`,
});

export const Simple = Template.bind({});
Simple.args = {
    suggestions1,
    suggestions2
};

export const WithValues = Template.bind({});
WithValues.args = {
    suggestions1,
    suggestions2,
    conditions: [{ left: 'id', right: 'id' }, { left: 'name', right: 'name' }],
};