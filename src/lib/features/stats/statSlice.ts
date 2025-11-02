import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// -------- types ----------

export type PerformanceType = { // same type as in maiin dashboard
  currentStreak: number;
  longestStreak: number;
  overallScore: number;
  weeklyProgress: number[];
  lastStreakOn: string;
  badges: string[];
};

type LeaderboardType = {
  _id: string;
  username: string;
  profilePicture?: string; // url
  overallScore: number;
};

type statsStateType = {
    performance: PerformanceType | null;
    leaderBoard: LeaderboardType[] | null;
    performanceStatus: 'Loading' | 'Fetched' | 'Error' ;
    leaderBoardStatus: 'Loading' | 'Fetched' | 'Error' ;
}

// ------- Initial State ---------

const initialState: statsStateType = {
    performance: null,
    leaderBoard: null,
    performanceStatus: 'Loading',
    leaderBoardStatus: 'Loading',
}

const statSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        addPerformance: (state, action: PayloadAction<PerformanceType>) => {
            state.performance = action.payload;
            state.performanceStatus = 'Fetched';
        },
        addLeaderBoard: (state, action: PayloadAction<LeaderboardType[]>) => {
            state.leaderBoard = action.payload;
            state.leaderBoardStatus = 'Fetched';
        },
        errorGettingPerformance: (state) => {
            state.performanceStatus = 'Error';
        },
        errorGettingLeaderBoard: (state) => {
            state.performanceStatus = 'Error';
        },
        editPerformance: (state, action: PayloadAction<PerformanceType>) => {
            state.performance = action.payload;
        },
        updateStreak: (state, action: PayloadAction<'continue' | 'remove'>) => {
            if (action.payload == 'continue' && state.performance){
                state.performance.currentStreak = state.performance.currentStreak ? state.performance.currentStreak + 1 : 1 ;
                if(state.performance.currentStreak > state.performance.longestStreak){
                    state.performance.longestStreak = state.performance.currentStreak;
                }
            }
            else if(action.payload == 'remove' && state.performance){
                state.performance.currentStreak = state.performance.currentStreak ? state.performance.currentStreak - 1 : 0 ;
            }
        },
        updateWeeklyProgress: (state, action: PayloadAction<'completed' | 'uncompleted'>) => {
            if(state.performance){
                const weeklyProgress = state.performance.weeklyProgress ;
                if(action.payload == 'completed'){
                    weeklyProgress[weeklyProgress.length - 1] = weeklyProgress[weeklyProgress.length - 1] + 1;
                }
                else if(action.payload == 'uncompleted'){
                    weeklyProgress[weeklyProgress.length - 1] = weeklyProgress[weeklyProgress.length - 1] - 1;
                }
            }
        }
    },
})

export const {addPerformance, addLeaderBoard, errorGettingPerformance, errorGettingLeaderBoard, editPerformance, updateStreak, updateWeeklyProgress} = statSlice.actions;
export default statSlice.reducer;