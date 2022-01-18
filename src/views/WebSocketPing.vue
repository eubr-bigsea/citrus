<template>
    <div>
        <h3 class="border-bottom mb-3">Test web socket (namespace {{namespace}})</h3>
        <div class="row">
            <div class="col-md-3">
                <label>Room</label>
                <input class="form-control form-control-sm" v-model="newRoom" />
                <button @click="change" class="mt-2 btn btn-sm btn-primary">Change</button>
                <button @click="disconnect" class="ml-1 mt-2 btn btn-sm btn-danger">Disconnect</button>
            </div>
            <div class="col-md-6">
                <label>Message</label>
                <textarea class="form-control form-control-sm" v-model="message"></textarea>
                <button @click="send(false)" class="mt-2 btn btn-success btn-sm">Send</button>
                <button @click="send(true)" class="mt-2 btn btn-success btn-sm ml-1">Send as object</button>
            </div>
            <div class="col-md-3">
                <label for="">Type</label>
                <input type="text" class="form-control form-control-sm" v-model="type">
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-sm btn-warning mt-3" @click="responses=[]">Clear messages</button>
                <pre class="pre-code"><code v-for="m in responses">{{m}} <br/></code></pre>
            </div>
        </div>
    </div>
</template>
<script>
    import io from 'socket.io-client';
    const standNamespace = process.env.VUE_APP_STAND_NAMESPACE;
    const standUrl = process.env.VUE_APP_STAND_URL;
    export default {
        data() {
            return {
                type: 'echo',
                message: '',
                responses: [],
                newRoom: 'echo',
                room: 'echo',
                socket: null,
                namespace: standNamespace,
            }
        },
        mounted() {
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
            socket.on('update task', (msg) => {
                this.responses.push("TASK: " + JSON.stringify(msg))
            });
            socket.on('update job', (msg) => {
                this.responses.push("JOB: " + JSON.stringify(msg))
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
                this.socket.emit('leave', { room: this.room });
                this.socket.close();
            }
        },

        methods: {
            disconnect(){
                this.socket.disconnect();
            },
            change() {
                this.socket.emit('leave', { room: this.room });
                this.room = this.newRoom;
                this.socket.emit('join', { room: this.room });
            },
            send(asObject) {
                this.socket.emit(this.type, asObject? JSON.parse(this.message) : this.message);
            }
        }
    }
</script>
<style scoped>
    .pre-code {
        margin-top: 15px;
        font-size: 10pt;
        border: 1px solid #aaa;
        height: 60vh;
        overflow: auto;
    }
</style>