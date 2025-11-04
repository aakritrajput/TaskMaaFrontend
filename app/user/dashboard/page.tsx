"use client";

import MaaPopup from "@/src/components/taskMaa/MaaPopup";
import { useMaaHandler } from "@/src/components/taskMaa/useMaaHandler";
import { addLeaderBoard, addPerformance, errorGettingLeaderBoard, errorGettingPerformance } from "@/src/lib/features/stats/statSlice";
import { addDailyTasks, addGeneralTasks, errorGettingDailyTasks, errorGettingGeneralTasks } from "@/src/lib/features/tasks/TaskSlice";
import { RootState } from "@/src/lib/store";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// ---------------------------
// Types
// ---------------------------

// type PerformanceType = {
//   currentStreak: number;
//   longestStreak: number;
//   overallScore: number;
//   weeklyProgress: number[];
//   lastStreakOn: string;
//   badges: string[];
// };

type TaskItem = {
  user: string;
  title: string;
  description?: string;
  importance: "low" | "medium" | "high";
  status: "inProgress" | "completed";
  type: "daily" | "general";
  dueDate: string; // ISO date or human
};

// type LeaderboardType = {
//   userName: string;
//   profilePicture?: string; // url
//   overallScore: number;
// };

// Helpers

const totalTasksCompletedPercentage = (tasks: TaskItem[]) => {
  const total = tasks.length;
  if (total === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / total) * 100);
}

const getTotalAndCompletedTasks = (tasks: TaskItem[]) => {
  const total = tasks.length;
  if(total == 0) return [0,0];
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return [total, completedTasks] ;
}


const shortDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString();
};


// Chart data functions

function getLast7Days() {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday ...

  const last7Days = [];
  
  for (let i = 6; i >= 0; i--) {
    const index = (todayIndex - i + 7) % 7; // ensures wrap-around
    last7Days.push(days[index]);
  }

  return last7Days;
}

const last7Days = getLast7Days();

const COLORS = ["#34D399", "#F87171"];

// Small presentational component

function StatusChip({ status }: { status: TaskItem["status"] }) {
  const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  if (status === "completed") return <span className={`${base} bg-white/8 text-green-300`}>Completed</span>;
  if (status === "inProgress") return <span className={`${base} bg-white/8 text-sky-300`}>In Progress</span>;
  return <span className={`${base} bg-white/8 text-yellow-300`}>Pending</span>;// just a placeholder !!
}

// ---------------------------
// Main Dashboard Component
// ---------------------------

