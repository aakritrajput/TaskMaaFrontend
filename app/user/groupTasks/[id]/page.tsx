'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { CheckCircle, Lock, LockOpen } from 'lucide-react';
import { groupTaskType } from '../page';
import TwoStepGroupTaskOverlay, { GroupTaskFormData, Member } from '@/src/components/user/GroupTaskModal';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { addFriends, addGroupTasks, deleteGroupTask, editGroupTask, errorOnFriends, errorOnGrouptasks } from '@/src/lib/features/tasks/groupTaskSlice';

export default function GroupTaskPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id
  const [membersLoading, setMembersLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const groupTaskStatus = useSelector((state: RootState) => state.groupTask.groupTaskStatus)
  const currentGroupTask = useSelector((state: RootState) => state.groupTask.groupTasks.find(task => task._id == id))

  const friendsStatus = useSelector((state: RootState) => state.groupTask.friendsStatus)
  const friends = useSelector((state: RootState) => state.groupTask.friends)

  const [members, setMembers] = useState<Member[]>([])

  const groupTaskMembers = members.map(member => ({...member, isFriend: friends.some(friend => friend._id == member._id)}))

  
  const defaultData: GroupTaskFormData & {members: Member[]} = {
    title: currentGroupTask?.title || '',
    description: currentGroupTask?.description || '',
    type: currentGroupTask?.type || 'private',
    dueDate: currentGroupTask  ?  new Date(currentGroupTask.dueDate).toISOString().split('T')[0] : '',
    importance: currentGroupTask?.importance || 'medium',
    members: groupTaskMembers
  }

  console.log('current data: ', currentGroupTask)

  const [membersError, setMembersError] = useState<string>('')

  const publicMembersStranger = groupTaskMembers.filter(member => !member.isFriend && member._id !== userId) // we don't want that the user itself like me is also added in public members list as i will not be included in my friends list 

  const hasFetched = useRef({
    friends: false,
    groupTask:false,
    members: false,
  })

  useEffect(() => {
     if(friendsStatus == 'Loading' && !hasFetched.current.friends){
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
      if(groupTaskStatus == 'Loading' && !hasFetched.current.groupTask){
        hasFetched.current.groupTask = true;
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
      if(membersLoading && !hasFetched.current.members){
        hasFetched.current.members = true;
        async function getMembersOfTasks(){
        try {
          const response = await axios.get(`http://localhost:5000/api/groupTask/groupTaskMembers/${id}`, {withCredentials: true})
          setMembers(response.data.data)
        } catch (error) {
          console.log('error: ', error)
          if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
            setMembersError(error.response.data.message)
          }else {
            setMembersError("There was some error while loading this task's members !!")
          }
        }finally{
          setMembersLoading(false);
        }
      }
      getMembersOfTasks();
      }
  })

  // NOTE: if on errors we don't want to refresh then one more thing we can do is we will store the data before update in variable like prevTask and onError we will edit the data with prev data itself !!-- but for now i am considering to refresh the page as on refresh also the state will be sync from backend itself !!

  const taskCompletionHandler = async () => {
    if (!userId || !currentGroupTask) return;
    const prevTask = currentGroupTask;
    const newWinners = [...(prevTask.winners || []), userId];
    try {
      dispatch(editGroupTask({ ...prevTask, winners: newWinners } as groupTaskType));
      await axios.get(`http://localhost:5000/api/groupTask/markComplete/${id}`, { withCredentials: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`);
      } else {
        alert("There was some Error while marking your group Task as completed !! - Need to refresh the whole page.. ");
      }
      window.location.reload();
    }
  };

  const handleTaskEnd = async() => {
    if (!currentGroupTask) return;
    try {
      dispatch(editGroupTask({ ...currentGroupTask, status: 'completed' } as groupTaskType));
      await axios.get(`http://localhost:5000/api/groupTask/toggleGroupTask/${id}`, { withCredentials: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`);
      } else {
        alert("There was some Error while toggling your group Task as completed !! - Need to refresh the whole page.. ");
      }
      window.location.reload();
    }
  };

  const onEdit = async(data: GroupTaskFormData & { members: Member['_id'][] }) => {
    try {
      dispatch(editGroupTask({...currentGroupTask, ...data} as groupTaskType));
      setMembers(prev => {
        // Retain existing members whose _id is still in data.members
        const retainedMembers = prev.filter(member => data.members.includes(member._id));
      
        // Find new member IDs that are not in prev
        const prevIds = prev.map(m => m._id);
        const newMemberIds = data.members.filter(id => !prevIds.includes(id));
      
        // Get the full member objects from friends for the new IDs
        const newMembers = friends.filter(f => newMemberIds.includes(f._id));
      
        // Merge retained + new members
        return [...retainedMembers, ...newMembers];
      });

      await axios.post(`http://localhost:5000/api/groupTask/editGroupTask/${id}`, data, {withCredentials: true})
    } catch (error) {
      if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
        alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
      }else {
        alert("There was some Error while updating your group Task !! - Need to refresh the whole page.. ")
      }
      window.location.reload()
    }
  };

  const router = useRouter()

  const handleDeleteGroupTask = async() => {
    try {
      dispatch(deleteGroupTask(id as groupTaskType['_id']))
      router.push('/user/groupTasks')
      await axios.delete(`http://localhost:5000/api/groupTask/deleteGroupTask/${id}`, {withCredentials: true}) // the api call will still run !!
    } catch (error) {
      if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
        alert(`${error.response.data.message}, Therefore need to refresh the whole page !!`)
      }else {
        alert("There was some Error while deleting your group Task !! - Need to refresh the whole page.. ")
      }
      window.location.reload()
    }
  }

  const isAdmin = currentGroupTask?.creatorId === userId;

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
        {/* --- Loading State (whole page skeleton) --- */}
        {groupTaskStatus === 'Loading' && (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between gap-4">
              <div className="h-8 w-1/3 rounded-md bg-white/20 shimmer" />
              <div className="h-9 w-28 rounded-2xl bg-white/10 shimmer" />
            </div>
        
            {/* Details card skeleton */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/6 to-white/3 backdrop-blur-3xl border border-white/10">
              <div className="space-y-3">
                <div className="h-5 w-3/4 rounded bg-white/10 shimmer" />
                <div className="h-4 w-full rounded bg-white/8 shimmer" />
                <div className="flex justify-between mt-4">
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-white/8 shimmer" />
                    <div className="h-4 w-24 rounded bg-white/8 shimmer" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-20 rounded bg-white/8 shimmer" />
                    <div className="h-6 w-28 rounded bg-white/8 shimmer" />
                  </div>
                </div>
              </div>
            </div>
        
            {/* Buttons skeleton */}
            <div className="flex gap-2">
              <div className="h-12 w-40 rounded-xl bg-white/10 shimmer" />
              <div className="h-12 w-44 rounded-xl bg-white/10 shimmer" />
            </div>
        
            {/* Winners skeleton */}
            <div>
              <div className="h-6 w-64 rounded bg-white/10 shimmer mb-4" />
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-40 h-24 rounded-lg p-4 glass-card animate-pulse border border-white/10">
                    <div className="h-10 w-10 rounded-full bg-white/10 shimmer mb-3" />
                    <div className="h-4 w-28 rounded bg-white/8 shimmer" />
                  </div>
                ))}
              </div>
            </div>
              
            {/* Members skeleton */}
            <div>
              <div className="h-6 w-48 rounded bg-white/10 shimmer mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`${glassClass} text-center p-4`}>
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/10 shimmer mb-3" />
                    <div className="h-4 w-24 mx-auto rounded bg-white/8 shimmer" />
                    <div className="h-3 w-20 mx-auto rounded bg-white/8 shimmer mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- Error fetching group task --- */}
        {groupTaskStatus === 'Error' && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-300">There was an error fetching your group task. Please try again later.</p>
          </div>
        )}

        {/* --- Fetched but no task found --- */}
        {groupTaskStatus === 'Fetched' && !currentGroupTask && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">Task not found</h2>
            <p className="text-gray-300">No group task exists with the given id. If you consider that it exists in the past then this may be because the admin has deleted the task !!</p>
          </div>
        )}

        {/* --- Error when fetching members --- */}
        {membersError && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">Task not found</h2>
            <p className="text-gray-300">No group task exists with the given id.</p>
          </div>
        )}

        {/* --- Real content when fetched and task exists --- */}
        {groupTaskStatus === 'Fetched' && !membersError && currentGroupTask && ( // here we are adding the members error check as we don't want to show the UI if we get any error on members
          <>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{currentGroupTask.title}</h1>
              {isAdmin && (
                <div className="flex gap-3"> {/* Just to double check iam also adding the state checks in btn disability */}
                {currentGroupTask.status !== 'completed' && <button disabled={groupTaskStatus !== 'Fetched' || friendsStatus !== 'Fetched' || membersLoading} onClick={() => setModalOpen(true)} className={`px-4 py-2 ${(groupTaskStatus !== 'Fetched' || friendsStatus !== 'Fetched' || membersLoading) ? 'cursor-not-allowed' : 'cursor-pointer'} bg-blue-600 rounded-xl hover:bg-blue-700 transition`}>
                  Edit
                </button>}
                  <button disabled={groupTaskStatus !== 'Fetched' || friendsStatus !== 'Fetched' || membersLoading} onClick={handleDeleteGroupTask} className={`px-4 py-2 ${(groupTaskStatus !== 'Fetched' || friendsStatus !== 'Fetched' || membersLoading) ? 'cursor-not-allowed' : 'cursor-pointer'} bg-red-600 rounded-xl hover:bg-red-700 transition`}>
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {/* Details Card */}
            <div>
              <p className="text-gray-200 leading-relaxed p-2 border-b-[1px] border-b-gray-400 flex gap-2">
                {currentGroupTask.winners?.includes(userId ?? '') && <span className='text-green-500'><CheckCircle/></span>}
                {currentGroupTask.description}
              </p>
            
              <div className="flex flex-wrap backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-5 justify-between gap-5 mt-4 w-full text-sm">
                <div className='flex flex-wrap gap-3'>
                  <p>
                    <span className="font-medium text-[#0e8bb4]">Due:</span>{' '}
                    {currentGroupTask.dueDate ? new Date(currentGroupTask.dueDate).toLocaleDateString() : '—'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-400">
                      <ImportanceBadge importance={currentGroupTask.importance} />
                    </span>
                  </p>
                </div>
            
                <div className='flex flex-wrap gap-3'>
                  <p className='text-black'>{currentGroupTask.type === 'public' ? <LockOpen/> : <Lock/>}</p>
                  <p className={`${currentGroupTask.status === 'completed' ? 'text-green-400': 'text-yellow-300'} text-2xl`}>
                    {currentGroupTask.status === 'completed' ? 'Completed' : 'Ongoing'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className='flex justify-between gap-2'>
              {currentGroupTask.status == 'ongoing' && <button
                onClick={taskCompletionHandler}
                disabled={currentGroupTask.winners?.includes(userId ?? '') || groupTaskStatus !== 'Fetched' || friendsStatus !== 'Fetched' || membersLoading}
                className={`px-6 py-3 ${currentGroupTask.winners?.includes(userId ?? '') ? 'cursor-not-allowed bg-gray-700 hover:bg-gray-800' : 'cursor-pointer bg-green-600 hover:bg-green-700'} rounded-xl text-lg font-medium transition`}
              >
                {currentGroupTask.winners?.includes(userId ?? '') ? 'Completed' : 'Mark Complete'}
              </button>}
            
              {isAdmin && currentGroupTask.status === 'ongoing' && (
                <button onClick={handleTaskEnd} className='rounded-xl text-lg font-medium bg-green-500 cursor-pointer p-4'>
                  Finish Group Task
                </button>
              )}
            </div>
            
            {/* Winners (memberStatus controls winners/members loading) */}
            {currentGroupTask.winners.length > 0 && <div>
              <h2 className="text-2xl font-semibold ">Winners 👑</h2>
              <p className='text-sm pb-2 mb-4 text-gray-400'>Note: It does not show the live updates, You can refresh after some time to see your actual rank - But soon it will be live !!</p>
            
              {membersLoading === true ? (
                // winners skeleton while members are loading
                <div className="flex gap-4 overflow-x-auto">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-40 h-24 rounded-lg p-4 glass-card animate-pulse border border-white/10">
                      <div className="h-10 w-10 rounded-full bg-white/10 shimmer mb-3" />
                      <div className="h-4 w-28 rounded bg-white/8 shimmer" />
                    </div>
                  ))}
                </div>
              ) : (
                // real winners UI
                <div className="flex gap-4 overflow-y-visible pt-9 overflow-x-auto">
                  {currentGroupTask.winners.map((winnerId, idx) => {
                    console.log('winners :', winnerId)
                    const user = members.find((m) => m._id === winnerId);
                    return (
                      <div key={idx} className={`bg-gradient-to-l from-[#ff00004d] flex relative p-5 shadow-lg rounded-lg border-2 items-center gap-3`}>
                        <h1 className={`absolute left-0 text-bold ${idx == 0 ? 'text-yellow-300' : idx == 1 ? 'text-gray-300' : idx == 2 ? 'text-[#9b6060]' : 'text-amber-100'} text-4xl top-[-40]`}>{idx + 1}</h1>
                        <Image
                          width={30}
                          height={30}
                          src={user?.profilePicture || '/profile/default_profile_pic.jpg'}
                          alt={user?.name || ''}
                          className="w-12 h-12 rounded-full border border-white/30"
                        />
                        <p className="font-medium">{user?.username}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>}
            
            {currentGroupTask.winners?.includes(userId ?? '') && (
              <h1>Your Rank: <span>{currentGroupTask.winners.indexOf(userId ?? '') + 1}</span></h1>
            )}

            {/* Members Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Members</h2>
          
              {membersLoading === true ? (
                // members skeleton while loading
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`${glassClass} text-center p-4`}>
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 shimmer mb-3" />
                      <div className="h-4 w-24 mx-auto rounded bg-white/8 shimmer" />
                      <div className="h-3 w-20 mx-auto rounded bg-white/8 shimmer mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                // real members
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {members.map((member, idx) => (
                    <div key={idx} className={`${glassClass} text-center hover:bg-white/20 transition p-4`}>
                      <Image
                        width={30}
                        height={30}
                        src={member.profilePicture || '/TaskMaa_AI.png'}
                        alt={member.name}
                        className="w-16 h-16 mx-auto rounded-full border border-white/30 object-cover"
                      />
                      <p className="mt-3 font-semibold text-lg">{member.name}</p>
                      <p className="text-sm text-gray-300">@{member.username}</p>
                      <p className='text-sm text-gray-300'>{member._id == user?._id && '( You )'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
      
      {modalOpen && (
        <TwoStepGroupTaskOverlay
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          publicMembers={publicMembersStranger}
          editData={defaultData}
          onSubmit={onEdit}
          friendsList={friends}
        />
      )}

      {/* Shimmer CSS (glow on/off effect) */}
      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 0.95; transform: translateY(-1px); }
          100% { opacity: 0.35; transform: translateY(0); }
        }
        .shimmer {
          animation: shimmer 1.4s ease-in-out infinite;
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 100%);
          background-size: 200% 100%;
        }
      
        /* keep your glass-card rules if used elsewhere */
        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          backdrop-filter: blur(10px);
        }
      `}</style>
    </main>

  );
}
