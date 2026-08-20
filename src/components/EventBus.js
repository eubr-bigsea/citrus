import { mapGetters } from 'vuex';
import io from 'socket.io-client';
const standNamespace = import.meta.env.VITE_STAND_NAMESPACE;
const standSocketIoPath = import.meta.env.VITE_STAND_SOCKET_IO_PATH;
const standSocketServer = import.meta.env.VITE_STAND_SOCKET_IO_SERVER;

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
// Vue 3's instances no longer expose $on/$off/$emit for ad hoc buses like
// Vue 2's `new Vue()` did — a plain listener map replaces it.
const listeners = new Map();
export default {
    on(event, handler) {
        (listeners.get(event) || listeners.set(event, []).get(event)).push(handler);
    },
    off(event, handler) {
        const handlers = listeners.get(event);
        if (handlers) {
            const i = handlers.indexOf(handler);
            if (i !== -1) handlers.splice(i, 1);
        }
    },
    emit(event, ...args) {
        (listeners.get(event) || []).forEach(handler => handler(...args));
    }
};