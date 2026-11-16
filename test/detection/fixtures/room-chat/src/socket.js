import { WebSocketServer } from 'ws';
import { deleteRoom, isMember, postMessage } from './rooms.js';
import { verifySession } from './sessions.js';

const server = new WebSocketServer({ port: 3001 });

server.on('connection', (socket, request) => {
  const token = new URL(request.url, 'http://localhost').searchParams.get(
    'token'
  );
  const user = verifySession(token);

  if (!user) return socket.close(4401, 'Unauthorized');

  socket.on('message', (raw) => {
    const message = JSON.parse(raw.toString());

    if (message.type === 'post') {
      if (!isMember(message.roomId, user.id)) return;

      postMessage(message.roomId, user.id, String(message.text).slice(0, 2000));
    }

    if (message.type === 'delete-room') deleteRoom(message.roomId);
  });
});
