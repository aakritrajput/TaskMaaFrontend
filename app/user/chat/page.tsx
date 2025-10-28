"use client";
import { useSocket } from './ChatHook';
import MessageInput from '@/src/components/chat/MessageInput';
import { RootState } from '@/src/lib/store';
import { useSelector } from 'react-redux';

export default function ChatPage() {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const socketRef = useSocket(userId ?? '');

  return (
    <div className="flex flex-col justify-between max-w-3xl mx-auto mt-10 p-6 chat-glass rounded-2xl shadow-lg">
      {userId && <MessageInput socketRef={socketRef} userId={userId} receiverId="12345" chatId="1" /> }
    </div>
  );
}
