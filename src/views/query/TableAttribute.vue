<template lang="">
    <li ref="attribute">{{attribute.name}}</li>
</template>
<script>
    export default {
        props: {
            jsplumbInstance: { default: null, type: Object },
            attribute: {type: Object, default: ()=>{}}
        },
        watch: {
            jsplumbInstance(instance) {
                if (instance) {
                    /*
                    const elem = this.$refs.attribute;
                    const endpointOptions = {
                        isSource: true,
                        isTarget: true,
                        connector: 'StateMachine',
                        maxConnections: -1,
                        endpoint: ["Rectangle", { radius: 1, width: 10, height: 8 }],
                    }
                    */
                    // this.jsplumbInstance.addEndpoint(elem, 
                    //     { anchor: [-0.02, 0.5, 0, 0.0] }, endpointOptions );
                    // instance.addEndpoint(elem,
                    //     { anchor: [1.02, 0.5, 0, 0] }, endpointOptions);
                    // const options2 = {
                    //     anchor: ["Continuous", {radius: 2}],
                    //     paintStyle: { fill: "#222" }
                    // }
                    // instance.makeSource(elem, options2);
                    // instance.makeTarget(elem, options2);
                }
            }
        }
    }
</script>
