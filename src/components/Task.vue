<template>
    <div :id="task.id"
         ref="task"
         :class="classes + (task.enabled !== false ? '': ' disabled ') + (contextMenuOpened ? ' contextMenuOpened ' : '')"
         class="operation task"
         :data-operation-id="task.operation.id"
         :style="getStyle"
         tabindex="0"
         :title="task.forms.comment ? task.forms.comment.value: ''"
         @dblclick.stop="dblClick"
         @click.stop="click"
         @contextmenu="openMenu">
        <div class="hide circle"
             :style="getStyle" />
        <div v-if="!isComment"
             class="title">
            <!-- <span style="font-size:7pt">{{task.$meta}}</span> -->
            {{task.name}}
        </div>
        <em v-if="isComment">{{task.forms.comment ? task.forms.comment.value: ''}}</em>
        <div v-if="!isComment && showDecoration"
             class="right-decor"
             :class="getDecorationClass" />
        <div v-if="!isComment && task.step && task.step.status && !task.warning "
             class="right-decor"
             :class="task.step? task.step.status.toLowerCase(): ''">
            <font-awesome-icon icon="fa fa-2x"
                               :class="getDecorationClass" />
        </div>
        <div v-if="!isComment && task.warning "
             class="right-decor">
            <span v-if="task.warning"
                  class="text-danger fa fa-2x fa-exclamation-circle"
                  :title="task.warning" />
        </div>
        <div v-if="inGroup"
             class="bottom-right-decor">
            <font-awesome-icon icon="fa fa-object-group fa-2x" />
        </div>
        <div v-if="contextMenuOpened && !isComment"
             ref="right"
             class="custom-context-menu">
            <ul>
                <li @click.stop="remove()">
                    {{$t('actions.delete')}}
                </li>
                <li v-if="task.step"
                    @click.stop="showResults()">
                    {{$t('actions.showResults')}}
                </li>
                <li @click.stop="dblClick">
                    {{$tc('titles.property', 2)}}
                </li>
                <li v-for="(item, index) in contextMenuActions"
                    :key="index"
                    @click="item.action(item.name)">
                    {{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import {anchors, endPointOptionsInput, endPointOptionsOutput} from '../jsplumb-const.js';
const TaskComponent = Vue.extend({
    name: 'TaskComponent',
    props: {
        draggable: { default: true, type: Boolean },
        enableContextMenu: { default: true, type: Boolean },
        enablePositioning: {
            default: true, type: Boolean
        },
        instance: {type: Object, default: () => null},
        showDecoration: {
            default: false, type: Boolean
        },
        task: {
            type: Object,
            'default': () => ({ 
                name: '', icon: '', status: '', 
                forms: { color: { value: '#fff' } },
                operation: {name: '', id: 0, ports: []}
            })
        },
    },
    data() {
        return {
            contextMenuOpened: false,
            isComment: false,
            contextMenuActions: [],
        };
    },
    computed: {
        getStyle() {
            let result = {};
            const task = this.task;
            if (this.enablePositioning) {
                result = {
                    zIndex: task.z_index < 99 ? 100 : task.z_index,
                    top: task.top + 'px',
                    left: task.left + 'px',
                };
            }
            result['background'] = task.forms && task.forms.color && task.forms.color.value
                ? task.forms.color.value.background : '#fff';
            return result;
        },
        'classes': function () {
            if (this.task.operation) {
                const cssClass = this.task.operation.css_class ||
                        this.task.operation.cssClass;
                return [
                    (cssClass ? cssClass : ''),
                    (this.task.status ? this.task.status.toLowerCase() : ''),
                    (this.isComment ? ' comment ' : '') + 'test'].join(' ');
            } else {
                return '';
            }

        },
        getDecorationClass() {
            if (this.task.step && this.task.step.status) {
                return this.getClassesForDecor(this.task.step.status);
            } else {
                return this.getClassesForDecor(this.task.status || '');
            }
        },
        inGroup: function () {
            let elem = this.$refs.task;
            return elem && elem._jsPlumbGroup && elem._jsPlumbGroup.id;
        }
    },
    mounted() {
        this.$el.addEventListener('keyup', this.keyboardKeyUpTrigger, true);

        const self = this;
        let operation = this.task.operation;
        let taskId = this.task.id;
        this.task.name = this.task.name || this.task.operation.name;

        let zIndex = this.task['z_index'];
        let inputs = [];
        let outputs = [];

        if (operation.ports) {
            outputs = operation.ports.filter((p) => {
                return p.type === 'OUTPUT';
            }).sort((a, b) => {
                /* For horizontal ports*/
                return b.order - a.order;
                /* For veritical ports */
                // return a.order - b.order;
            });
            inputs = operation.ports.filter((p) => {
                return p.type === 'INPUT';
            }).sort((a, b) => {
                /* For horizontal ports*/
                return b.order - a.order;
                /* For veritical ports */
                // return a.order - b.order;
            });
        }
        const locations = { input: [-1.2, 0], output: [3, -1.1] };
        var lbls = [
            // note the cssClass and id parameters here
            ["Label", { cssClass: "endpoint-label", label: "", id: "lbl", padding: 0 }]
        ];
        const cssClass = this.task.operation.css_class ||
                this.task.operation.cssClass;

        let elem = this.$refs.task;
        if (this.task.operation.slug === 'comment') {
            elem.classList.add('comment');
            this.isComment = true;
        }
        [
            { ports: inputs, type: 'input', options: endPointOptionsInput },
            { ports: outputs, type: 'output', options: endPointOptionsOutput }
        ].forEach((item) => {

            let ports = item.ports;
            let portType = item.type;
            lbls[0][1]['cssClass'] = `endpoint-label ${portType}`;

            // FIXME: hard coded layout
            if (cssClass && cssClass.includes('circle-layout') && ports.length === 2) {
                anchors[portType][1][0][1] = 0.35;
                anchors[portType][1][1][1] = 0.65;
            }

            if (ports.length > 0) {
                anchors[portType][ports.length - 1].forEach((anchor, inx) => {
                    lbls[0][1]['label'] = `<div class="has-${ports.length}-ports">${ports[inx].name}</div>`;

                    let options = JSON.parse(JSON.stringify(item.options)); // clone in order to modify
                    lbls[0][1]['location'] = locations[item.type];
                    options['anchors'] = anchor.slice();
                    options['overlays'] = lbls.slice();
                    options['uuid'] = `${taskId}/${ports[inx].id}`;
                    options['scope'] = ports[inx].interfaces.map((i) => i.name).join(' ');

                    if (ports[inx].interfaces.length && ports[inx].interfaces[0].color) {
                        options['paintStyle']['fillStyle'] = ports[inx].interfaces[0].color;
                    }
                    if (ports[inx].multiplicity !== 'ONE') {
                        if (portType === 'input') {
                            // options['endpoint'] = 'Dot';
                            options['endpoint'] = 'Rectangle';
                            options['cssClass'] = 'multiple-input';
                            // options['anchors'][0] = -0.06;
                            //options['paintStyle']['fillStyle'] = 'transparent';
                        }
                        options['maxConnections'] = 100;
                        // options['paintStyle']['fillStyle'] = 'rgba(228, 87, 46, 1)';
                    }

                    options['cssClass'] += `  ${cssClass}`;
                    options['dragOptions'] = {
                        start: (event, ui) => { // eslint-disable-line no-unused-vars
                            //console.debug("dragEndpointStart")
                            this.$root.$emit('onstart-flow', event.el._jsPlumb.scope);
                        },
                        stop: (event, ui) => { // eslint-disable-line no-unused-vars
                            //console.debug("dragEndpointStop")
                            this.$root.$emit('onstop-flow', event.el._jsPlumb.scope);
                        }
                    };
                    options.paintStyle.fill = options.paintStyle.fillStyle;
                    if (self.instance && self.instance.addEndpoint) {
                        const endpoint = self.instance.addEndpoint(elem, options);
                        endpoint.bind('click', self.endpointClick);
                        endpoint.canvas.style.zIndex = zIndex > 0 ? zIndex - 1 : 1;
                        endpoint._portId = ports[inx].id;
                    }
                });
            }
        });
        if (self.draggable && self.instance && self.instance.addEndpoint) {
            self.instance.draggable(elem, {
                lineWidth: 3,
                containment: "parent",
                grid: [1, 1],
                drag() {
                    // let elem = document.getElementById(self.task.id);
                    let elem = self.$refs.task;
                    self.task.left = elem.offsetLeft;
                    self.task.top = elem.offsetTop;
                },
                stop() {
                    self.$root.$emit('onset-isDirty', true);
                }
            });
        }
        this.$root.$emit("ontask-ready", self.task);
    },
    methods: {
        keyboardKeyUpTrigger(ev) {
            this.$root.$emit('onkeyboard-keyup', ev);
        },
        getClassesForDecor(value) {
            let result = [];
            switch (value) {
            case 'ERROR':
                result.push("fa fa-times-circle fa-2x");
                break;
            case 'PENDING':
                result.push("fa fa-pause-circle fa-2x");
                break;
            case 'CANCELED':
                result.push("fa fa-stop-circle fa-2x");
                break;
            case 'RUNNING':
                result.push("fa fa-sync fa-spin fa-2x");
                break;
            case 'COMPLETED':
                result.push("fa fa-check-circle fa-2x");
                break;
            default:
            }
            result.push(value.toLowerCase());
            return result.join(' ');
        },
        openMenu(e) {
            if (!this.isComment && this.enableContextMenu) {
                this.contextMenuOpened = true;
                const self = this;
                Vue.nextTick(function () {
                    self.$refs.right.focus();
                    //self.$refs.right.style.left = e.offsetX;
                    //self.$refs.right.style.top = e.offsetY;
                    self.setMenu(e.offsetY, e.offsetX);
                }.bind(this));
                // Force close previously opened menus
                document.dispatchEvent(new Event('click'));
                document.addEventListener('click', this.hideMenu);
                this.zIndex = this.$el.style.zIndex;
                this.$el.style.zIndex = 100000;
                e.preventDefault();
            }
        },
        hideMenu() {
            this.contextMenuOpened = false;
            this.$el.style.zIndex = this.zIndex;
            document.removeEventListener('click', this.hideMenu);
        },
        setMenu: function (top, left) {

            let largestHeight = window.innerHeight - this.$refs.right.offsetHeight - 25;
            let largestWidth = window.innerWidth - this.$refs.right.offsetWidth - 25;

            if (top > largestHeight) top = largestHeight;

            if (left > largestWidth) left = largestWidth;

            this.$refs.right.style.top = top + 'px';
            this.$refs.right.style.left = left + 'px';
        },
        _click(ev, showProperties) {
            const self = this;
            let elem = ev.target.classList.contains('task') ? ev.target : ev.target.parentElement;

            Array.prototype.slice.call(document.querySelectorAll(".task.selected"), 0).forEach((e) => {
                e.classList.remove('selected');
            });
            if (ev.ctrlKey) {
                self.instance.addToDragSelection(this);
            } else if (elem.classList.contains('jsplumb-drag-selected')) {
                //nothing
            } else {
                this.$el.classList.add('selected');
                self.selectedTask = this;
            }
            self.instance.repaintEverything();

            // Raise the click event to upper components
            this.$root.$emit('onclick-task', self, showProperties);
            this.hideMenu();
        },
        dblClick(ev) {
            this._click(ev, true);
        },
        click(ev) {
            this.$el.focus();
            this._click(ev, false);
        },
        showResults() {
            this.contextMenuOpened = false;
            this.$root.$emit('onshow-result', this.task);
        },
        remove() {
            this.contextMenuOpened = false;
            this.$root.$emit('onremove-task', this.task);
        },
        endpointClick(endpoint, e) {
            if (e.ctrlKey) {
                console.debug('Port id: ', endpoint._portId);
            }
        }
    },
});
export default TaskComponent;
</script>

<style scoped lang="scss">
    /* Colors */

    $color1: rgba(228, 87, 46, 1);
    $color2: rgba(41, 51, 92, 1);
    $color3: rgba(242, 141, 0, 1);
    $color4: rgba(168, 198, 134, 1);
    $color5: rgba(102, 155, 188, 1);
    $color6: #fafafa;

    $elementWidth: 120px;
    $elementHeight: 50px;


    .custom-context-menu {
        background: #FAFAFA;
        border: 1px solid #BDBDBD;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
        list-style: none;
        padding: 0;
        position: absolute;
        width: 150px;
        z-index: 999999;

        ul {
            list-style-type: none;
            margin: 5px 0;
            padding: 0 0 0 5px;
        }

        li {
            border-bottom: 1px solid #E0E0E0;
            margin: 0;
            padding: 5px 15px;
            font-weight: bold;

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background: #1E88E5;
                color: #FAFAFA;
            }
        }
    }

    .has-1-ports,
    .has-2-ports,
    .has-3-ports {
        font-size: .8em;
    }

    .has-2-ports {
        text-align: center;
        max-width: $elementWidth / 2 + 5;
    }

    .has-3-ports {
        margin: 0px 0;
        padding: 0px 0px;
        text-align: center;
        max-width: calc($elementWidth / 3);
        z-index: 90;
    }

    .sample {
        display: none;
    }

    .buttons-toolbar {
        background: white;
        padding: 5px;
        width: 100%;
        z-index: 100;

        p {
            margin: 1px;
        }
    }

    li.dragging {
        color: $color2;
        padding-top: 15px;
        list-style-type: none;
        width: $elementWidth;
        height: $elementHeight;
        border: 1px solid $color2;
        border-radius: 10px;
        font-size: 8pt;
        text-align: center;
        font-weight: bold;

        .fa-grip {
            display: none;
        }
    }

    .diagram-toolbar {
        .add-margin {
            margin-right: 5px !important;
        }
    }

    .lemonade-container {
        height: calc(100vh - 186px);
        overflow: hidden;
        position: relative;
        width: 100%;
    }
    #lemonade,
    .lemonade {
        position: relative;
        margin-top: 0px;
        z-index: 0;
        min-height: calc(690px * (90/150));
        height: 5000px;
        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        /* Chrome/Safari/Opera */
        -khtml-user-select: none;
        /* Konqueror */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* Internet Explorer/Edge */
        user-select: none;

        /* Non-prefixed version, currently
                                                                not supported by any browser */
        .jtk-group-expanded,
        .jtk-group-collapsed {
            background: transparent;
            border: 2px solid #888;
            height: 300px;
            padding: 4px;
            position: absolute;
            width: 400px;

            .command {
                text-align: right;
            }

            .header {
                padding: 5px;
                background: #ed8;
                overflow: auto;

                >div {
                    float: left;
                    width: 50%;
                }
            }

            .resizer {
                position: absolute;
                background: red;
                width: 50px;
                height: 50px;
                bottom: 0;
                right: 0;
            }
        }

        .jtk-group-collapsed {
            height: 80px !important;
            width: 120px !important;
            overflow: hidden;

            .task {
                display: none;
            }
        }

        .task {
            border-width: 0px;
            font-size: 12px;
            background: white;
            opacity: 1;

            &.disabled {
                background: #fff;

                .title {
                    color: #ccc;
                    text-decoration: line-through;
                }
            }

            &.completed {
                border: none;
            }

            ;

            /*&.interrupted, &.canceled, &.error, &.canceled,*/
            &.running,
            &.highlight {
                border: 1px dashed red !important;
                box-shadow: 0px 0px 50px #a93;
                -moz-box-sha: 0px 0px 50px #a93;
                -webkit-box-: 0px 0px 50px #a93;
            }

            ;

            .right-decor {
                left: 48px;
            }

            .left-decor {
                left: -10px;
            }

            .right-decor,
            .left-decor,
            .bottom-right-decor {
                color: #aaa;
                /* border: 1px solid #ccc; */
                background-color: #fff;
                border-radius: 20px;
                font-size: 6pt !important;
                padding: 1px;
                position: absolute;
                display: block;
                bottom: 1px;
                height: 18px;
                width: 18px;
                text-align: center;

                &.completed {
                    color: seagreen;
                    /*
                    span {
                         @extend .fa-check; 
                    }
                    */
                }

                &.running {
                    color: dodgerblue;

                    span {
                        /* @extend .fa-spin;
                        @extend .fa-refresh; */
                        display: block;
                        width: 16px;
                        height: 16px;
                        display: inline-block;
                        text-align: center;
                    }
                }

                &.interrupted {
                    color: black;
                    /*
                    span {
                        @extend .fa-hand-stop-o; 
                    }*/
                }

                &.canceled {
                    color: darkgray;
                    /*
                    span {
                         @extend .fa-close; 
                    }
                    */
                }

                &.waiting {
                    color: #aaa;
                    /*
                    span {
                        @extend .fa-clock-o; 
                    }
                    */
                }

                &.error {
                    color: red;

                    /*
                    span {
                        @extend .fa-warning; 
                    }*/
                }
            }

            .bottom-right-decor {
                right: 10px;
                bottom: 0;
            }

            &.service {
                background-color: lighten($color5, 30%) !important;
            }

            &.comment {
                z-index: 1;

                .decor {
                    display: none;
                }

                strong {
                    display: none;
                }

                em {
                    font-family: Verdana, Tahoma, Geneva, sans-serif;
                    vertical-align: top !important;
                    bottom: inherit;
                    margin-top: 3px;
                    font-size: 8pt !important;
                    top: 5%;
                    min-height: 200px;
                }

                div.title {
                    background: transparent !important;
                }

                background:#ffffa5;
                overflow-y: auto;
                border: none !important;
                border-radius: 0 !important;
                padding:10px !important;
                font-family: 'Gloria Hallelujah',
                cursive;
                font-size: 1.2em;
                color: #000;
                width: 200px !important;
                min-height: 80px;

                ;
                box-shadow: 0px 4px 6px #333;
                -moz-box-shadow: 0px 4px 6px #333;
                -webkit-box-shadow: 0px 4px 6px #333;
            }

            &.operation {
                background-color: #DDD;
                border-radius: 5px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, .16);
                color: $color2;
                cursor: move;
                /* fallback if grab cursor is unsupported */
                cursor: grab;
                cursor: -moz-grab;
                cursor: -webkit-grab;

                height: $elementHeight;
                padding: 0px;
                position: absolute;
                width: $elementWidth;
                z-index: 2;
                justify-content: center;

                &.jsplumb-drag-selected,
                &.jtk-drag-selected {
                    box-shadow: 0px 4px 8px rgba(dodgerblue, .5);
                }

                .title {
                    align-self: center;
                    text-align: center;
                    height: calc(100% - 5px);
                    width: 100%;
                    margin: 5px 0 0 0;
                    padding: .25rem;
                    background: #fff;
                    overflow: hidden;
                    line-height: 1;
                    border-radius: 0 0 5px 5px;

                }
            }

            &.data-source {
                background-color: lighten($color1, 30%);
            }

            &.algorithm {
                background-color: lighten($color4, 30%);
            }

            &.model {
                background-color: lighten($color3, 30%);
            }

            &.selected {
                box-shadow: 0px 4px 8px rgba(dodgerblue, .5);
            }

            &:focus {
                outline: none;
            }

            em {
                top: 48%;
                padding: 0 5px;
                position: absolute;
                font-style: normal;
                font-family: Verdana, Tahoma, Geneva, sans-serif;
                font-size: 6pt !important;
            }

            p {
                border-top: 1px solid $color2;
            }
        }
    }

    .endpoint {
        opacity: 1;
        background: white;

        &.many-endpoint {
            background-color: red;
        }
    }

    .endpoint-label {
        color: $color5;
        background:
            /*$color6*/
            transparent;
        font-size: 8pt;

        &.input {
            margin-top: -20px;
        }

        &.output {
            margin-top: 30px;
        }

        z-index: 100;
    }

    .jsplumb-drag-selected,
    .jtk-drag-selected {
        border-width: 2px !important;
        border-color: $color5 !important;
    }

    .jsplumb-endpoint,
    .jtk-endpoint {
        background: transparent;
    }

    .jsplumb-connector,
    .jtk-connector {
        z-index: 2;
    }

    .log-item {
        margin-right: 10px;
    }

    .log-enter-active,
    .log-leave-active {
        transition: all 2s;
        font-weight: bold;
    }

    .log-enter,
    .log-leave-to
    /* .list-leave-active for <2.1.8 */

        {
        opacity: 0;
        color: red;
        /*transform: translateY(5px);*/
    }

    /* \f142 is ellipsis-v */

    /* \202F is thin unbreakable space */

    .fa.fa-grip:before {
        content: "\f142\202F\f142\202F\f142";
    }

    .drop-menu-item-2,
    .drop-menu-item-3 {
        border-bottom: 1px solid #aaa;

        li {
            padding-left: 20px;
        }
    }

    .list-group-item {
        border: none !important;
        border-bottom: 1px dotted #aaa !important;
    }

    .list-group-item:last-child,
    .list-group-item:first-child {
        border-radius: 0 !important;
    }

    a.disabled {
        pointer-events: none;
        cursor: default;
        opacity: 0.6;
    }

    .margin-top-10 {
        margin-top: 10px;
    }

    .contextMenuOpened {
        cursor: default !important;
    }

    .multiple-input {
        border: 1px solid white;
        border-radius: 0 8px 8px 0;
        width: 16px !important;
        overflow: hidden;
    }

    .hide {
        display: none;
    }

    div.size-2 {
        height: 65px !important;
    }

    .cylinder {
        border: 1px solid !important;
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        width: 80px !important;
        height: 80px !important;
        border-radius: 100px/32px !important;
        background-color: rgba(160, 160, 160, 0.5);
        .title {
            background: transparent !important;
            font-size: .95em;
            height: auto !important;
            line-height: normal;
            margin-top: 20px !important;
            width: 100% !important;
        }
    }

    .cylinder:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 80px !important;
        height: 20px;
        background: #ddd;
        border-radius: 100px/25px;
        border: 1px solid;
        content: '';
    }

    .cylinder:after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 80px;
        height: 20px;
        border-radius: 148px/28px;
        content: '';
    }
    .parallelogram {
        background: transparent !important;
        font-family:open sans;
        color:#fff;
        position: relative;
        display:inline-block;
        padding:10px 20px;
        -webkit-box-shadow: none !important;
        box-shadow: none !important;

        .title {
            background: transparent !important;
        }
    }

    .parallelogram:after {
        border: 1px solid #aaa;
        background: white;
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-transform: skew(-30deg);
        -moz-transform: skew(-30deg);
        -o-transform: skew(-30deg);
        transform: skew(-30deg);
        z-index: -1;
    }
    .parallelogram.selected:after {
        -webkit-box-shadow: 0px 6px 10px rgba(dodgerblue, .5);
        box-shadow: 0px 4px 8px rgba(dodgerblue, .5);
    }

    div.double-layout {
        border: #29335c 3px double !important;
    }

    div.circle-layout {
        border: none !important;
        background: transparent !important;
        width: 80px !important;
        height: 80px !important;

        &.selected,
        &.jtk-drag-selected {
            -webkit-box-shadow: none !important;
            box-shadow: none !important;

            .circle {
                -webkit-box-shadow: 6px 4px 6px 0px #020f57;
                box-shadow: 6px 4px 6px 0px #020f57;
                border: 1px dashed #222;
            }

        }

        .circle {
            border: 1px solid #888;
            margin: 10px auto 0px auto;
            background: white;
            border-radius: 60px;
            height: 60px;
            width: 60px;

            &.hide {
                display: block;
            }
        }
        .title {
            margin-top: 20px !important;
        }

        .right-decor {
            bottom: 11px !important;
        }

        &.endpoint {
            padding-top: 100px;
        }
    }
</style>