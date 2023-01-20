import Step from '../../views/data-explorer/Step.vue';
import { Task } from '../../views/data-explorer/entities.js';
export default {
    title: 'DataExplorer/Step'
};

const Template = (args, { argTypes }) => ({
    components: { Step },
    props: Object.keys(argTypes),
    mounted() {
    },
    methods: {
        toggle(task) {
            task.enabled = !task.enabled;
        },
        preview(task) {
            task.previewable = !task.previewable;
        },
        duplicate(task) {
            console.debug('Duplicating', task);
        },
        deleteAction(task) {
            console.debug('Deleting', task);
        },
        update(task) {
            this.step.forms = {...task.forms};
            console.debug('Updating', task);
        },
        select(task, value){
            this.step.selected = value;
            console.debug('Selecting', task, value);
        }
    },
    data() {
        return {
        };
    },
    template: `<div style="margin-right:200px" >
                <step v-bind="$props"
                @toggle="toggle"
                @previewUntilHere="preview"
                @delete="deleteAction"
                @update="update"
                @cancel="step.editing = false"
                @select="select"
                @duplicate="duplicate"/>
               </div>`
});

const task = new Task({
    operation: {
        name: 'Read data',
        label_format: 'Read data from local',
        forms: [
            { 'category': 'execution', fields: [] }
        ]
    }
});
const task2 = new Task({
    forms: {
        comment: { value: 'Please, review this task' },
    },
    operation: {
        name: 'Convert to numbers',
        forms: [
            {
                'category': 'appearance', fields: [
                    {
                        name: 'comment', suggested_widget: 'text',
                        editable: true, label: 'Comment'
                    },
                    {
                        name: 'color', suggested_widget: 'color',
                        editable: true, label: 'Color'
                    }
                ]
            }
        ]
    }
});
const task3 = new Task({
    forms: {
        regex: { value: '\\d+' },
        replacement: {value: '?'}
    },
    operation: {
        label_format: 'Replace regex (${this.regex.value}) by "${this.replacement.value}"',
        forms: [
            {
                'category': 'execution', fields: [
                    {
                        name: 'regex', suggested_widget: 'text',
                        editable: true, label: 'Regex'
                    },
                    {
                        name: 'replacement', suggested_widget: 'text',
                        editable: true, label: 'Replacement'
                    }
                ]
            }
        ]
    }
});
export const BasicWithEvents = Template.bind({});
BasicWithEvents.args = {
    index: 1, language: 'pt', attributes: [{}],
    step: task,
    forms: { comment: 'Some comments' }
};

export const EditComment = Template.bind({});
EditComment.args = {
    index: 2, language: 'pt', attributes: [{}],
    step: task2,
};
export const EditProperties = Template.bind({});
EditProperties.args = {
    index: 3, language: 'pt', attributes: [{}],
    step: task3,
};

