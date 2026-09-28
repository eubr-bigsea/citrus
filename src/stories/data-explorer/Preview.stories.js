import PreviewComponent from '@/views/data-explorer/DataExplorerPreview.vue';
export default {
    title: 'DataExplorer/Preview'
};

// Fake service
const service = new Proxy({},
    {
        get: function (target, prop) {
            if (target[prop] === undefined) {
                return function () {
                    console.debug(`Called ${prop.toString()}`);
                };
            } else {
                return target[prop];
            }
        }
    });
const Template = (args, { argTypes }) => ({
    components: { PreviewComponent },
    props: Object.keys(argTypes),
    mounted() {
    },
    data() {
        return {
        };
    },
    template: `<div>
                    <vue-snotify/>
                    <preview-component :service="service" :attributes="attributes" :items="items"/>
                </div>`
});

export const Default = Template.bind({});
Default.args = {
    service,
    attributes: [
        { label: 'id', key: 'id', type: 'Integer', locked: false, tdClass: 'getTdClass' },
        { label: 'name', key: 'name', type: 'Text', locked: false, tdClass: 'getTdClass' },
        { label: 'birthday', key: 'birthday', type: 'Date', locked: false, tdClass: 'getTdClass' },
        { label: 'salary', key: 'salary', type: 'Decimal', locked: false, tdClass: 'getTdClass' },
        { label: 'voted', key: 'voted', type: 'Boolean', locked: true, tdClass: 'getTdClass' },
        { label: 'voteHour', key: 'voteHour', type: 'Time', locked: false, tdClass: 'getTdClass' },
        { label: 'votes', key: 'votes', type: 'Array', locked: false, tdClass: 'getTdClass' },
        { label: 'long column with spaces', key: 'longColumn', type: 'Text', locked: false, tdClass: 'getTdClass' },
    ],
    items: [
        {
            id: 1, name: 'John Doe', birthday: '20/11/2000', salary: 1322.23,
            voted: true, voteHour: '12:22', votes: [1, 3, 22]
        },
        {
            id: 2, name: 'John Doe', birthday: '20/11/2000', salary: 1322.23,
            voted: true, voteHour: '12:22', votes: [1, 3, 22]
        },
        {
            id: 3, name: 'John Doe', birthday: '20/11/2000', salary: 1322.23,
            voted: true, voteHour: '12:22', votes: [1, 3, 22]
        },
        {
            id: 4, name: 'John Doe', birthday: '20/11/2000', salary: 1322.23,
            voted: true, voteHour: '12:22', votes: [1, 3, 22]
        }
    ],
};
