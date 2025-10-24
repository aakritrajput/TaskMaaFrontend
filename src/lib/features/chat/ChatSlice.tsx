import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    id: string;
    chatId: string;
    senderId: string;
    recieverId?: string;
    content: string;
    timestamp: number;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatState {
    messages: Message[];
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setOfflineMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages.push(...action.payload);
        },
        updateMessageStatus: (
            state,
            action: PayloadAction<{ messageId: string; status: 'delivered' | 'read' }>
        ) => {
            const msg = state.messages.find((m) => m.id === action.payload.messageId);
            if (msg) msg.status = action.payload.status;
        },
    },
});

export const { addMessage, setOfflineMessages, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
