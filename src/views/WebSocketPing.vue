<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <h6>Test web socket</h6>
                    Namespace: ({{namespace}})
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
                <label>Room</label>
                <input class="form-control" v-model="newRoom"/>
                <button @click="change" class="mt-2 btn btn-primary">Change</button>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-md-4">
                <label>Message</label>
                <input type="text" class="form-control" v-model="message"/>
                <button @click="send" class="mt-2 btn btn-primary">Send</button>
            </div>
            <div class="col-md-12">
                <ul>
                    <li v-for="m in responses">{{m}}</li>
                </ul>
            </div>
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
            newRoom: 'echo',
            room: 'echo',
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
            console.debug('Connecting to room "' + this.room + '"');
            socket.emit('join', { room: this.room });
            self.socket = socket;
        });
        socket.on('connect_error', () => {
            console.debug('Web socket server offline');
        });
        socket.on('echo', (msg) => {
            this.responses.push(msg)
        });
        socket.on('notifications', (msg) => {
            this.responses.push(msg)
        });
        socket.on('response', (msg) => {
            this.responses.push(msg.message)
        });

    },
    beforeDestroy() {
            if (this.socket) {
                this.socket.emit('leave', { room: this.room});
                this.socket.close();
            }
        },

    methods:{
        change(){
            this.socket.emit('leave', { room: this.room});
            this.room = this.newRoom;
            this.socket.emit('join', { room: this.room });
        },
        send(){
            this.socket.emit('echo', this.message);
        }
    }
}
</script>

