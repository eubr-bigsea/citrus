<template>
    <div>
        <h3 class="border-bottom mb-3">
            Test web socket (server: {{standSocketIoPath}} namespace {{namespace}})
        </h3>
        <div class="row">
            <div class="col-md-3">
                <label>Room</label>
                <input v-model="newRoom" class="form-control form-control-sm">
                <button class="mt-2 btn btn-sm btn-primary" @click="change">
                    Change
                </button>
                <button class="ml-1 mt-2 btn btn-sm btn-danger" @click="disconnect">
                    Disconnect
                </button>
            </div>
            <div class="col-md-6">
                <label>Message</label>
                <textarea v-model="message" class="form-control form-control-sm" />
                <button class="mt-2 btn btn-success btn-sm" @click="send(false)">
                    Send
                </button>
                <button class="mt-2 btn btn-success btn-sm ml-1" @click="send(true)">
                    Send as object
                </button>
            </div>
            <div class="col-md-3">
                <label for="">Type</label>
                <input v-model="type" type="text" class="form-control form-control-sm">
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class=" border mt-1 p-2">
                    <strong>Messages from this page's socket</strong>
                    <br>
                    <button class="btn btn-sm btn-warning mt-3" @click="responses = []">
                        Clear messages
                    </button>
                    <pre class="pre-code"><code v-for="m, x in responses"
                                                :key="x">{{m}} <br></code></pre>
                </div>
            </div>
            <div class="col-md-6">
                <div class=" border mt-1 p-2">
                    <strong>Messages from store's socket (room users/{{user.id}})</strong>
                    <br>
                    <button class="btn btn-sm btn-warning mt-3" @click="responsesFromStore = []">
                        Clear messages
                    </button>
                    <!--button class="btn btn-sm btn-secondary ml-2 mt-3" @click="emitFromStore">
                        Send hello from store
                    </button -->
                    <pre class="pre-code"><code v-for="m, x in responsesFromStore"
                                                :key="x">{{m}} <br></code></pre>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import io from 'socket.io-client';
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            type: 'echo',
            message: '',
            responses: [],
            responsesFromStore: [],
            newRoom: 'echo',
            room: 'echo',
            socket: null,
            namespace: standNamespace,
            standSocketIoPath,
        };
    },
    computed: {
        ...mapGetters(['user']),
    },
    mounted() {
        const self = this;
        const opts = { upgrade: true };
        if (standSocketIoPath !== '') {
            opts['path'] = standSocketIoPath;
        }
        const socket = io(
            `${standSocketServer}${standNamespace}`, opts);

        self.socket = socket;

        socket.on('disconnect', () => {
            console.debug('You are not connected');
        });
        socket.on('connect', () => {
            console.debug('Connecting to room "' + this.room + '"');
            socket.emit('join', { room: this.room });
            self.socket = socket;
        });
        socket.on('connect_error', (error) => {
            console.debug('Web socket server offline', error.code);
        });
        socket.on('exported result', (msg) => {
            this.responses.push(msg);
        });
        socket.on('echo', (msg) => {
            this.responses.push(msg);
        });
        socket.on('update task', (msg) => {
            this.responses.push("TASK: " + JSON.stringify(msg));
        });
        socket.on('update job', (msg) => {
            this.responses.push("JOB: " + JSON.stringify(msg));
        });
        socket.on('notifications', (msg) => {
            this.responses.push(msg);
        });
        socket.on('response', (msg) => {
            this.responses.push(msg.message);
        });
        this.$store.dispatch('registerEventListener',
            {
                event: 'echo2', callback: (msg, a) => {
                    this.responsesFromStore.push(msg);
                }
            });
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.emit('leave', { room: this.room });
            this.socket.close();
        }
    },

    methods: {
        emitFromStore() {
            this.$store.commit('emitMessage', {
                eventName: 'echo',
                message: 'Hello, from the store!'
            });
        },
        disconnect() {
            this.socket.disconnect();
        },
        change() {
            this.socket.emit('leave', { room: this.room });
            this.room = this.newRoom;
            this.socket.emit('join', { room: this.room });
        },
        send(asObject) {
            this.socket.emit(this.type, asObject ? JSON.parse(this.message) : this.message);
        }
    }
};
</script>
<style scoped>
.pre-code {
    margin-top: 15px;
    padding: 1px;
    font-size: 8pt;
    border: 1px solid #aaa;
    height: 60vh;
    overflow: auto;
}
</style>