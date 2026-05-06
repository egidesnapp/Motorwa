import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './api';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export async function initSocket(): Promise<Socket | null> {
  if (socket?.connected) return socket;

  const token = await SecureStore.getItemAsync('accessToken');
  if (!token) return null;

  socket = io(API_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: false,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  try {
    await socket.connectAsync?.() || new Promise<void>((resolve, reject) => {
      socket!.once('connect', resolve);
      socket!.once('connect_error', reject);
      socket!.connect();
    });
  } catch (error) {
    console.error('Failed to connect socket:', error);
    return null;
  }

  return socket;
}

export function joinConversation(conversationId: string) {
  socket?.emit('join_conversation', { conversationId });
}

export function leaveConversation(conversationId: string) {
  socket?.emit('leave_conversation', { conversationId });
}

export function sendMessage(conversationId: string, content: string, callback?: (msg: any) => void) {
  socket?.emit('send_message', { conversationId, content }, callback);
}

export function onNewMessage(callback: (data: { conversationId: string; message: any }) => void) {
  socket?.on('new_message', callback);
}

export function onTyping(callback: (data: { conversationId: string; userId: string }) => void) {
  socket?.on('user_typing', callback);
}

export function onRead(callback: (data: { conversationId: string; readBy: string }) => void) {
  socket?.on('message_read', callback);
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
