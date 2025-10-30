import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    recieverId?: string;
    content: string;
    timestamp: number;
    status: 'sent' | 'delivered' | 'seen';
}

export type chatType = {
    _id: string;
    isGroupChat: boolean;
    users: [
      {
        user: {
            _id: string;
            username: string;
            profilePicture: string;
        },
        role: 'participant' | 'admin'
      }
    ];
    lastMessage: {
        text: string;
        senderId: string;
        timestamp: string;
    };
    groupName?: string;
    messages?: Message[];
}

type ChatStateType = {
    chats: chatType[];
    initialchatsLoadingStatus: 'Loading' | 'Fetched' | 'Error';
    socketRef: Socket | null;
    offlineMessages?: number;
};

const initialState: ChatStateType = {
    chats: [],
    initialchatsLoadingStatus: 'Loading',
    socketRef: null,
    offlineMessages: 0,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addInitialChats: (state, action: PayloadAction<chatType[]>) => {
            state.chats = action.payload;
            state.initialchatsLoadingStatus = 'Fetched';
        },
        addMessagesToChat: (state, action: PayloadAction<{chatId: string; messages: chatType['messages']}>) => {
            const chat = state.chats.find(c => c._id === action.payload.chatId);
            if (chat) {
                chat.messages = action.payload.messages;
            }
        },
        appendMessage: (state, action: PayloadAction<{chatId: string; message: Message}>) => {
            const chat = state.chats.find(c => c._id === action.payload.chatId)
            if (chat) {
                chat.messages?.push({...action.payload.message, status: 'delivered'})
                chat.lastMessage = {text: action.payload.message.content, senderId: action.payload.message.senderId, timestamp: String(action.payload.message.timestamp)}
            }
        },
        setOfflineMessages: (state, action: PayloadAction<{messages: chatType['messages']}>) => {
            // for now we will go simplest and will only count the numebr of messages but in future for seperate chats we can implement seperate counts !!
            if(!action.payload.messages) return;
            state.offlineMessages = action.payload.messages.length
            for(const message of action.payload.messages){
                const requiredChat = state.chats.find(chat => chat._id === message.chatId)
                if(requiredChat){
                    requiredChat.messages?.push(message)
                }
            }
        },
        updateMessageStatus: (state, action: PayloadAction<{ chatId: string; messageId: string; status: 'sent' | 'delivered' | 'seen' }>) => {
            const chat = state.chats.find(chat => chat._id === action.payload.chatId)
            if (chat?.messages) {
                const message = chat.messages.find(msg => msg.id === action.payload.messageId)
                if(message){
                    message.status = action.payload.status
                }
            }
        },
        addNewChat: (state, action: PayloadAction<chatType>) => {
            state.chats = [action.payload, ...state.chats]
        }
    },
});

export const { addInitialChats, addMessagesToChat, appendMessage,  setOfflineMessages, updateMessageStatus, addNewChat} = chatSlice.actions;
export default chatSlice.reducer;
