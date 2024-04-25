import { ref } from 'vue';
import io from 'socket.io-client';

const socketIo = ref(null);

export const useWebSocket = () => {
  const connectWebSocket = (serverUrl, namespace, path, eventHandlers) => {
    if (socketIo.value === null) {
      const socket = io(`${serverUrl}${namespace}`, { upgrade: true, path });

      socketIo.value = socket;
      for (const eventName in eventHandlers) {
        socket.on(eventName, eventHandlers[eventName]);
      }
    }
  };

  const disconnectWebSocket = () => {
    if (socketIo.value) {
      socketIo.value.close();
      socketIo.value = null;
    }
  };
  const socketEmit = (type, args) => {
    socketIo.value.emit(type, args);
  };
  const joinRoom = (room) => {
    socketIo.value.emit('join', { cached: false, room });
  };
  return { connectWebSocket, disconnectWebSocket, socketEmit, joinRoom };
};
