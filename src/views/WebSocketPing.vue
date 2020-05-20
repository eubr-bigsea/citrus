<template>
    <div class="row">
        <div class="col-md-12">
        <h6>Ping</h6>
        Namespace: ({{namespace}})
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" v-model="message"/>
        </div>
        <div class="col-md-4">
            <button @click="send" class="btn btn-primary">Send</button>
        </div>
        <div class="col-md-12">
            <ul>
                <li v-for="m in responses">{{m}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import io from 'socket.io-client';
const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;
const standUrl = process.env.VUE_APP_STAND_URL;
export default {
    data(){
        return {
            message: '',
            responses: [],
			socket: null,
            namespace: standNamespace,
        }
    },
    mounted(){
        const self = this;
        const socket = io(this.namespace, {
            upgrade: true,
        });
    
        self.socket = socket;
    
        socket.on('disconnect', () => {
            console.debug('You are not connected');
        });
        socket.on('connect', () => {
            console.debug('Connecting to echo room');
            socket.emit('join', { room: 'echo' });
            self.socket = socket;
        });
        socket.on('connect_error', () => {
            console.debug('Web socket server offline');
        });
		socket.on('echo', (msg) => {
			this.responses.push(msg)
		});
 		socket.on('response', (msg) => {
			this.responses.push(msg.message)
		});

    },
    beforeDestroy() {
            if (this.socket) {
                this.socket.emit('leave', { room: 'echo'});
                this.socket.close();
            }
        },

    methods:{
        send(){
			this.socket.emit('echo', this.message);
        }
    }
}
</script>

