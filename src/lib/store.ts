import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/AuthSlice";
import taskReducer from "./features/tasks/TaskSlice";
import groupTaskReducer from "./features/tasks/groupTaskSlice";
import statsReducer from "./features/stats/statSlice";
import chatReducer from "./features/chat/ChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    groupTask: groupTaskReducer,
    stats: statsReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
