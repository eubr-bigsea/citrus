<template>
    <div />
</template>

<script>

import io from 'socket.io-client';
import { mapGetters } from 'vuex';
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;
const thornUrl = import.meta.env.VITE_THORN_URL;

export default {
    name: 'WebSocket',
    data() {
        return {
            namespace: standNamespace,
            socket: null,
            room: null,
        };
    },
    computed: {
        ...mapGetters(['user']),
    },
    mounted() {
        this.room = `users/${this.user.id}`;
        const opts = { upgrade: true };

        if (standSocketIoPath !== '') {
            opts['path'] = standSocketIoPath;
        }
        const socket = io(`${standSocketServer}${standNamespace}`, opts);

        socket.on('connect', () => {
            console.debug("Connected. Moving to room " + this.room);
            socket.emit('join', { room: this.room });
        });
        socket.on('message', (msg) => {
            console.debug(msg);
        });
        socket.on('connect_error', () => {
            console.debug('Web socket server offline');
        });

        socket.on('disconnect', () => {
            console.debug('You are not connected');
        });
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.emit('leave', { room: this.room });
            this.socket.close();
        }
    },
    methods: {

    },

};
</script>