export default function TaskMaaDashboard() {

  const stats = useSelector((state: RootState) => state.stats);
  const performance = stats.performance;
  const performanceStatus = stats.performanceStatus;
  const leaderboard = stats.leaderBoard;
  const leaderboardStatus = stats.leaderBoardStatus;

  const weeklyActivity = last7Days.map((day, index) => ({
    day: day,
    tasks: performance ? performance.weeklyProgress[index] : 0, // fallback if missing
  }));

  // tasks 

  const TaskState = useSelector((state: RootState) => state.tasks)
  const dailyTasksStatus = TaskState.dailyTasksStatus ;
  const generalTaskStatus = TaskState.generalTasksStatus ;
  const dailyTasks = TaskState.dailyTasks ;
  const generalTasks = TaskState.generalTasks ;

  const dispatch = useDispatch();

  const {triggerMaaResponse, message} = useMaaHandler();

  // status pie

  const [total, completed] = getTotalAndCompletedTasks([...dailyTasks, ...generalTasks])
  const statusPie = [  // in future we can enhance this by seperating the status pie's of both daily and general tasks !! -- but for now we will account both of them together..
    { name: "Completed", value: completed },
    { name: "InProgress", value: total - completed }
  ];

  const user = useSelector((state: RootState) => state.auth.user)

  const hasFetched = useRef({
    daily: false, 
    general: false,
    leaderboard: false,
    performance: false,
  });
  
  useEffect(()=>{
    // these task calls are also there in tasks page 
    if(dailyTasksStatus == 'Loading' && !hasFetched.current.daily){
      async function getTodaysTasks(){
        try {
          hasFetched.current.daily = true;
          const response = await axios.get('http://localhost:5000/api/tasks/todaysTask', {withCredentials: true});
          dispatch(addDailyTasks(response.data.data));
        } catch (error) {
          dispatch(errorGettingDailyTasks())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getTodaysTasks();
    }
    if(generalTaskStatus == 'Loading' && !hasFetched.current.general){
      async function getGeneralTasks(){
        try {
          hasFetched.current.general = true;
          const response = await axios.get('http://localhost:5000/api/tasks/generalTasks', {withCredentials: true});
          dispatch(addGeneralTasks(response.data.data));
        } catch (error) {
          dispatch(errorGettingGeneralTasks())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getGeneralTasks();
    }

    if(performanceStatus == 'Loading' && !hasFetched.current.performance){
      async function getPerformance(){
        try {
          hasFetched.current.performance = true;
          const response = await axios.get('http://localhost:5000/api/dashboard/getPerformanceStats', {withCredentials: true});
          dispatch(addPerformance(response.data.data));

          if(response.data.data.lastOnline){
            const lastOnline = new Date(response.data.data.lastOnline);
            const today = new Date();
            
            // Compare only year, month, and date
            const isLastOnlineToday =
              lastOnline.getDate() === today.getDate() &&
              lastOnline.getMonth() === today.getMonth() &&
              lastOnline.getFullYear() === today.getFullYear();

            if(!isLastOnlineToday){
              triggerMaaResponse("daily_start")
            }
          }

          if(response.data.data.currentStreak > 5){
            triggerMaaResponse("streak");
          }
        } catch (error) {
          dispatch(errorGettingPerformance())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getPerformance()
    }
    if(leaderboardStatus == 'Loading' && !hasFetched.current.leaderboard){
      async function getLeaderBoard(){
        try {
          hasFetched.current.leaderboard = true;
          const response = await axios.get('http://localhost:5000/api/dashboard/leaderboard', {withCredentials: true});
          dispatch(addLeaderBoard(response.data.data));
        } catch (error) {
          dispatch(errorGettingLeaderBoard())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getLeaderBoard()
    }
  }, [dailyTasksStatus, dispatch, generalTaskStatus, triggerMaaResponse, leaderboardStatus, performanceStatus])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#06161a] via-[#082a2d] to-[#06161a] text-white">
      <div className="md:px-10 mx-auto">
        {/* Hero */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Hey, {user?.name ? user.name : user?.username} 👋</h1>
              <p className="mt-1 text-sm text-white/70">Welcome bache — I hope you are all set for today !!</p>
            </div>
          </div>
        </header>

        {/* ------------------
           TOP STATS 
           Small screens: first two side-by-side, third centered below
           ------------------ */}
        <section className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-1 flex items-center justify-center">
              {
                performanceStatus == 'Loading' ? 
                <div></div>
                :
                performanceStatus == 'Fetched' ? 
                <div className="flex flex-col items-center">
                 <div className="text-sm text-center text-white/60">Tasks Completed</div>
                 <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-300 drop-shadow-lg">{totalTasksCompletedPercentage(dailyTasks)} %</div>
                 <div className="text-xs text-white/60">Daily Tasks</div>
                </div>
                :
                <div className="flex justify-center items-center p-2">Error</div>
              }
            </div>

            <div className="col-span-1 flex items-center justify-center">
              {
                performanceStatus == 'Loading' ? 
                <div></div>
                :
                performanceStatus == 'Fetched' ? 
                <div className="flex flex-col items-center">
                  <div className="text-sm text-white/60">Overall Score</div>
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-emerald-300 drop-shadow-lg">{performance?.overallScore}</div>
                  <div className="text-xs text-white/60">Performance index</div>
                </div>
                :
                <div className="flex justify-center items-center p-2">Error</div>
              }
            </div>

            {/* third stat: spans both cols on mobile and centered */}
            <div className="col-span-2 md:col-span-1 flex justify-center">
              {
                performanceStatus == 'Loading' ? 
                <div></div>
                :
                performanceStatus == 'Fetched' ? 
                <div className="flex flex-col items-center">
                  <div className="text-sm text-white/60">Current Streak</div>
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-emerald-300 drop-shadow-lg">{performance?.currentStreak} 🔥</div>
                  <div className="text-xs text-white/60">Longest Streak: {performance?.longestStreak}</div>
                </div>
                :
                <div className="flex justify-center items-center p-2">Error</div>
              }
            </div>
          </div>
        </section>

        {/* ------------------
           MAIN 
           ------------------ */}
        <div className="flex gap-4 flex-col md:flex-row">
         <div className="md:flex-1 flex flex-col gap-4 items-center justify-center">
          {/* Tasks column */}
          <section className="flex flex-col w-full sm:flex-row gap-3 md:gap-6">
            {/* Daily tasks list */}
            <div className="rounded-2xl w-full sm:w-[50%] p-4 bg-gradient-to-br from-emerald-500/6 via-sky-500/5 to-teal-400/4 border border-white/6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Daily Tasks</h3>
                  <p className="text-sm text-white/60">Tasks due today</p>
                </div>
                <div className="text-sm text-white/60">{dailyTasks ? dailyTasks.length : 0} items</div>
              </div>

              <div className="scrollable-div max-h-[75vh] md:max-h-[50vh]">
                {
                dailyTasksStatus == 'Loading' ? 
                <div className="text-center w-full p-2 text-gray-500">Loading..</div>
                  :
                dailyTasksStatus == 'Fetched' ?
                dailyTasks
                  .map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                      <div className="flex items-start gap-3">
                        {/* importance color bar */}
                        <div className={`w-1 h-10 rounded ${t.importance === "high" ? "bg-red-400" : t.importance === "medium" ? "bg-yellow-400" : "bg-green-400"}`} />
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-white/60">{t.description}</div>
                          <div className="mt-1 text-xs text-white/50">Due: {shortDate(t.dueDate)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusChip status={t.status} />
                      </div>
                    </div>
                  ))
                :
                <div className="text-center w-full p-2 text-gray-500">
                  Error.. 
                </div>
                }
              </div>
            </div>

            {/* General tasks */}
            <div className="rounded-2xl w-full sm:w-[50%] p-4 bg-gradient-to-br from-emerald-500/6 via-sky-500/5 to-teal-400/4 border border-white/6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">General Tasks</h3>
                  <p className="text-sm text-white/60">Other due items</p>
                </div>
                <div className="text-sm text-white/60">{generalTasks.length} items</div>
              </div>

              <div className="scrollable-div max-h-[75vh] md:max-h-[50vh]">
                {
                generalTaskStatus == 'Loading' ? 
                <div className="text-center w-full p-2 text-gray-500">Loading..</div>
                  :
                generalTaskStatus == 'Fetched' ?
                generalTasks
                  .map((t, idx) => (
                    <div key={idx} className="flex mt-3 items-center justify-between p-3 rounded-lg bg-white/3">
                      <div className="flex items-start gap-3">
                        <div className={`w-1 h-10 rounded ${t.importance === "high" ? "bg-red-400" : t.importance === "medium" ? "bg-yellow-400" : "bg-green-400"}`} />
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-white/60">Due: {shortDate(t.dueDate)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusChip status={t.status} />
                      </div>
                    </div>
                  ))
                :
                <div className="text-center w-full p-2 text-gray-500">
                  Error.. 
                </div>
                }
              </div>
            </div>
          </section>

          {/* Charts */}
          <section className="rounded-2xl w-full p-4 bg-transparent flex flex-col gap-5">
            <div>
              <h4 className="text-md font-semibold">Weekly Productivity</h4>
              <p className="text-xs text-white/60">Tasks completed per day</p>
            </div>

            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tasks" stroke="#60A5FA" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h1 className="text-sm text-gray-400">Note: If you delete your completed tasks, then that would still contribute to above metrix..</h1>

            {/* Donut / status overview */}
            <div className="mt-4 flex flex-col items-center gap-3 border-2 border-[#71e4f8] rounded-2xl p-2">
              <h1 className="text-lg text-white/60">Status breakdown</h1>
              <div className="w-50 h-50">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={6}>
                      {statusPie.map((entry, idx) => (
                        <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full sm:w-[80%] md:w-[75%] bg-white/10 backdrop-blur-2xl p-3 rounded-2xl">
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between"><span className="text-[#34D399]">Completed</span><span className="font-semibold">{completed}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#F87171]">In Progress</span><span className="font-semibold">{total - completed}</span></div>
                </div>
              </div>
            </div>
          </section>
         </div>
          
         {/* Leaderboard */}
         <aside className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/6 via-sky-500/5 to-teal-400/4 border border-white/6 backdrop-blur-xl">
           <div className="flex items-center gap-2 justify-between">
             <h3 className="text-lg font-semibold">Leaderboard</h3>
             <div className="text-sm text-white/60">Top performers</div>
           </div> 
           {
            leaderboardStatus == 'Loading' ? 
            <div className="flex text-center p-2 justify-center items-start">
              Loading...
            </div>
            :
            leaderboardStatus == 'Fetched' ? 
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-400 text-wrap p-2">Note: The leaderboard updates twice a day.</p>
             {leaderboard && leaderboard.length > 0 ? leaderboard.map((l, idx) => (
               <Link href={`/user/profile/${l._id}`} key={l._id} className={`flex items-center gap-5 justify-between p-3 rounded-lg ${idx < 3 ? "bg-gradient-to-r from-yellow-400/10 to-green-400/8" : "bg-white/3"}`}>
                 <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image src={l.profilePicture ?? '/profile/default_profile_pic.jpg'} alt="Profile Pic" height={50} width={50}  className="object-cover"/>
                  </div>
                   
                   <div>
                     <div className="font-medium">{l.username}</div>
                     <div className="text-xs text-white/60">Score: {l.overallScore}</div>
                   </div>
                 </div>
               </Link>
             ))
             :
             <div className="text-gray-500 flex items-start justify-center text-center p-2">No users on leaderBoard..</div>
            }
           </div>
           :
           <div className="flex w-full justify-center text-center items-start p-2">
            There was some Error getting Leaderboard...
           </div>
           }
           
         </aside>
        </div>
        <footer className="mt-6 text-center text-sm text-white/60">Keep going — Maa is proud of you 💚</footer>
      </div>
      {message && <MaaPopup message={message}/>}
    </main>
  );
}
