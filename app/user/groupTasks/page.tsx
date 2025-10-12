'use client'

import TwoStepGroupTaskOverlay, { GroupTaskFormData, Member } from '@/src/components/user/GroupTaskModal';
import { RootState } from '@/src/lib/store';
import Link from 'next/link';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

export type groupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'private' | 'public';
    creatorId: string;
    dueDate: string;
    importance: 'low' | 'medium' | 'high';
    status: 'ongoing' | 'completed';
    winners: string[];
    createdAt?: string;
    updatedAt?: string;
}

type publicGroupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'public';
    creatorId: {_id: string; profilePic: string; username: string;};
    dueDate: string;
    importance: 'low' | 'medium' | 'high' ;
    status: 'ongoing' | 'completed' ;
    winners: string[];
    pendingRequests: string[];
    createdAt?: string;
    updatedAt?: string;
}

export default function GroupTasksPage() {
    const user = useSelector((state: RootState)=> state.auth.user)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const groupTasks: groupTaskType[] = [
      {
        _id: '1',
        title: '30 Days Coding Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: ['Komal', 'Karan', 'Nina'],
        creatorId: '12345',
        dueDate: '15-10-2025',
        type: 'private',
      },
      {
        _id: '2',
        title: '30 Days Coding Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: ['Komal', 'Karan', 'Nina'],
        creatorId: '12345',
        dueDate: '15-10-2025',
        type: 'private',
      },
      {
        _id: '3',
        title: 'Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: ['Komal', 'Karan', 'Nina'],
        creatorId: '1234567',
        dueDate: '15-10-2025',
        type: 'private',
      }
    ]

    const publicGroupTasks: publicGroupTaskType[] = [
      {
        _id: '1',
        title: '30 Days Coding Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: [],
        creatorId: {_id: 'user_4', profilePic: '/profile/default_profile_pic.png', username: 'aakrit.rajput'}, // here creatorId should contain the populated user's profilepic and user name !!
        dueDate: '15-10-2025',
        type: 'public',
        pendingRequests: ['user1', '12345']
      },
      {
        _id: '2',
        title: '30 Days Coding Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: ['Komal', 'Karan', 'Nina'],
        creatorId: {_id: '12345', profilePic: '/profile/default_profile_pic.png', username: 'aakrit.rajput'},
        dueDate: '15-10-2025',
        type: 'public',
        pendingRequests: ['user_2'],
      },
      {
        _id: '3',
        title: 'Challenge',
        description: 'Complete daily coding challenges to improve problem-solving skills.',
        importance: 'high',
        status: 'ongoing',
        winners: ['Komal', 'Karan', 'Nina'],
        creatorId: {_id: '12345', profilePic: '/profile/default_profile_pic.png', username: 'aakrit.rajput'},
        dueDate: '15-10-2025',
        type: 'public',
        pendingRequests: [],
      }
    ]   

    const dummyFriends = [
      {
      id: '12',
      name: 'vinayak',
      username: 'vinayak23',
      profilePic: '',
      isFriend: true,
      },
      {
      id: '123',
      name: 'anushka',
      username: 'anu123',
      profilePic: '',
      isFriend: true,
      },
    ]

    const requestHandler = () => {}
    const onSubmit = (data: GroupTaskFormData & { members: Member['id'][] }) => {console.log(data)};
    const friends: Member[] = dummyFriends;

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
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">Your Group Tasks</h2>
            <button onClick={() => setModalOpen(true)} className="px-2 sm:px-4 py-2 rounded-2xl cursor-pointer bg-gradient-to-r from-indigo-500 to-teal-400 shadow-lg transform hover:scale-105 transition">
              + Create
            </button>
          </div>
          {/* Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupTasks.map(task => (
              <Link href={`/user/groupTasks/${task._id}`} key={task._id} className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-[#00ffff27] backdrop-blur-3xl hover:scale-[1.01] transition border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                    <p className="text-sm text-white/60 mb-3">{task.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className={`font-semibold ${task.status === 'completed' ? 'text-green-400' : 'text-yellow-300'}`}>{task.status}</span>
                  </div>
                </div>  
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm text-white/60">Importance: <ImportanceBadge importance={task.importance}/></p>
                    <p className="text-sm text-white/60">Role: <span className="text-white">{task.creatorId === user?._id ? <span className='text-[#48de9b]'>Admin</span> : <span className='text-[#a88aea]'>Participant</span>}</span></p>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4">
                  <button className="px-3 py-1 text-sm rounded bg-gradient-to-r from-indigo-500 to-teal-400 hover:opacity-90 transition">View</button>
                </div>
              </Link>
            ))}
          </div>
          {groupTasks.length == 0 && <p className='w-full text-center text-gray-500'>You don&apos;t have any group tasks !!</p>}
        </div>

        <div className='px-2 sm:px-3 border-t-2 border-t-gray-600 md:px-5 lg:px-8 mt-7 py-5'>
          <h1 className='text-3xl font-bold bg-clip-text bg-gradient-to-br text-transparent from bg-pink-400 to-blue-400'>Public Group Tasks</h1>
          <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'> {/* Here in future we can implement pagination to load tasks in chunks */}
            {publicGroupTasks.map(task => (
              <div key={task._id} className="p-5 rounded-2xl bg-gradient-to-br from-pink-400/30 to-[#00ffff27] backdrop-blur-3xl hover:scale-[1.01] transition border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                    <p className="text-sm text-white/60 mb-3">{task.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className={`font-semibold ${task.status === 'completed' ? 'text-green-400' : 'text-yellow-300'}`}>{task.status}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm text-white/60">Importance: <ImportanceBadge importance={task.importance}/></p>
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4"> {/* Here in pending requests we can add an even listener sought of something that will listen if there is any response like my request is accepted then i should not be shown this gorup task in the suggestions but in my group tasks only !! */}
                  {/* In future if we have a lot of users then we can here Implement recommendation for the public group tasks and pagination also  !! */}
                  {/* Also this time we will only allow user to just one time press the btn - that to request and after that he cannot press it like to redo the action as that would complex our first versions making*/}
                  <button onClick={requestHandler} disabled={task.pendingRequests.includes(user?._id ?? '')} className={`px-3 py-1 text-sm rounded ${task.pendingRequests.includes(user?._id ?? '') ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-teal-400 cursor-pointer'} hover:opacity-90 transition`}>{task.pendingRequests.includes(user?._id ?? '') ? 'Requested...' : 'Request' }</button>
                </div>
              </div>
            ))}
          </div>
          {publicGroupTasks.length == 0 && <p className='w-full text-center text-gray-500'>There are not any public group tasks available !!</p>}
        </div>

        {modalOpen && <TwoStepGroupTaskOverlay isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={onSubmit} friendsList={friends}/>}
        {/* Glassmorphism style */}
        <style jsx>{`
          .glass-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
            backdrop-filter: blur(10px);
          }
        `}</style>
      </div>
    )
}