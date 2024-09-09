import { ref } from 'vue';
import io from 'socket.io-client';


export const useWebSocket = () => {
  let socketIo = null;
  const connectWebSocket = (serverUrl, namespace, path, eventHandlers) => {
    if (socketIo === null) {
      const socket = io(`${serverUrl}${namespace}`, { upgrade: true, path });

      socketIo = socket;
      for (const eventName in eventHandlers) {
        socket.on(eventName, eventHandlers[eventName]);
      }
    }
  };

  const disconnectWebSocket = () => {
    if (socketIo) {
        socketIo.close();
        socketIo = null;
    }
  };
  const socketEmit = (type, args) => {
    socketIo.emit(type, args);
  };
  const joinRoom = (room, cached=false) => {
    socketIo.emit('join', { cached, room });
  };
  return { connectWebSocket, disconnectWebSocket, socketEmit, joinRoom };
};
