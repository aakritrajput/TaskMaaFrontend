// src/app/chat/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addInitialChats, appendMessage, Message, setOfflineMessages, updateMessageStatus } from '@/src/lib/features/chat/ChatSlice';
import axios from 'axios';
import { RootState } from '@/src/lib/store';

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const initialchatsLoadingStatus = useSelector((state: RootState) => state.chat.initialchatsLoadingStatus)
  const [offlineMessagesHere, setOfflineMessagesHere] = useState<Message[]>([]);
  
  useEffect(() => {
    if(initialchatsLoadingStatus == 'Fetched' && offlineMessagesHere.length > 0){
      dispatch(setOfflineMessages({messages: offlineMessagesHere}))
      setOfflineMessagesHere([])
    }
  }, [initialchatsLoadingStatus, dispatch, offlineMessagesHere])

  useEffect(() => {
    if (!userId) return;

    async function getInitialChats(){
      try {
        const response = await axios.get('http://localhost:5000/api/chat/getChatInterface', {withCredentials: true})
        dispatch(addInitialChats(response.data.data))
      } catch (error) {
        if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
        }else {
          alert("There was some Error getting your initial chats !! - Need to refresh the whole page.. ")
        }
      }
    }

    getInitialChats();

    const socket = io('http://localhost:5000', {
      withCredentials: true,
      query: { userId },
    });

    socketRef.current = socket;

    console.log('connected socket: ', socketRef.current)
    // when offline messages arrive
    socket.on('offline-messages', (messages) => {
      setOfflineMessagesHere(messages);
      for(const msg of messages){
        socket.emit('delivered_ack', {
          messageId: msg.id,
          chatId: msg.chatId,
          senderId: msg.senderId,
        })
      }
    });

    // when receiving a new message
    socket.on('recieve-message', (message) => {
      dispatch(appendMessage({userId, chatId: message.chatId, message}));
      console.log('recieved message: ', message)
      socket.emit('delivered_ack', {
        messageId: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
      });
    });

    socket.on('message_sent', (message) => {
      dispatch(appendMessage({userId, chatId: message.chatId, message}))
    })

    // when message is marked delivered or read
    socket.on('message_delivered', ({ chatId, messageId }) => {
      dispatch(updateMessageStatus({ chatId, messageId, status: 'delivered' }));
    });

    socket.on('messages_read', ({ chatId, messageIds }) => {
      messageIds.forEach((id: string) => dispatch(updateMessageStatus({ chatId , messageId: id, status: 'seen' })));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  return socketRef;
};
