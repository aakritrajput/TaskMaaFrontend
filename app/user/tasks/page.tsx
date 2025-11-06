"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, CheckCircle2, CheckCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import confetti from "canvas-confetti";
// import axios from "axios";
import { addDailyTasks, addGeneralTasks, addTask, deleteTask, editTask, errorGettingDailyTasks, errorGettingGeneralTasks, updateIdOfNewlyAddedTask } from "@/src/lib/features/tasks/TaskSlice";
import Modal from "@/src/components/user/TaskCreateOrEditModal";
import axios from "axios";
import { addPerformance, errorGettingPerformance, updateStreak, updateWeeklyProgress } from "@/src/lib/features/stats/statSlice";
import { useMaaHandler } from "@/src/components/taskMaa/useMaaHandler";
import MaaPopup from "@/src/components/taskMaa/MaaPopup";
// import { editPerformance } from "@/src/lib/features/stats/statSlice";

export type taskType = {
    _id: string;
    user: string; // will be user id
    title: string;
    description?: string;
    importance: "low" | "medium" | "high";
    status: "inProgress"| "completed";
    type: "daily" | "general" ;
    dueDate: string;
    completedOn: string;
}

export default function TasksPage() {
  const [activeTodayFilter, setActiveTodayFilter] = useState("All");
  const [activeGeneralFilter, setActiveGeneralFilter] = useState("All");
  const [totalCompletedTasks, setTotalCompletedTasks] = useState<number>(0)

  const dispatch = useDispatch();

  const TaskState = useSelector((state: RootState) => state.tasks)

  const dailyTasksStatus = TaskState.dailyTasksStatus ;
  const generalTaskStatus = TaskState.generalTasksStatus ;
  const todayTasks = TaskState.dailyTasks ;
  const generalTasks = TaskState.generalTasks ;
  const stats = useSelector((state: RootState) => state.stats);
  const performance = stats.performance;
  const performanceStatus = stats.performanceStatus;

  // stuff for creating and editing the task

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInitial, setModalInitial] = useState<Partial<taskType>>({});

  function openCreate(type: taskType['type']) {
    const initial: Partial<taskType> = { type, status: "inProgress", importance: "low" };
    if (type === "daily") initial.dueDate = new Date().toISOString();
    setModalInitial(initial);
    setIsModalOpen(true);
  }

  // Maa responses

  const {triggerMaaResponse, message} = useMaaHandler();

  function openEdit(task: taskType) {
    setModalInitial(task);
    setIsModalOpen(true);
  }
  
  
  function closeModal() {
    setIsModalOpen(false);
    setModalInitial({});
  }

  async function handleModalSubmit(task: Partial<taskType>) {
    closeModal(); // will imediatelly close the modal 
    if (task._id) {
      dispatch(editTask(task as taskType)) // we will imediatelly updates the UI
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/editTask/${task._id}`, task, {withCredentials: true}) // and BTS it will updates the task in backend and if any error 
      } catch (error) {
        if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
        }else {
          alert("There was some Error editing your task !! - Need to refresh the whole page.. ")
        }
        window.location.reload()
      } 
    } else {
      try {
        // this is for creating a new task as that will not be having any id !!
        const tempId = new Date().toISOString()
        
        // NOTE: we will keep newly created tasks at the end as i should see that task on top which was firstly created !!
  
        dispatch(addTask({...task, _id: tempId} as taskType))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/createTask`, task, {withCredentials: true})
        dispatch(updateIdOfNewlyAddedTask({oldId: tempId, newId: response.data.data._id, type: task.type as taskType['type']}))
      } catch (error) {
        if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
        }else {
          alert("There was some Error creating your task !! - Need to refresh the whole page.. ")
        }
        window.location.reload()
      }

    }
  }
  

  
  const hasFetched = useRef({
    daily: false, 
    general: false,
    performance: false,
  });

  //------  api call and data hydration ------

  useEffect(()=>{

    if(dailyTasksStatus == 'Loading' && !hasFetched.current.daily){
      async function getTodaysTasks(){
        try {
          hasFetched.current.daily = true;
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/todaysTask`, {withCredentials: true});
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
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/generalTasks`, {withCredentials: true});
          dispatch(addGeneralTasks(response.data.data));
        } catch (error) {
          dispatch(errorGettingGeneralTasks())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getGeneralTasks();
    }

     if(performanceStatus == 'Loading' && !hasFetched.current.performance){ // as in tasks page we are marking complete uncomplete therefore need to start redux state there too !!
      async function getPerformance(){
        try {
          hasFetched.current.performance = true;
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/getPerformanceStats`, {withCredentials: true});
          dispatch(addPerformance(response.data.data));
        } catch (error) {
          dispatch(errorGettingPerformance())
          console.log('Error getting todays tasks: ', error);
        }
      }
      getPerformance()
    }

    const getTodaysCompletedTasks = (tasks: taskType[]) => {
      const count = tasks.filter(task => task.completedOn ? (task.completedOn).slice(0,10) === new Date().toISOString().slice(0, 10) : false).length ; // it will be true for tasks which are completed today itself
      setTotalCompletedTasks(count);
    }

    getTodaysCompletedTasks([...todayTasks, ...generalTasks])

  }, [generalTaskStatus, dispatch, dailyTasksStatus, todayTasks, generalTasks, performanceStatus]); // here we have added today and general tasks here which is fine a our api calls will only run on loading condition

  // ------------ helper functions ----------------

  const filterTasks = (tasks: taskType[], filter: string) => {
    if (filter === "All") {
      const completedTasks = tasks.filter(task => task.status == 'completed');
      const inCompletedTasks = tasks.filter(task => task.status !== 'completed');
      return [...inCompletedTasks, ...completedTasks]; // this is done so that our imcompleted Tasks should be on top and incompleted ones at the bottom !!
    };
    return filter === "Completed"
      ? tasks.filter((t) => t.status === "completed")
      : tasks.filter((t) => t.status !== "completed");
  };

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.volume = 0.6; // not too loud
    audio.play();
  };

  const showConfetti = () => {
    const end = Date.now() + 300; // 300ms burst time
    const colors = ["#00FFB2", "#00C9FF", "#00FFC6", "#A7FFEB", "#db2777", "#ca8a04"];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) { // this is telling browser to rerun the animation untill the condition is satisfied
        requestAnimationFrame(frame);
      }
    })();
  };

  const taskStatusToggleHandler = async(task: taskType) => {
    const defaultTask = {...task} ;
    try {
      if(task.status == 'completed'){
        task.completedOn = new Date().toISOString()
      }
      else {
        task.completedOn = '';
      }
      dispatch(editTask(task))  // in future we will not wait for backend confirmation but will immediately update the redux store and if in future got an error then we will show the alert as done here !!
      if(task.status == 'completed'){
        if(task.type == 'daily') playSound('/sounds/dailyTaskCompleteAudio.wav') ;
        else if(task.type == 'general') playSound('/sounds/generalTaskCompleteAudio.wav');
        showConfetti();

        triggerMaaResponse("task_completed");
      }else {
        playSound('/sounds/incompleteTaskSound.wav');
        triggerMaaResponse('missed_tasks');
      }

      if(performance && totalCompletedTasks == 0) { // if a task pass this check that means the user does not have till now any completed task for today which means here we can call backend to update streak
        dispatch(updateStreak('continue'));
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/updateStreak/add`, {withCredentials: true})
      }
      else if(task.status == 'inProgress' && totalCompletedTasks == 1){ // this will mean user is marking a completed task as uncompleted
        if(!task.completedOn && (defaultTask.completedOn).slice(0,10) === new Date().toISOString().slice(0, 10)){
          dispatch(updateStreak('remove'));
          await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/updateStreak/remove`, {withCredentials: true}) // if in this case we call this again then on backend the streak will reset to what it was previously !!
        }
      }

      const weeklyData = [...(performance?.weeklyProgress || [0,0,0,0,0,0,0])];
      if(task.status == 'completed'){
        dispatch(updateWeeklyProgress('completed'))
        weeklyData[weeklyData.length - 1] = weeklyData[weeklyData.length - 1] + 1;
      }else if(task.status == 'inProgress' && defaultTask.completedOn.slice(0,10) == new Date().toISOString().slice(0,10)){
        dispatch(updateWeeklyProgress('uncompleted'))
        weeklyData[weeklyData.length - 1] = weeklyData[weeklyData.length - 1] - 1;
      }
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/editTask/${task._id}`, {...task, weeklyProgress: weeklyData} , {withCredentials: true})
      
    } catch (error) {
      if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
      }else {
        alert("There was some Error toggling your task status !! - Need to refresh the whole page.. ")
      }
      window.location.reload()
    }
  }

  const deleteTaskHandler = async(task: {_id: string, type: 'daily' | 'general', status: 'completed' | 'inProgress', completedOn: string | undefined}) => {
    try {
      dispatch(deleteTask(task))
      if(totalCompletedTasks == 1 && task.status == 'completed'){
        if(task.completedOn && (task.completedOn).slice(0,10) === new Date().toISOString().slice(0, 10)){
          await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/updateStreak/remove`, {withCredentials: true}) // if in this case we call this again then on backend the streak will reset to what it was previously !!
        }
      }
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/deleteTask/${task._id}`, {withCredentials: true})
    } catch (error) {
      if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
        alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
      }else {
        alert("There was some Error deleting your task !! - Need to refresh the whole page.. ")
      }
      window.location.reload()
    }
  }

  // --------- main page -----------------

  function ImportanceBadge({ importance }: { importance: taskType["importance"] }) {
    const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    if (importance === "high") return <span className={`${base} bg-red-600/30 text-red-200`}>High</span>;
    if (importance === "medium") return <span className={`${base} bg-yellow-600/25 text-yellow-200`}>Medium</span>;
    return <span className={`${base} bg-green-700/25 text-green-200`}>Low</span>;
  }

  return (
    <div className="min-h-screen w-full bg-transparent text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-300">
          Your Tasks
        </h1>
  
        <div className="grid w-full md:grid-cols-2 gap-10"> {/* Here we can make a seperate component as most of the thing will be same for both daily and general but I thought why to pass extra args like today's task and different classes and that just for 2 components - hence here we have both the component code here itself */}
          {/* ---------------- TODAY TASKS ---------------- */}
          <div
            className="backdrop-blur-lg relative bg-white/10 border w-[100%] min-h-[250px] border-white/20 rounded-2xl p-6 shadow-2xl"
          > 
            <div
              className={`absolute -top-10 -left-10 w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-pink-400 to-rose-500`}
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-200">
                Today’s Tasks
              </h2>
              <button onClick={() => openCreate("daily")} disabled={dailyTasksStatus === 'Loading'}  className={` ${dailyTasksStatus == 'Loading' ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-pink-600 px-4 py-2 rounded-xl hover:opacity-90 transition`}>
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

              dailyTasksStatus == 'Error' ? 
              <div className=" bg-transparent flex justify-center text-center min-h-[40px] items-center">There was some Error in loading your daily tasks...</div> 
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
                    task.status === 'completed' && <div className="absolute w-[96%] left-2 h-[3px] bg-green-300 rounded-2xl z-10"></div>
                  }
                  <div className="flex gap-2 items-center">
                    <button onClick={() => taskStatusToggleHandler({...task, status: task.status == 'inProgress' ? 'completed' : 'inProgress'})} className="hover:text-teal-400 cursor-pointer">
                      {task.status === "completed" ? (
                        <CheckCircle size={20} className="text-emerald-500" />
                      ) : (
                        <CheckCircle2 size={20} className="text-gray-400" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <ImportanceBadge importance={task.importance} />
                      <p className="text-sm text-[#a8a4a4]">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {
                      task.status !== 'completed' && 
                      <button onClick={() => openEdit(task)} className="hover:text-emerald-400 cursor-pointer">
                        <Pencil size={18} />
                      </button>
                    }
                    <button onClick={() => deleteTaskHandler({_id: task._id, type: task.type, status: task.status, completedOn: task.completedOn})} className="hover:text-rose-400 cursor-pointer">
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
              <button onClick={() => openCreate("general")} disabled={generalTaskStatus === 'Loading'} className={` ${ generalTaskStatus == 'Loading' ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2 bg-gradient-to-r from-teal-600 to-yellow-600 px-4 py-2 rounded-xl hover:opacity-90 transition`}>
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
              generalTaskStatus == 'Error' ? 
              <div className=" bg-transparent flex justify-center text-center min-h-[40px] items-center">There was some Error in loading your General tasks...</div> 
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
                    task.status === 'completed' && <div className="absolute w-[96%] left-2 h-[3px] bg-green-300 rounded-2xl z-10"></div>
                  }
                  <div className="flex gap-2 items-center">
                    <button onClick={() => taskStatusToggleHandler({...task, status: task.status == 'inProgress' ? 'completed' : 'inProgress'})} className="hover:text-teal-400 cursor-pointer">
                      {task.status === "completed" ? (
                        <CheckCircle size={20} className="text-emerald-500" />
                      ) : (
                        <CheckCircle2 size={20} className="text-gray-400" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <ImportanceBadge importance={task.importance} />
                      <p className="text-xs text-white/50">
                        Due: {task.dueDate.slice(0, 10)}
                      </p>
                      <p className="text-sm text-[#a8a4a4]">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {
                      task.status !== 'completed' && 
                      <button onClick={() => openEdit(task)} className="hover:text-emerald-400 cursor-pointer">
                        <Pencil size={18} />
                      </button>
                    }
                    <button onClick={() => deleteTaskHandler({_id: task._id, type: task.type, status: task.status, completedOn: task.completedOn})} className="hover:text-rose-400 cursor-pointer">
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

        <button onClick={() => alert('Coming Soon...')} className="text-center text-emerald-400 mt-10 underline underline-offset-4 hover:text-emerald-300 cursor-pointer w-full transition">
          See all your tasks
        </button>
      </div>
      {message && <MaaPopup message={message}/>}
      <Modal open={isModalOpen} onClose={closeModal} initial={modalInitial} onSubmit={handleModalSubmit}/>
    </div>
  );
}
