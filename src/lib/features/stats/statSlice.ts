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
  userName: string;
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
        }
    },
})

export const {addPerformance, addLeaderBoard, errorGettingPerformance, errorGettingLeaderBoard, editPerformance} = statSlice.actions;
export default statSlice.reducer;