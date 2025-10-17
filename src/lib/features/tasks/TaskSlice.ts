import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -------- types ----------

type TaskType = {
    _id: string;
    user: string; // will be user id
    title: string;
    description?: string;
    importance: "low" | "medium" | "high";
    status: "inProgress"| "completed";
    type: "daily" | "general" ;
    dueDate: string;
    completedOn: string | undefined;
}

type taskStateType = {
    dailyTasks: TaskType[] | [];
    generalTasks: TaskType[] | [];
    dailyTasksStatus: 'Loading' | 'Fetched' | 'Error' ;
    generalTasksStatus: 'Loading' | 'Fetched' | 'Error' ;
}

// ------- Initial State ---------

const initialState: taskStateType = {
    dailyTasks: [],
    generalTasks: [],
    dailyTasksStatus: 'Loading',
    generalTasksStatus: 'Loading',
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addDailyTasks: (state, action: PayloadAction<TaskType[]>) => {
            state.dailyTasks = action.payload;
            state.dailyTasksStatus = 'Fetched';
        },
        addGeneralTasks: (state, action: PayloadAction<TaskType[]>) => {
            state.generalTasks = action.payload;
            state.generalTasksStatus = 'Fetched';
        },
        errorGettingDailyTasks: (state) => {
            state.dailyTasksStatus = 'Error';
        },
        errorGettingGeneralTasks:  (state) => {
            state.generalTasksStatus = 'Error';
        },
        addTask: (state, action: PayloadAction<TaskType>) => {
            const task = action.payload
            if(task.type == 'daily'){
                state.dailyTasks = [...state.dailyTasks, task];
            }
            else if(task.type == 'general') {
                state.generalTasks = [...state.generalTasks, task];;
            }
        },
        updateIdOfNewlyAddedTask: (state, action: PayloadAction<{oldId: string, newId: string, type: TaskType['type']}>) => {
            if(action.payload.type == 'daily'){
                const newdailyTasks = state.dailyTasks.map((dailyTask) => dailyTask._id == action.payload.oldId ? {...dailyTask, _id: action.payload.newId} : dailyTask);
                state.dailyTasks = newdailyTasks;
            }
            else if(action.payload.type == 'general') {
                const newGeneralTasks = state.generalTasks.map((genTask) => genTask._id == action.payload.oldId ? {...genTask, _id: action.payload.newId} : genTask);
                state.generalTasks = newGeneralTasks;
            }
        },
        editTask: (state, action: PayloadAction<TaskType>) => {
            const task = action.payload
            if(task.type == 'daily'){
                const newdailyTasks = state.dailyTasks.map((dailyTask) => dailyTask._id == task._id ? task : dailyTask);
                state.dailyTasks = newdailyTasks;
            }
            else if(task.type == 'general') {
                const newGeneralTasks = state.generalTasks.map((genTask) => genTask._id == task._id ? task : genTask);
                state.generalTasks = newGeneralTasks;
            }
        },
        deleteTask: (state, action: PayloadAction<{_id: string, type: 'daily' | 'general'}>) => {
            if (action.payload.type == 'daily'){
                const newdailyTasks = state.dailyTasks.filter((dailyTask) => dailyTask._id !== action.payload._id)
                state.dailyTasks = newdailyTasks;
            }
            else if (action.payload.type == 'general'){
                const newGeneralTasks = state.generalTasks.filter((genTask) => genTask._id !== action.payload._id)
                state.generalTasks = newGeneralTasks;
            }
        }
    },
})

export const {addDailyTasks, addGeneralTasks, errorGettingDailyTasks, errorGettingGeneralTasks, addTask, updateIdOfNewlyAddedTask, editTask, deleteTask} = taskSlice.actions;
export default taskSlice.reducer;