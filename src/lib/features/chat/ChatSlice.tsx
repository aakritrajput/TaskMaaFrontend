import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Message = {
    id: string;
    chatId: string;
    senderId: string;
    recieverId?: string;
    content: string;
    timestamp: number;
    status: 'sent' | 'delivered' | 'read';
}

type chatType = {
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
};

const initialState: ChatStateType = {
    chats: [],
    initialchatsLoadingStatus: 'Loading',
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
    },
});

export const { addInitialChats, addMessagesToChat } = chatSlice.actions;
export default chatSlice.reducer;
