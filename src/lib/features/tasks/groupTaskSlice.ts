import { Member } from "@/src/components/user/GroupTaskModal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type groupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'private' | 'public';
    creatorId: string;
    dueDate: string;
    importance: 'low' | 'medium' | 'high' ;
    members: Member['_id'][];
    status: 'ongoing' | 'completed' ;
    winners: string[];
    createdAt?: string;
    updatedAt?: string;
}

type friendsType = {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
    isFriend: boolean;
}

type groupTaskSliceType = {
    groupTasks: groupTaskType[];
    publicTasks: groupTaskType[];
    friends: friendsType[];
    groupTaskStatus: 'Loading' | 'Fetched' | 'Error';
    publicTaskStatus: 'Loading' | 'Fetched' | 'Error';
    friendsStatus: 'Loading' | 'Fetched' | 'Error';
}

const initialState: groupTaskSliceType = {
    groupTasks: [],
    publicTasks: [],
    friends: [],
    groupTaskStatus: 'Loading',
    publicTaskStatus: 'Loading',
    friendsStatus: 'Loading',
}

const groupTaskSlice = createSlice({
    name: "groupTask",
    initialState,
    reducers: {
        addGroupTasks: (state, action: PayloadAction<groupTaskType[]>) => {
            state.groupTasks = action.payload;
            state.groupTaskStatus = 'Fetched';
        },
        addPublicTasks: (state, action: PayloadAction<groupTaskType[]>) => {
            state.publicTasks = action.payload;
            state.publicTaskStatus = 'Fetched';
        },
        addFriends: (state, action: PayloadAction<friendsType[]>) => {
            state.friends = action.payload;
            state.friendsStatus = 'Fetched';
        },
        errorOnGrouptasks: (state) => {
            state.groupTaskStatus = 'Error';
        },
        errorOnPublictasks: (state) => {
            state.publicTaskStatus = 'Error';
        },
        errorOnFriends: (state) => {
            state.friendsStatus = 'Error';
        },
        addNewGroupTask: (state, action: PayloadAction<groupTaskType>) => {
            state.groupTasks = [action.payload, ...(state.groupTasks)]
        },
        editGroupTask: (state, action: PayloadAction<groupTaskType>) => {
            state.groupTasks  = state.groupTasks.map(task => task._id == action.payload._id ? action.payload : task)
        },
        updateIdOfNewlyAddedGroupTask: (state, action: PayloadAction<{oldId: string; newData: groupTaskType}>) => {
            state.groupTasks = state.groupTasks.map(task => task._id == action.payload.oldId ? action.payload.newData : task)
        },
        deleteGroupTask: (state, action: PayloadAction<groupTaskType["_id"]>) => {
            state.groupTasks = state.groupTasks.filter(task => task._id !== action.payload)
        },
        addNewFriend: (state, action: PayloadAction<friendsType>) => {
            state.friends.push(action.payload)
        },
        removeFriend: (state, action: PayloadAction<friendsType["_id"]>) => {
            state.friends = state.friends.filter(task => task._id !== action.payload)
        },
    }
})

export const {addGroupTasks, addPublicTasks, addFriends, errorOnGrouptasks, errorOnPublictasks, errorOnFriends, addNewGroupTask,updateIdOfNewlyAddedGroupTask, editGroupTask, deleteGroupTask, addNewFriend, removeFriend} = groupTaskSlice.actions ;

export default groupTaskSlice.reducer ;