const rooms = new Map();

export const isMember = (roomId, userId) =>
  rooms.get(roomId)?.members.has(userId) ?? false;

export const postMessage = (roomId, userId, text) => {
  rooms.get(roomId)?.messages.push({ userId, text, at: Date.now() });
};

export const deleteRoom = (roomId) => {
  rooms.delete(roomId);
};
