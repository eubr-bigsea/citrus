import StepList from '../../views/data-explorer/StepList.vue';
import { Task, Workflow } from '../../views/data-explorer/entities.js';
export default {
    title: 'DataExplorer/StepList'
};

const Template = (args, { argTypes }) => ({
    components: { StepList },
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
            this.step.forms = { ...task.forms };
            console.debug('Updating', task);
        },
        select(task, value) {
            this.step.selected = value;
            console.debug('Selecting', task, value);
        }
    },
    data() {
        return {
        };
    },
    template: `<div style="margin-right:200px" >
                <step-list v-bind="$props" v-on="$listeners"
                @toggle="toggle"
                @previewUntilHere="preview"
                @delete="deleteAction"
                @update="update"
                @cancel="step.editing = false"
                @select="select"
                @duplicate="duplicate"/>
               </div>`
});

const task1 = new Task({
    index: 1,
    operation: {
        name: 'Read data',
        label_format: 'Read data from local',
        forms: [
            { 'category': 'execution', fields: [] }
        ]
    }
});
const task2 = new Task({
    index: 2,
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
    index: 3,
    forms: {
        regex: { value: '\\d+' },
        replacement: { value: '?' }
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
const tasks = [task1, task2, task3];
const platform = {id: 1, name: 'Spark', slug: 'spark'};
const workflow = new Workflow({ id: 1, name: 'Test', tasks, platform });
export const BasicList = Template.bind({});
BasicList.args = {
    workflow,
    language: 'pt',
    attributes: ['a', 'b']
};


