<template>
    <div class="row">
        <div class="col-md-12">
            <button class="btn btn-secondary btn-sm mr-1" @click="addElement">Add element</button>
            <button class="btn btn-secondary btn-sm mr-1" @click="addGroup">Add group</button>
            <button class="btn btn-secondary btn-sm mr-1" @click="addSample">Add sample</button>
        </div>
        <div class="col-md-12">
            <div id="diagram" ref="diagram" class="border"></div>
        </div>
    </div>
</template>
<script>
import {jsPlumb} from 'jsplumb';
//getBoundingClientRect
const endpointSource = { 
      anchor:"Right", 
      isSource:true, 
      isTarget:false,
      connector : "Bezier",
      connectorStyle: { strokeWidth:1, stroke:'blue' },
      scope:"blueline",
      dragAllowedWhenFull:false     
}; 
const endpointTarget = { 
      anchor:"Left", 
      isSource:false, 
      isTarget:true,
      connector : "Bezier",
      scope:"blueline",
      dragAllowedWhenFull:false     
}; 

export default {
    data(){
        return {
            instance: null,
            sequential: 1
        }
    },
    mounted(){
        this.instance= jsPlumb.getInstance(
        {
            Endpoint : ["Dot", {radius:10}],
            HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:4 },
            ConnectionOverlays : [
                [ "Arrow", {
                    location:1,
                    id:"arrow",
                    length:1,
                    foldback:0.8
                }]
                ,
                //,[ "Label", { label:"Connect To", id:"label", cssClass:"aLabel" }]
            ],
            Container: this.$refs.diagram,
       });
		this.instance.bind("group:addMember", function(p) {
				var grp = p.group;
				console.log("Group", p.group.id, "added", p.el.id, 
					"for a total of", grp.getMembers().length, "members.");
				});

		this.instance.bind("group:removeMember", function(p) {
				var grp = p.group;
				console.log("Group", p.group.id, "removed", 
					p.el.id, "for a total of", grp.getMembers().length, "members.");
				});
    },
    methods: {
        addSample(){
            let groupId = this.addGroup();
            let groupElem = document.getElementById(groupId);
            groupElem.style.left = '350px';
            groupElem.style.top = '100px';
            let posX = [100, 100, 60, 60, 600, 600];
            let posY = [100, 300, 50, 120, 100, 300];
            for (var i = 0; i < 6; i++){ 
                let _id = this.addElement();
                let task = document.getElementById(_id);
                if (i === 2 || i === 3){
                    this.instance.addToGroup(groupId, task);
                }
                task.style.left = posX[i] + 'px'
                task.style.top = posY[i] + 'px'
            }
            this.instance.connect({ uuids: ['seq_2_out', 'seq_4_in'] })
            this.instance.connect({ uuids: ['seq_3_out', 'seq_5_in'] })
            this.instance.connect({ uuids: ['seq_4_out', 'seq_6_in'] })
            this.instance.connect({ uuids: ['seq_5_out', 'seq_7_in'] })
            this.instance.repaintEverything()
        },
        addElement(){
            const elem = document.createElement('div');
            elem.id = `seq_${this.sequential}`;
            elem.classList.add('task');
            
            this.$refs.diagram.appendChild(elem);
            this.instance.addEndpoint(elem, {uuid: `${elem.id}_in`}, endpointTarget);
            this.instance.addEndpoint(elem, {uuid: `${elem.id}_out`}, endpointSource);
            this.instance.draggable(elem, {grid: [10, 10]});
            this.sequential ++;
            return elem.id;
        },
        addGroup(){
            const self = this;
            const newId = `seq_${this.sequential}`;
            const elem = document.createElement('div');
            elem.setAttribute('id', newId);
            elem.classList.add('group-container');

            const header = document.createElement('div');
            header.classList.add('header');
        
            header.addEventListener('click', (evt) => {
                if (evt.target.dataset.collapsed != 'true'){
                    self.instance.collapseGroup(evt.target.parentNode.id);
                    evt.target.dataset.collapsed = true;
                } else { 
                    self.instance.expandGroup(evt.target.parentNode.id);
                    evt.target.dataset.collapsed = false;
                }
            });
            elem.appendChild(header);

            this.$refs.diagram.appendChild(elem);
            this.instance.addGroup({
              el: elem,
              id: newId, orphan: true,
              endpoint:[ "Rectangle", { width:5, height:5 } ],
            });
            this.sequential ++;
            return elem.id;
        }
    }

}
</script>
<style>
    #diagram {
        border: 1px solid;
        height: 500px;
        width: 100%;
        position: relative;
    }
    .task {
        width: 90px;
        height: 40px;
        text-align:center;
        position: absolute;
        top: 10px;
        border: 1px solid;
		z-index: 999;
 
   }
.jtk-group-collapsed {
	overflow: hidden;
}
.group-container {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 0 0 12px 12px;
    background-color: WhiteSmoke;
    font-size: 12px;
    cursor: move;
    border: 1px solid;
}
  .group-container .header {
    background: #0074D9;
    height: 30px;
    width: 100%;
}
.group-container .task {
   border: 3px double !important;
}
.jtk-group-collapsed {
   height: 32px;
   border-radius: 0;
}
</style>
