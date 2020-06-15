<template>
    <div :class="classes + (task.enabled !== false ? '': ' disabled ') + (contextMenuOpened ? ' contextMenuOpened ' : '')" class="operation task"
        :data-operation-id="task.operation.id" :id="task.id" ref="task" v-bind:style="getStyle" v-on:dblclick.stop="dblClick"
        v-on:click.stop="click" @contextmenu="openMenu" tabindex="0"
        :title="task.forms.comment ? task.forms.comment.value: ''">

        <div class="hide circle" v-bind:style="getStyle"></div>
        <div v-if="!isComment" v-bind:style="{borderTop: getBorder}" class="title">
            {{task.name}}
        </div>
        <em v-if="isComment">{{task.forms.comment ? task.forms.comment.value: ''}}</em>
        <div v-if="!isComment && showDecoration" class="right-decor" :class="getDecorationClass">
        </div>
        <div v-if="!isComment && task.step && task.step.status && !task.warning " class="right-decor" :class="task.step? task.step.status.toLowerCase(): ''">
            <span class="fa fa-2x" :class="getDecorationClass"></span>
        </div>
        <div v-if="!isComment && task.warning " class="right-decor">
            <span class="text-danger fa fa-2x fa-exclamation-circle" v-if="task.warning" 
                :title="task.warning"></span>
        </div>
        <div v-if="inGroup" class="bottom-right-decor">
            <span class="fa fa-object-group fa-2x"></span>
        </div>
        <div class="custom-context-menu" v-if="contextMenuOpened && !isComment" ref="right">
            <ul>
                <li @click.stop="remove()">{{$t('actions.delete')}}</li>
                <li @click.stop="showResults()" v-if="task.step">{{$t('actions.showResults')}}</li>
                <li @click.stop="dblClick">{{$tc('titles.property', 2)}}</li>
                <li v-for="(item, index) in contextMenuActions" @click="item.action(item.name)" :key="index">
                    {{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
    import Vue from 'vue';
    const anchorsOriginal = {
        input: [
            [
                [0.5, 0, 0, -1],
            ],
            [
                [0.2, 0, 0, -1],
                [0.8, 0, 0, -1]
            ],
            [
                [0.2, 0, 0, -1],
                [0.5, 0, 0, -1],
                [0.8, 0, 0, -1]
            ]
        ],
        output: [
            [
                [0.5, 1, 0, 1],
            ],
            [
                [0.2, 1, 0, 1],
                [0.8, 1, 0, 1]
            ],
            [
                [0.2, 1, 0, 1],
                [0.5, 1, 0, 1],
                [0.8, 1, 0, 1]
            ]
        ]
    }
    const anchors = {
        input: [
            [
                [0, 0.5, -1, 0],
            ],
            [
                [0, 0.2, -1, 0],
                [0, 0.8, -1, 0]
            ],
            [
                [0, 0.1, -1, 0],
                [0, 0.5, -1, 0],
                [0, 0.9, -1, 0]
            ]
            ,
            [
                [0, .1, -1, 0],
                [0, 0.39, -1, 0],
                [0, 0.65, -1, 0],
                [0, .9, -1, 0]
            ],
        ],
        output: [
            [
                [1, 0.5, 1, 0],
            ],
            [
                [1, 0.2, 1, 0],
                [1, 0.8, 1, 0]
            ],
            [
                [1, 0.1, 1, 0],
                [1, 0.5, 1, 0],
                [1, 0.9, 1, 0]
            ],
            [
                [1, .1, 1, 0],
                [1, 0.39, 1, 0],
                [1, 0.65, 1, 0],
                [1, .9, 1, 0]
            ],
        ]
    }
    const connectorType = ['Flowchart', 'Bezier', 'StateMachine'][0];
    const connectorPaintStyle = {
        lineWidth: 1,
        radius: 8,
        strokeStyle: "#111",
        stroke: "#111",
        outlineColor: 'white',
        outlineWidth: 2,
    };

    const endPointPaintStyle = {
        fillStyle: 'rgba(102, 155, 188, 1)',
        radius: 8,
        height: 15,
        width: 15,
        zIndex: 99,
    }
    const overlays = [
        ["Arrow", { location: .85, width: 10, length: 15 }],
        //["Label", { padding: 10, location: .5, label: '[ <span class="fa fa-dot-circle-o"></span> ]', cssClass: "labelClass" }]
    ];


    const endPointOptionsInput = {
        isSource: false,
        isTarget: true,
        cssClass: 'endpoint',
        paintStyle: endPointPaintStyle,
        connectorOverlays: overlays,
        endpoint: "Dot",
        maxConnections: 1,
        fill: '#222'
    };

    const endPointOptionsOutput = {
        connector: [connectorType, { gap: 0, xproximityLimit: 100, curviness: 75, xmargin: 10, cornerRadius: 5, stub: [20, 20], midpoint: .5 },],
        isSource: true,
        isTarget: false,
        cssClass: 'endpoint',
        paintStyle: endPointPaintStyle,
        connectorOverlays: overlays,
        endpoint: "Rectangle",
        maxConnections: 1,
        connectorStyle: connectorPaintStyle,
        fill: '#faa'
    };

    const connectionOptions = {
        maxConnections: 1,
        endpoint: ['Dot', connectorPaintStyle],
        paintStyle: connectorPaintStyle,
        overlays: overlays,
    }

    const TaskComponent = Vue.extend({
        computed: {
            getStyle() {
                let result = {}
                let task = this.task
                if (this.enablePositioning) {
                    result = {
                        zIndex: task.z_index < 99 ? 100 : task.z_index,
                        top: task.top + 'px',
                        left: task.left + 'px',
                    }
                }
                result['background'] = task.forms && task.forms.color && task.forms.color.value
                                ? task.forms.color.value.background : '#fff';
                return result
            },
            'classes': function () {
                const cssClass = this.task.operation.css_class || 
                    this.task.operation.cssClass;
                return [
                    (cssClass ? cssClass : ''),
                    (this.task.status ? this.task.status.toLowerCase() : ''),
                    (this.isComment ? ' comment ' : '') + 'test'].join(' ');

            },
            getDecorationClass() {
                if (this.task.step && this.task.step.status) {
                    return this.getClassesForDecor(this.task.step.status);
                } else {
                    return this.getClassesForDecor(this.task.status || '')
                }
            },
            getBorder() {
                let color = '#fff'
                if (this.task.forms && this.task.forms.color && this.task.forms.color.value) {
                    color = this.task.forms.color.value.background
                }
                return `0px solid ${color}`
            },
            inGroup: function () {
                let elem = this.$refs.task;
                return elem && elem._jsPlumbGroup && elem._jsPlumbGroup.id;
            }
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
                        self.setMenu(e.offsetY, e.offsetX)
                    }.bind(this));
                    // Force close previously opened menus
                    document.dispatchEvent(new Event('click'));
                    document.addEventListener('click', this.hideMenu);
                    this.zIndex = this.$el.style.zIndex;
                    this.$el.style.zIndex = 100000;
                    e.preventDefault()
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
                self.instance.repaintEverything()

                // Raise the click event to upper components
                this.$root.$emit('onclick-task', self, showProperties);
                this.hideMenu();
            },
            dblClick(ev) {
                this._click(ev, true);
            },
            click(ev) {
                this.$el.focus()
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
            endpointClick(endpoint, e){
                if (e.ctrlKey){
                    console.debug('Port id: ', endpoint._portId);
                }
            }
        },
        props: {
            enableContextMenu: { default: true },
            enablePositioning: {
                default: true
            },
            draggable: { default: true },
            instance: null,
            showDecoration: {
                default: false
            },
            task: {
                'default': function () { return { name: '', icon: '', status: '', forms:{color: {value: '#fff'} } }; }
            },
        },
        data() {
            return {
                contextMenuOpened: false,
                isComment: false,
                contextMenuActions: [],
            }
        },
        watch: {
            enableContextMenu: function (newVal, oldVal) {
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            },
        },
        mounted() {
            this.$el.addEventListener('keyup', this.keyboardKeyUpTrigger, true);

            const self = this;
            let operation = this.task.operation;
            let taskId = this.task.id;
            this.task.name = this.task.name || this.task.operation.name

            let zIndex = this.task['z_index'];
            let inputs = []
            let outputs = []

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
            const locations = { input: [-1.2, 0], output: [3, -1.1] }
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
                if (cssClass && cssClass.includes('circle-layout') && ports.length === 2){
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
                            start: (event, ui) => {
                                //console.debug("dragEndpointStart")
                                this.$root.$emit('onstart-flow', event.el._jsPlumb.scope);
                            },
                            stop: (event, ui) => {
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
    });
    export default TaskComponent;
</script>
<style lang="scss">
    .has-1-ports,
    .has-2-ports,
    .has-3-ports,
    .has-4-ports {
        color: #1E88E5;
        font-size: .5em;
        /* background: #fff !important; */
        display: block;
        line-height: 6px;
        z-index: 10000;
        text-align: center;
        width: 55px;
    }

    .endpoint-label.output {
        z-index: 1;
        /* background: green */
    }

    .output {
        
        .has-1-ports,
        .has-2-ports,
        .has-3-ports,
        .has-4-ports {
            position: relative;
            z-index: 5;
            left: -2px;
        }
        .has-1-ports {
            top: 10px;
        }
        .has-2-ports {
            top: 15px;
        }
        .has-3-ports {
            margin-top: 40px !important;
        }
        .has-4-ports {
            margin-top: 40px !important;
        }

    }

    .input {

        .has-1-ports,
        .has-2-ports,
        .has-3-ports {
            top: -6px;
            left: 0px;
            position: relative;

        }
    }
</style>
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
        xmargin: 3px 0 0 20px;
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
        max-width: $elementWidth / 3;
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

    /* #lemonade-diagram {
        width: 2000px;
        height: 4000px;
        .ghost-active {
            display: block !important;
        }
        .ghost-select>span {
            border: 1px dashed #000;
            width: 100%;
            height: 100%;
            float: left;
        }
        .ghost-select {
            display: none;
            width: 100px;
            height: 100px;
            z-index: 100000;
            position: absolute !important;
            cursor: default !important;
        }
    } */

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
            border-width: 1px;
            font-family: Verdana, Tahoma, Geneva, sans-serif;
            font-size: 10px;
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

                    span {
                        /* @extend .fa-check; */
                    }
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

                    span {
                        /* @extend .fa-hand-stop-o; */
                    }
                }

                &.canceled {
                    color: darkgray;

                    span {
                        /* @extend .fa-close; */
                    }
                }

                &.waiting {
                    color: #aaa;

                    span {
                        /* @extend .fa-clock-o; */
                    }
                }

                &.error {
                    color: red;

                    span {
                        /* @extend .fa-warning; */
                    }
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
                /*
            -moz-transform: rotate(2deg);
            -webkit-transform: rotate(2deg);
            -o-transform: rotate(2deg);
            -ms-transform: rotate(2deg);
            transform: rotate(2deg);
            */
                box-shadow: 0px 4px 6px #333;
                -moz-box-shadow: 0px 4px 6px #333;
                -webkit-box-shadow: 0px 4px 6px #333;
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
                box-shadow: -2px 1px 6px 0px $color3;
            }

            &:focus{
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

            &.operation {
                border: $color2 1px solid;
                border-radius: 2px;
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
                xdisplay: flex;
                justify-content: center;

                &.jsplumb-drag-selected,
                &.jtk-drag-selected {
                    box-shadow: -2px 1px 6px 0px #f28d00;
                    font-style: italic;
                    color: green;
                }

                .title {
                    align-self: center;
                    text-align: center;
                    height: 100%;
                    width: 90%;
                    margin: 0 5%;
                    background: #fff;
                    overflow: hidden;
                }
            }

            &.operation:after {
                mix-blend-mode: difference;
            }
            span {
                xfont-size: 12pt;
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

    /* 
    .endpoint:hover {
        opacity: 1;
        background-color: $color3;
    }

    li .list-group-item {
        list-style-type: none;
        font-size: 9pt;
        padding: 5px 5px;
        font-weight: bold;

    } */

    /**/

    /* .icon-union:before {
        content: "\222A";
    }

    .icon-intersection:before {
        content: "\2229";
    }

    .icon-projection:before {
        content: '\03C3';
    } */

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
</style>
<style lang="scss" scoped>
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
        height: 60px !important;
        border-radius: 100px/32px !important;
        background-color: rgba(160, 160, 160, 0.5);
}

    .cylinder:before {
        position: absolute;
        left: 0;
        top: 0;
        width: 80px !important;
        height: 20px;
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
        border: 1px solid;
        content: '';
    }
  
    div.circle-layout {
        border: none !important;
        background: transparent !important;
        width: 80px !important; 
        height: 80px !important;
        &.selected, &.jtk-drag-selected{
            webkit-box-shadow: none !important;
            box-shadow: none !important;
            .circle {
                webkit-box-shadow: 6px 4px 6px 0px #020f57;
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
            background: transparent !important;
            font-size: .95em;
            height: auto !important;
            line-height: normal;
            width: 100% !important;
        }
        .right-decor {
            bottom: 11px !important;
        }
        &.endpoint {
            padding-top: 100px;
        }
    }
</style>
