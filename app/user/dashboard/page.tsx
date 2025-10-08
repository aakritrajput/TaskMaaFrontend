"use client";

import React from "react";
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

type StatsFromBackend = {
  userId: string;
  profileType: "public" | "private";
  dailyTasksCompleted: number;
  generalTasksCompleted: number;
  totalDailyTasks: number;
  totalGeneralTasks: number;
  streak: number;
  overallScore: number; // 0-100
  badges: string[];
};

type TaskItem = {
  user: string;
  title: string;
  description?: string;
  importance: "low" | "medium" | "high";
  status: "inProgress" | "completed";
  type: "daily" | "general";
  dueDate: string; // ISO date or human
};

type LeaderboardRaw = {
  userId: {
    _id: string;
    userName: string;
    profilePic?: string; // url
  };
  overallScore: number;
};

// ---------------------------
// Dummy data (will replace with Redux selectors or from backend !!)
// ---------------------------
const statsFromBackend: StatsFromBackend = {
  userId: "u_123",
  profileType: "public",
  dailyTasksCompleted: 3,
  generalTasksCompleted: 7,
  totalDailyTasks: 5,
  totalGeneralTasks: 10,
  streak: 12,
  overallScore: 78,
  badges: ["early-bird", "streak-7"],
};

const tasksFromBackend: TaskItem[] = [
  {
    user: "u_123",
    title: "Morning meditation",
    description: "10 mins breathing",
    importance: "low",
    status: "completed",
    type: "daily",
    dueDate: new Date().toISOString(),
  },
  {
    user: "u_123",
    title: "Implement login guard",
    description: "Protect admin routes",
    importance: "high",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
  {
    user: "u_123",
    title: "Write unit tests",
    description: "Auth and utils",
    importance: "medium",
    status: "inProgress",
    type: "general",
    dueDate: new Date(Date.now() + 3 * 86400_000).toISOString(),
  },
];

const leaderboardFromBackend: LeaderboardRaw[] = [
  {
    userId: { _id: "u_1", userName: "komal_dev", profilePic: "" },
    overallScore: 980,
  },
  {
    userId: { _id: "u_2", userName: "karan_codes", profilePic: "" },
    overallScore: 860,
  },
  {
    userId: { _id: "u_3", userName: "anjana_mom", profilePic: "" },
    overallScore: 650,
  },
];

// ---------------------------
// Helpers
// ---------------------------
const totalTasksCompleted = (s: StatsFromBackend) => Number(s.dailyTasksCompleted) + Number(s.generalTasksCompleted);
const totalTasks = (s: StatsFromBackend) => Number(s.totalDailyTasks) + Number(s.totalGeneralTasks);

const shortDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString();
};

// ---------------------------
// Chart data
// ---------------------------
const weeklyActivity = [
  { day: "Mon", tasks: 5 },
  { day: "Tue", tasks: 8 },
  { day: "Wed", tasks: 6 },
  { day: "Thu", tasks: 10 },
  { day: "Fri", tasks: 12 },
  { day: "Sat", tasks: 7 },
  { day: "Sun", tasks: 4 },
];


const completed = totalTasksCompleted(statsFromBackend);
console.log("comleted: ", completed)
const total = totalTasks(statsFromBackend);
console.log('total: ', total)
const statusPie = [  // in future we can enhance this by seperating the status pie's of both daily and general tasks !! -- but for now we will account both of them together..
  { name: "Completed", value: completed },
  { name: "InProgress", value: total - completed }
];

console.log("Status Pie: ", statusPie)

const COLORS = ["#34D399", "#F87171"];


// ---------------------------
// Small presentational components
// ---------------------------
function ImportanceBadge({ importance }: { importance: TaskItem["importance"] }) {
  const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  if (importance === "high") return <span className={`${base} bg-red-600/30 text-red-200`}>High</span>;
  if (importance === "medium") return <span className={`${base} bg-yellow-600/25 text-yellow-200`}>Medium</span>;
  return <span className={`${base} bg-green-700/25 text-green-200`}>Low</span>;
}

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
  // Will Replace with real selectors:
  // const stats = useSelector((s: RootState) => s.stats);
  // const tasks = useSelector((s: RootState) => s.tasks.todayAndGeneral);
  // const leaderboard = useSelector((s: RootState) => s.leaderboard.topUsers);

  const stats = statsFromBackend;
  const tasks = tasksFromBackend;
  const leaderboard = leaderboardFromBackend;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#06161a] via-[#082a2d] to-[#06161a] text-white">
      <div className="md:px-10 mx-auto">
        {/* Hero */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Good Morning, Aakrit 👋</h1>
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
             <div className="flex flex-col items-center">
              <div className="text-sm text-center text-white/60">Tasks Completed</div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-300 drop-shadow-lg">{totalTasksCompleted(stats)}</div>
              <div className="text-xs text-white/60">Daily {stats.dailyTasksCompleted} • General {stats.generalTasksCompleted}</div>
             </div>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="text-sm text-white/60">Overall Score</div>
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-emerald-300 drop-shadow-lg">{stats.overallScore}%</div>
                <div className="text-xs text-white/60">Performance index</div>
              </div>
            </div>

            {/* third stat: spans both cols on mobile and centered */}
            <div className="col-span-2 md:col-span-1 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="text-sm text-white/60">Current Streak</div>
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-emerald-300 drop-shadow-lg">{stats.streak} 🔥</div>
                <div className="text-xs text-white/60">Keep it going — small wins!</div>
              </div>
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
                <div className="text-sm text-white/60">{tasks.filter((t) => t.type === "daily").length} items</div>
              </div>

              <div className="scrollable-div max-h-[75vh] md:max-h-[50vh]">
                {tasks
                  .filter((t) => t.type === "daily")
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
                  ))}
              </div>
            </div>

            {/* General tasks */}
            <div className="rounded-2xl w-full sm:w-[50%] p-4 bg-gradient-to-br from-emerald-500/6 via-sky-500/5 to-teal-400/4 border border-white/6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">General Tasks</h3>
                  <p className="text-sm text-white/60">Other due items</p>
                </div>
                <div className="text-sm text-white/60">{tasks.filter((t) => t.type === "general").length} items</div>
              </div>

              <div className="scrollable-div max-h-[75vh] md:max-h-[50vh]">
                {tasks
                  .filter((t) => t.type === "general")
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
                        <ImportanceBadge importance={t.importance} />
                      </div>
                    </div>
                  ))}
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
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold">Leaderboard</h3>
             <div className="text-sm text-white/60">Top performers</div>
           </div> 
           <div className="mt-4 space-y-3">
             {leaderboard.map((l, idx) => (
               <div key={l.userId._id} className={`flex items-center gap-5 justify-between p-3 rounded-lg ${idx < 3 ? "bg-gradient-to-r from-yellow-400/10 to-green-400/8" : "bg-white/3"}`}>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-green-400 flex items-center justify-center text-sm font-semibold">{l.userId.userName.split("_")[0][0].toUpperCase()}</div>
                   <div>
                     <div className="font-medium">{l.userId.userName}</div>
                     <div className="text-xs text-white/60">Score: {l.overallScore}</div>
                   </div>
                 </div>
                 <div className="text-sm font-semibold">{l.overallScore}</div>
               </div>
             ))}
           </div>
         </aside>
        </div>
        <footer className="mt-6 text-center text-sm text-white/60">Keep going — Maa is proud of you 💚</footer>
      </div>
    </main>
  );
}
