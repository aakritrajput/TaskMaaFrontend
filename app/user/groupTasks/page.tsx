'use client'

import TwoStepGroupTaskOverlay, { GroupTaskFormData, Member } from '@/src/components/user/GroupTaskModal';
import { addFriends, addGroupTasks, addNewGroupTask, addPublicTasks, errorOnFriends, errorOnGrouptasks, errorOnPublictasks, updateIdOfNewlyAddedGroupTask } from '@/src/lib/features/tasks/groupTaskSlice';
import { RootState } from '@/src/lib/store';
import axios from 'axios';
import { Lock, LockOpen } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export type groupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'private' | 'public';
    members: Member['_id'][];
    creatorId: string;
    dueDate: string;
    importance: 'low' | 'medium' | 'high';
    status: 'ongoing' | 'completed';
    winners: string[];
    createdAt?: string;
    updatedAt?: string;
}

export default function GroupTasksPage() {
    const user = useSelector((state: RootState)=> state.auth.user)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const dispatch = useDispatch();

    const dataFromStore = useSelector((state: RootState) => state.groupTask)

    const groupTasks = dataFromStore.groupTasks

    const publicGroupTasks = dataFromStore.publicTasks
    console.log('public group tasks: ', publicGroupTasks)

    const hasFetched = useRef({
      friends: false,
      groupTasks: false,
      publicTasks: false,
    })

    useEffect(() => {
      if(dataFromStore.friendsStatus == 'Loading' && !hasFetched.current.friends){
        hasFetched.current.friends = true;
        async function getFriends(){
        try {
          const response = await axios.get('http://localhost:5000/api/user/getFriends', {withCredentials: true})
          dispatch(addFriends(response.data.data))
        } catch (error) {
          console.log('error: ', error)
          dispatch(errorOnFriends())
        }
      }
      getFriends();
      }
      if(dataFromStore.groupTaskStatus == 'Loading' && !hasFetched.current.groupTasks){
        hasFetched.current.groupTasks = true;
        async function getGroupTasks(){
        try {
          const response = await axios.get('http://localhost:5000/api/groupTask/myGroupTasks', {withCredentials: true})
          dispatch(addGroupTasks(response.data.data))
        } catch (error) {
          console.log('error: ', error)
          dispatch(errorOnGrouptasks())
        }
      }
      getGroupTasks();
      }
      if(dataFromStore.publicTaskStatus == 'Loading' && !hasFetched.current.publicTasks){
        hasFetched.current.publicTasks = true;
        async function getPublicTasks(){
        try {
          const response = await axios.get('http://localhost:5000/api/groupTask/publicGroupTasks', {withCredentials: true})
          dispatch(addPublicTasks(response.data.data))
        } catch (error) {
          console.log('error: ', error)
          dispatch(errorOnPublictasks())
        }
      }
      getPublicTasks();
      }
    }, [dataFromStore.friendsStatus, dispatch, dataFromStore.groupTaskStatus, dataFromStore.publicTaskStatus])

    const participateHandler = () => {}

    const onSubmit = async(data: GroupTaskFormData & { members: Member['_id'][] }) => {
      try {
        const tempId = new Date().toISOString();
        const updateData: groupTaskType = {_id: tempId, ...data, creatorId: user ? user._id : '', status: 'ongoing', winners: []};
        dispatch(addNewGroupTask(updateData))
        // now if we see we are also sending _id to backend but that's ok as in backend the data is filtering out and in db we are only storing rest of the fields and id is newly generated automatically !!
        const response = await axios.post('http://localhost:5000/api/groupTask/createGroupTask', data, {withCredentials: true})
        dispatch(updateIdOfNewlyAddedGroupTask({ oldId: tempId ,newData: response.data.data})) // it will update the old id with the new one !!
      } catch (error) {
        if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
        }else {
          alert("There was some Error creating your group Task !! - Need to refresh the whole page.. ")
        }
        window.location.reload()
      }
    };

    function ImportanceBadge({ importance }: { importance: groupTaskType["importance"] }) {
        const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
        if (importance === "high") return <span className={`${base} bg-red-600/30 text-red-200`}>High</span>;
        if (importance === "medium") return <span className={`${base} bg-yellow-600/25 text-yellow-200`}>Medium</span>;
        return <span className={`${base} bg-green-700/25 text-green-200`}>Low</span>;
    }
    
    return (
      <div className="min-h-screen bg-transparent text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center p-2 border-b-2 border-b-gray-600 rounded-2xl justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">
              Your Group Tasks
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              className="px-2 sm:px-4 py-2 rounded-2xl cursor-pointer bg-gradient-to-r from-indigo-500 to-teal-400 shadow-lg transform hover:scale-105 transition"
            >
              + Create
            </button>
          </div>

          {/* Group Tasks Section */}
          {dataFromStore.groupTaskStatus === 'Loading' ? (
            // Skeleton Loader for Group Tasks
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-[#00ffff27] backdrop-blur-3xl border border-white/10 animate-pulse"
                >
                  <div className="h-6 w-3/4 bg-white/20 rounded mb-3 shimmer"></div>
                  <div className="h-4 w-full bg-white/10 rounded mb-2 shimmer"></div>
                  <div className="h-4 w-5/6 bg-white/10 rounded mb-4 shimmer"></div>
                  <div className="h-4 w-1/2 bg-white/10 rounded shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupTasks.map((task) => (
                  <Link
                    href={`/user/groupTasks/${task._id}`}
                    key={task._id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-[#00ffff27] backdrop-blur-3xl hover:scale-[1.01] transition border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                        <p className="text-sm text-white/60 mb-3">{task.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <span
                          className={`font-semibold ${
                            task.status === "completed"
                              ? "text-green-400"
                              : "text-yellow-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-sm text-white/60">
                          Importance:{" "}
                          <ImportanceBadge importance={task.importance} />
                        </p>
                        <p className="text-sm text-white/60">
                          Role:{" "}
                          <span className="text-white">
                            {task.creatorId === user?._id ? (
                              <span className="text-[#48de9b]">Admin</span>
                            ) : (
                              <span className="text-[#a88aea]">Participant</span>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                          
                    <div className="flex justify-end gap-2 items-center mt-4">
                      <p className="text-[cyan]">
                        {task.type == "public" ? <LockOpen /> : <Lock />}
                      </p>
                      <button className="px-3 py-1 text-sm rounded bg-gradient-to-r from-indigo-500 to-teal-400 hover:opacity-90 transition">
                        View
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
              {groupTasks.length == 0 && (
                <p className="w-full text-center text-gray-500">
                  You don&apos;t have any group tasks !!
                </p>
              )}
            </>
          )}
        </div>
        
        {/* Public Tasks */}
        <div className="px-2 sm:px-3 border-t-2 border-t-gray-600 md:px-5 lg:px-8 mt-7 py-5">
          <h1 className="text-3xl font-bold bg-clip-text bg-gradient-to-br text-transparent from bg-pink-400 to-blue-400">
            Public Group Tasks
          </h1>
        
          {dataFromStore.publicTaskStatus === 'Loading' ? (
            // 🔹 Skeleton Loader for Public Tasks
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gradient-to-br from-pink-400/30 to-[#00ffff27] backdrop-blur-3xl border border-white/10 animate-pulse"
                >
                  <div className="h-6 w-3/4 bg-white/20 rounded mb-3 shimmer"></div>
                  <div className="h-4 w-full bg-white/10 rounded mb-2 shimmer"></div>
                  <div className="h-4 w-5/6 bg-white/10 rounded mb-4 shimmer"></div>
                  <div className="h-4 w-1/2 bg-white/10 rounded shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {publicGroupTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-pink-400/30 to-[#00ffff27] backdrop-blur-3xl hover:scale-[1.01] transition border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                        <p className="text-sm text-white/60 mb-3">
                          {task.description}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <span
                          className={`font-semibold ${
                            task.status === "completed"
                              ? "text-green-400"
                              : "text-yellow-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-sm text-white/60">
                          Importance:{" "}
                          <ImportanceBadge importance={task.importance} />
                        </p>
                      </div>
                    </div>
                        
                    <div className="flex justify-end items-center mt-4">
                      <button
                        onClick={participateHandler}
                        className="px-3 py-1 text-sm rounded bg-gradient-to-r from-indigo-500 to-teal-400 cursor-pointer hover:opacity-90 transition"
                      >
                        Participate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {publicGroupTasks.length == 0 && (
                <p className="w-full text-center text-gray-500">
                  There are not any public group tasks available !!
                </p>
              )}
            </>
          )}
        </div>
        
        {modalOpen && (
          <TwoStepGroupTaskOverlay
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={onSubmit}
            friendsList={
              dataFromStore.friendsStatus == "Fetched"
                ? dataFromStore.friends
                : []
            }
          />
        )}

        {/* Glassmorphism + Shimmer Effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.9;
            }
            100% {
              opacity: 0.3;
            }
          }
          .shimmer {
            animation: shimmer 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
}