import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type groupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'private' | 'public';
    creatorId: string;
    dueDate: string;
    importance: 'low' | 'medium' | 'high' ;
    status: 'ongoing' | 'completed' ;
    winners: string[];
    createdAt?: string;
    updatedAt?: string;
}

type groupTaskSliceType = {
    currentTask: groupTaskType | null;
}

const initialState: groupTaskSliceType = {
    currentTask: null,
}

const groupTaskSlice = createSlice({
    name: "groupTask",
    initialState,
    reducers: {
        addCurrentTask: (state, action: PayloadAction<groupTaskType>) => {
            state.currentTask = action.payload;
        },
        removeCurrentTask: (state) => {
            state.currentTask = null;
        }
    }
})

export const {addCurrentTask, removeCurrentTask} = groupTaskSlice.actions ;

export default groupTaskSlice.reducer ;