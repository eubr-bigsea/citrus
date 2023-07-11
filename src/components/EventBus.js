import Vue from 'vue';
import { mapGetters } from 'vuex';
import io from 'socket.io-client';
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

debugger
const { user } = { ...mapGetters(['user']) };

const room = `users/${user.id}`;
const opts = { upgrade: true };

if (standSocketIoPath !== '') {
    opts['path'] = standSocketIoPath;
}
const socket = io(`${standSocketServer}${standNamespace}`, opts);

socket.on('connect', () => {
    console.debug("Connected. Moving to room " + room);
    socket.emit('join', { room: room });
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
/*
beforeUnmount() {
    if (this.socket) {
        this.socket.emit('leave', { room: this.room });
        this.socket.close();
    }
}*/
export default new Vue();