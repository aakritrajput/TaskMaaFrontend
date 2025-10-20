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

type friendsType = {
    id: string;
    name: string;
    username: string;
    profilePic: string;
    isFriend: boolean;
}

type groupTaskSliceType = {
    groupTasks: groupTaskType[];
    publicTasks: groupTaskType[];
    friends: friendsType[];
}

const initialState: groupTaskSliceType = {
    groupTasks: [],
    publicTasks: [],
    friends: [],
}

const groupTaskSlice = createSlice({
    name: "groupTask",
    initialState,
    reducers: {
        addGroupTasks: (state, action: PayloadAction<groupTaskType[]>) => {
            state.groupTasks = action.payload;
        },
        addPublicTasks: (state, action: PayloadAction<groupTaskType[]>) => {
            state.publicTasks = action.payload;
        },
        addFriends: (state, action: PayloadAction<friendsType[]>) => {
            state.friends = action.payload;
        },
        addNewGroupTask: (state, action: PayloadAction<groupTaskType>) => {
            state.groupTasks.push(action.payload)
        },
        editGroupTask: (state, action: PayloadAction<groupTaskType>) => {
            state.groupTasks  = state.groupTasks.map(task => task._id == action.payload._id ? action.payload : task)
        },
        deleteGroupTask: (state, action: PayloadAction<groupTaskType["_id"]>) => {
            state.groupTasks = state.groupTasks.filter(task => task._id !== action.payload)
        },
        addNewFriend: (state, action: PayloadAction<friendsType>) => {
            state.friends.push(action.payload)
        },
        removeFriend: (state, action: PayloadAction<friendsType["id"]>) => {
            state.friends = state.friends.filter(task => task.id !== action.payload)
        },
    }
})

export const {addGroupTasks, addPublicTasks, addFriends, addNewGroupTask, editGroupTask, deleteGroupTask, addNewFriend, removeFriend} = groupTaskSlice.actions ;

export default groupTaskSlice.reducer ;