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
            this.workflow.tasks.forEach(t => {
                t.previewable = t.display_order <= task.display_order;
            });
        },
        duplicate(task) {
            console.debug('Duplicating', task);
        },
        deleteAction(task) {
            console.debug('Deleting', task);
            this.workflow.deleteTask(task);
        },
        update(task) {
            const wfTask = this.workflow.tasks.find(t => t.id === task.id);
            wfTask.forms = { ...task.forms };
            console.debug('Updating', task);
        },
        cancel(task) {
            console.debug('Canceling edition', task);
        },
        edit(task) {
            console.debug('Editing', task);
        },
        deleteMany(tasks){
            console.debug(tasks);
            const ids = new Set(tasks.map(t => t.id));
            this.workflow.tasks.forEach((task) => {
                if (task.display_order > 1 && 
                        ids.has(task.id)) {
                    this.workflow.deleteTask(task);
                    // this.isDirty = true;
                }
            });            
        }
    },
    data() {
        return {
        };
    },
    template: `<div style="margin-right:200px" >
                <step-list v-bind="$props" v-on="$listeners"
                @toggle="toggle"
                @delete="deleteAction"
                @update="update"
                @delete-many="deleteMany"
                @duplicate="duplicate"/>
               </div>`
});

const task = new Task({
    id: 1,
    index: 1,
    display_order: 1,
    forms: {
        regex: { value: '\\d+' },
        replacement: { value: '?' }
    },
    operation: {
        label_format: 'Replace regex (${this.regex.value}) by "${this.replacement.value}"',
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
            },
            {
                'category': 'execution', fields: [
                    {
                        name: 'regex', suggested_widget: 'text',
                        editable: true, label: 'Regex'
                    },
                    {
                        name: 'replacement', suggested_widget: 'text',
                        editable: true, label: 'Replacement'
                    },
                    {
                        name: 'global', suggested_widget: 'checkbox',
                        editable: true, label: 'Global'
                    },
                    {
                        name: 'maxOccur', suggested_widget: 'integer',
                        editable: true, label: 'Max occurrencies',
                        required: true,
                    }
                ]
            }
        ]
    }
});
const replacements = ['\\d+', '\\w+', '\\s+', '[abc]', '^test'];
const tasks = [];
for (let i = 0; i < 10; i++) {
    const t = structuredClone(task)
    tasks.push(t);
    t.id = '' + i;
    t.index = i;
    t.display_order = i;
    t.forms.regex.value = replacements[i % replacements.length];

}
tasks.forEach((t, i) => t.id = i);
const platform = { id: 1, name: 'Spark', slug: 'spark' };
const workflow = new Workflow({ id: 1, name: 'Test', tasks, platform });
export const BasicList = Template.bind({});
BasicList.args = {
    workflow,
    language: 'pt',
    attributes: ['a', 'b']
};


