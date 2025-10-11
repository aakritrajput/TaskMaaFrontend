'use client'

import { RootState } from '@/src/lib/store';
import Link from 'next/link';
import React from 'react'
import { useSelector } from 'react-redux';

export type groupTaskType = {
    _id: string;
    title: string;
    description?: string;
    type: 'private' | 'public';
    creatorId: string;
    dueDate: string;
    importance: 'low' | 'medium' | 'high' ;
    status: 'ongoing' | 'completed' ;
    winners: string[];
    createdAt?: string;
    updatedAt?: string;
}

export default function GroupTasksPage() {
    const user = useSelector((state: RootState)=> state.auth.user)

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
            <button className="px-2 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-400 shadow-lg transform hover:scale-105 transition">
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
                  <div className="flex gap-2">
                    {task.winners.length > 0 ? task.winners.slice(0, 3).map((winner, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs border border-white/10">{winner[0]}</div>
                    )) : <div className="text-xs text-white/40">No winners yet</div>}
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