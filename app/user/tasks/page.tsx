"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle2, CheckCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
// import axios from "axios";
import { addDailyTasks, addGeneralTasks, errorGettingDailyTasks } from "@/src/lib/features/tasks/TaskSlice";

type taskType = {
    _id: string;
    user: string; // will be user id
    title: string;
    description?: string;
    importance: "low" | "medium" | "high";
    status: "inProgress"| "completed";
    type: "daily" | "general" ;
    dueDate: string;
}

export default function TasksPage() {
  const [activeTodayFilter, setActiveTodayFilter] = useState("All");
  const [activeGeneralFilter, setActiveGeneralFilter] = useState("All");

  const dispatch = useDispatch();

  const TaskState = useSelector((state: RootState) => state.tasks)

  const dailyTasksStatus = TaskState.dailyTasksStatus ;
  const generalTaskStatus = TaskState.generalTasksStatus ;
  const todayTasks = TaskState.dailyTasks ;
  const generalTasks = TaskState.generalTasks ;

  useEffect(()=>{

    // Dummy data (for layout only)
    const todayTasksDummy: taskType[] = [
      { _id: "1", user: '123', title: "Finish TaskMaa UI", status: "inProgress", importance: "high" , type: 'daily', dueDate: (new Date()).toISOString()},
      { _id: "2", user: '123', title: "Revise ML course", status: "completed", importance: "medium" , type: 'daily', dueDate: (new Date()).toISOString()},
    ];
  
    const generalTasksDummy:taskType[] = [
      { _id:"3", user: "123", title: "Prepare portfolio update", dueDate: '10-10-2025', status: "inProgress", importance: "medium" , type: 'general'},
      { _id:"4", user: "123", title: "Complete BlogApp bug fix", dueDate: '10-10-2025', status: "completed", importance: "medium" , type: 'general',},
    ];

    if(dailyTasksStatus == 'Loading'){
      async function getTodaysTasks(){
        try {
          // const response = await axios.get('http://localhost:8000/api/getDailyTasks', {withCredentials: true});
          const response = {data: todayTasksDummy} // faking for now 
          dispatch(addDailyTasks(response.data));
        } catch (error) {
          dispatch(errorGettingDailyTasks())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getTodaysTasks();
    }
    if(generalTaskStatus == 'Loading'){
      async function getGeneralTasks(){
        try {
          // const response = await axios.get('http://localhost:8000/api/getGeneralTasks', {withCredentials: true});
          const response = {data: generalTasksDummy} // faking for now !!
          dispatch(addGeneralTasks(response.data));
        } catch (error) {
          dispatch(errorGettingDailyTasks())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getGeneralTasks();
    }

  }, [generalTaskStatus, dispatch, dailyTasksStatus]);

  const filterTasks = (tasks: taskType[], filter: string) => {
    if (filter === "All") return tasks;
    return filter === "Completed"
      ? tasks.filter((t) => t.status === "completed")
      : tasks.filter((t) => t.status !== "completed");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#061b1c] via-[#0b2d2f] to-[#0e4446] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-300">
          Your Tasks
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* ---------------- TODAY TASKS ---------------- */}
          <div
            className="backdrop-blur-lg relative bg-white/10 border min-h-[250px] border-white/20 rounded-2xl p-6 shadow-2xl"
          > 
            <div
              className={`absolute -top-10 -left-10 w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-pink-400 to-rose-500`}
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-200">
                Today’s Tasks
              </h2>
              <button disabled={dailyTasksStatus === 'Loading'}  className={` ${dailyTasksStatus == 'Loading' ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-xl hover:opacity-90 transition`}>
                <PlusCircle size={18} />
                Add Today Task
              </button>
            </div>

            <div className="flex gap-4 mb-5 border-b border-white/20 pb-2 text-sm">
              {["All", "Completed", "UnCompleted"].map((f) => (
                <button
                  key={f}
                  disabled={dailyTasksStatus === 'Loading'}
                  onClick={() => setActiveTodayFilter(f)}
                  className={`
                    transition-colors
                    ${activeTodayFilter === f
                      ? "text-emerald-400"
                      : "text-white/60 hover:text-white"}
                  `}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {
                dailyTasksStatus == 'Loading' ? 

              <div className="relative overflow-hidden rounded-xl h-40 w-full bg-white/5 border border-white/10 shadow-lg">
                {/* Shimmer overlay */}
                <div className="absolute w-full h-[100px] -rotate-45 bg-gradient-to-br from-pink-400 via-white/30 to-white/10 animate-shimmer"></div>
              </div>
              :
              <>
              {filterTasks(todayTasks, activeTodayFilter).map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex relative items-center justify-between px-4 py-3 rounded-xl bg-white/5 shadow-lg
                    ${task.status === "completed"
                      ? "opacity-60 border-emerald-300 border-2"
                      : "border border-white/10"
                    }`}
                >
                  {
                    task.status === 'completed' && <div className="absolute w-[96%] left-2 h-[4px] bg-green-300 rounded-2xl z-10"></div>
                  }
                  <div className="flex gap-2 items-center">
                    <button className="hover:text-teal-400 cursor-pointer">
                      {task.status === "completed" ? (
                        <CheckCircle size={20} className="text-emerald-500" />
                      ) : (
                        <CheckCircle2 size={20} className="text-gray-400" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className={`text-xs ${task.importance == 'low' ? 'text-green-500' : task.importance == 'medium' ? 'text-yellow-500' : 'text-red-500'} capitalize`}>
                        {task.importance} priority
                      </p>
                      <p className="text-sm text-[white]">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {
                      task.status !== 'completed' && 
                      <button className="hover:text-emerald-400">
                        <Pencil size={18} />
                      </button>
                    }
                    <button className="hover:text-rose-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
              <p className="text-center text-white/40 italic mt-6">
                No more tasks for today...
              </p>
              </>
              }
            </div>
          </div>

          {/* ---------------- GENERAL TASKS ---------------- */}
          <div
            className="backdrop-blur-lg relative bg-white/10 border min-h-[250px] border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <div
              className={`absolute -top-10 -left-10 w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-yellow-400 to-orange-500`}
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-teal-200">
                General Tasks
              </h2>
              <button disabled={generalTaskStatus === 'Loading'} className={` ${ generalTaskStatus == 'Loading' ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 rounded-xl hover:opacity-90 transition`}>
                <PlusCircle size={18} />
                Add General Task
              </button>
            </div>

            <div className="flex gap-4 mb-5 border-b border-white/20 pb-2 text-sm">
              {["All", "Completed", "UnCompleted"].map((f) => (
                <button
                  key={f}
                  disabled={generalTaskStatus === 'Loading'} 
                  onClick={() => setActiveGeneralFilter(f)}
                  className={`
                    transition-colors
                    ${activeGeneralFilter === f
                      ? "text-teal-400"
                      : "text-white/60 hover:text-white"}
                  `}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {
                generalTaskStatus == 'Loading' ? 

              <div className="relative overflow-hidden rounded-xl h-40 w-full bg-white/5 border border-white/10 shadow-lg">
                {/* Shimmer overlay */}
                <div className="absolute w-full h-[100px] rotate-45 bg-gradient-to-br from-yellow-400 via-white/30 to-white/10 rounded-2xl animate-shimmer"></div>
              </div>
              :
              <>
              {filterTasks(generalTasks, activeGeneralFilter).map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex relative items-center justify-between px-4 py-3 rounded-xl bg-white/5 shadow-lg
                    ${task.status === "completed"
                      ? "opacity-60 border-emerald-300 border-2"
                      : "border border-white/10"
                    }
                  `}
                > 
                  {
                    task.status === 'completed' && <div className="absolute w-[96%] left-2 h-[4px] bg-green-300 rounded-2xl z-10"></div>
                  }
                  <div className="flex gap-2 items-center">
                    <button className="hover:text-teal-400 cursor-pointer">
                      {task.status === "completed" ? (
                        <CheckCircle size={20} className="text-emerald-500" />
                      ) : (
                        <CheckCircle2 size={20} className="text-gray-400" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-white/50">
                        Due: {task.dueDate}
                      </p>
                      <p className="text-sm text-[white]">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {
                      task.status !== 'completed' && 
                      <button className="hover:text-emerald-400">
                        <Pencil size={18} />
                      </button>
                    }
                    <button className="hover:text-rose-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
              <p className="text-center text-white/40 italic mt-6">
                No more general tasks...
              </p>
              </>
              }
            </div>
          </div>
        </div>

        <p className="text-center text-emerald-400 mt-10 underline underline-offset-4 hover:text-emerald-300 cursor-pointer transition">
          See all your tasks
        </p>
      </div>
    </div>
  );
}
