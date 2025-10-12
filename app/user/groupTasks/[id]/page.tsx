'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { CheckCircle2, Lock, LockOpen } from 'lucide-react';
import { groupTaskType } from '../page';

export default function GroupTaskPage() {
  const { id } = useParams();

  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id

  // Dummy Task Data
  const currentGroupTask = {
    _id: id,
    title: 'Build AI-Powered Habit Tracker',
    description:
      'A collaborative challenge to build a productivity app that tracks habits and motivates users using AI-driven insights.',
    type: 'public',
    creatorId: '12345',
    dueDate: '2025-10-30',
    importance: 'high',
    status: 'ongoing',
    winners: ['user_3', 'user_5','12345', 'user_4'],
  };

  // Dummy Members
  const members = [
    { _id: 'user_1', username: 'aakrit', name: 'Aakrit Rajput', avatar: '/avatars/aakrit.png' },
    { _id: 'user_2', username: 'komal', name: 'Komal Singh', avatar: '/avatars/komal.png' },
    { _id: 'user_3', username: 'karan', name: 'Karan Rajput', avatar: '/avatars/karan.png' },
    { _id: 'user_4', username: 'anjana', name: 'Anjana Devi', avatar: '/avatars/anjana.png' },
    { _id: 'user_5', username: 'karmi', name: 'Karmi Devi', avatar: '/avatars/karmi.png' },
  ];

  // 📥 Dummy Join Requests (only for public & admin)
  const joinRequests = [
    { _id: 'req_1', username: 'ravi', name: 'Ravi Kumar' },
    { _id: 'req_2', username: 'neha', name: 'Neha Sharma' },
  ];

  const taskCompletionHandler = () => {};
  const handleTaskEnd = () => {};
  const requestHandler = (response: 'accept' | 'reject') => { console.log(response)};

  const isAdmin = currentGroupTask.creatorId === userId;

  const glassClass =
    'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-5';
  
  function ImportanceBadge({ importance }: { importance: groupTaskType["importance"] }) {
    const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    if (importance === "high") return <span className={`${base} bg-red-600/30 text-red-200`}>High</span>;
    if (importance === "medium") return <span className={`${base} bg-yellow-600/25 text-yellow-200`}>Medium</span>;
    return <span className={`${base} bg-green-700/25 text-green-200`}>Low</span>;
  }

  return (
    <main className="min-h-screen bg-transparent text-white p-6">
      <section className="md:px-6 mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{currentGroupTask.title}</h1>
          {isAdmin && (
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition">
                Edit
              </button>
              <button className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Details Card */}
        <div>
          <p className="text-gray-200 leading-relaxed p-2 border-b-[1px] border-b-gray-400 flex gap-2">{currentGroupTask.winners.includes(userId ?? '') && <span className='text-green-500'><CheckCircle2/></span>}{currentGroupTask.description}</p>
          <div className="flex flex-wrap backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-5  justify-between gap-5 mt-4 w-full text-sm">
            <div className='flex flex-wrap gap-3'>
              <p><span className="font-medium text-[#0e8bb4]">Due:</span> {new Date(currentGroupTask.dueDate).toLocaleDateString()}</p>
              <p><span className="font-medium text-gray-400"><ImportanceBadge importance={currentGroupTask.importance as groupTaskType['importance']}/></span></p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <p className='text-black'>{currentGroupTask.type == 'public' ? <LockOpen/> : <Lock/>}</p>
              <p className={`${currentGroupTask.status == 'completed' ? 'text-green-400': 'text-yellow-300'} text-2xl`}>{currentGroupTask.status == 'completed' ? 'Completed' : 'Ongoing'}</p>
            </div>
            
          </div>
        </div>

        <div className='flex justify-between gap-2'> {/* In future we can here allow user to mark uncompleted if they accidently marked completed but for now we will show them a warning that they cannot redo this action and hence only mark as completed */}
          <button onClick={taskCompletionHandler} disabled={currentGroupTask.winners.includes(userId ?? '') } className={`px-6 py-3 ${currentGroupTask.winners.includes(userId ?? '') ? 'cursor-not-allowed bg-gray-700 hover:bg-gray-800' : 'cursor-pointer bg-green-600 hover:bg-green-700'} rounded-xl text-lg font-medium transition`}>
            {currentGroupTask.winners.includes(userId ?? '') ? 'Completed' : 'Mark Complete'}
          </button>
          {isAdmin && currentGroupTask.status == 'ongoing' && <button onClick={handleTaskEnd} className='rounded-xl text-lg font-medium bg-green-500 cursor-pointer p-4'>Finish Group Task</button>}
        </div>

        {/* Winners */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Winners 👑</h2>
            <div className="flex gap-4 overflow-y-visible pt-9 overflow-x-auto">
              {currentGroupTask.winners.map((winnerId, idx) => {
                const user = members.find((m) => m._id === winnerId);
                return (
                  <div key={idx} className={`bg-gradient-to-l from-[#ff00004d] flex relative p-5 shadow-lg rounded-lg border-2 items-center gap-3`}>
                    <h1 className={`absolute left-0 text-bold ${idx == 0 ? 'text-yellow-300' : idx == 1 ? 'text-gray-300' : idx == 2 ? 'text-[#9b6060]' : 'text-amber-100'} text-4xl top-[-40]`}>{idx + 1}</h1>
                    <Image
                      width={30}
                      height={30}
                      src={user?.avatar || '/profile/default_profile_pic.png'}
                      alt={user?.name || ''}
                      className="w-12 h-12 rounded-full border border-white/30"
                    />
                    <p className="font-medium">{user?.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        {currentGroupTask.winners.includes(userId ?? '') && <h1>Your Rank: <span>{currentGroupTask.winners.indexOf(userId ?? '') + 1}</span></h1>}

          {/* Requests Section (only for admin & public) */}
        {isAdmin && currentGroupTask.type === 'public' && (
          <div>
            <h2 className="text-2xl font-semibold mb-3">Join Requests</h2>
            <div className="space-y-3">
              {joinRequests.map((req) => (
                <div
                  key={req._id}
                  className={`${glassClass} flex gap-2 justify-between items-center`}
                >
                  <div>
                    <p className="font-semibold">{req.name}</p>
                    <p className="text-sm text-gray-300">@{req.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => requestHandler('accept')} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg">
                      Accept
                    </button>
                    <button onClick={() => requestHandler('reject')} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          
        {/* Members Section */}
        <div
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Group Members</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {members.map((member) => (
              <div
                key={member._id}
                className={`${glassClass} text-center hover:bg-white/20 transition`}
              >
                <Image
                  width={30}
                  height={30}
                  src='/TaskMaa_AI.png'
                  alt={member.name}
                  className="w-16 h-16 mx-auto rounded-full border border-white/30 object-cover"
                />
                <p className="mt-3 font-semibold text-lg">{member.name}</p>
                <p className="text-sm text-gray-300">@{member.username}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
