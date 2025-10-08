"use client";

import { useState } from "react";
import { Pencil, Trash2, CheckCircle2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

type taskType = {
    _id: string;
    user: string; // will be user id
    title: string;
    description?: string;
    importance: "low" | "medium" | "high";
    status: "inProgress"| "completed";
    type: "daily" | "general" ;
    dueDate: Date;
}

export default function TasksPage() {
  const [activeTodayFilter, setActiveTodayFilter] = useState("All");
  const [activeGeneralFilter, setActiveGeneralFilter] = useState("All");

  // Dummy data (for layout only)
  const todayTasks: taskType[] = [
    { _id: "1", user: '123', title: "Finish TaskMaa UI", status: "inProgress", importance: "high" , type: 'daily', dueDate: new Date()},
    { _id: "2", user: '123', title: "Revise ML course", status: "completed", importance: "medium" , type: 'daily', dueDate: new Date()},
  ];

  const generalTasks:taskType[] = [
    { _id:"3", user: "123", title: "Prepare portfolio update", dueDate: new Date(), status: "inProgress", importance: "medium" , type: 'general'},
    { _id:"4", user: "123", title: "Complete BlogApp bug fix", dueDate:new Date(), status: "completed", importance: "medium" , type: 'general',},
  ];

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
              className={`absolute -top-10 -left-10 w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-pink-500 to-rose-500`}
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-200">
                Today’s Tasks
              </h2>
              <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-xl hover:opacity-90 transition">
                <PlusCircle size={18} />
                Add Today Task
              </button>
            </div>

            <div className="flex gap-4 mb-5 border-b border-white/20 pb-2 text-sm">
              {["All", "Completed", "UnCompleted"].map((f) => (
                <button
                  key={f}
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
              {filterTasks(todayTasks, activeTodayFilter).map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 shadow-lg
                    ${task.status === "completed"
                      ? "opacity-60 border-emerald-300/30"
                      : "border-emerald-500/30"
                    }`}
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-white/50 capitalize">
                      {task.importance} priority
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-emerald-400">
                      <Pencil size={18} />
                    </button>
                    <button className="hover:text-rose-400">
                      <Trash2 size={18} />
                    </button>
                    <button className="hover:text-teal-400">
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
              <p className="text-center text-white/40 italic mt-6">
                No more tasks for today...
              </p>
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
              <button className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 rounded-xl hover:opacity-90 transition">
                <PlusCircle size={18} />
                Add General Task
              </button>
            </div>

            <div className="flex gap-4 mb-5 border-b border-white/20 pb-2 text-sm">
              {["All", "Completed", "UnCompleted"].map((f) => (
                <button
                  key={f}
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
              {filterTasks(generalTasks, activeGeneralFilter).map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 shadow-lg
                    ${task.status === "completed"
                      ? "opacity-60 border-teal-300/30"
                      : "border-teal-500/30"}
                  `}
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-white/50">
                      Due: {task.dueDate.toISOString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-emerald-400">
                      <Pencil size={18} />
                    </button>
                    <button className="hover:text-rose-400">
                      <Trash2 size={18} />
                    </button>
                    <button className="hover:text-teal-400">
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
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
