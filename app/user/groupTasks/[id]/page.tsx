'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GroupTaskPage() {
  const { id } = useParams();

  // 🧩 Dummy Current User
  const myId = 'user_2';

  // 🧠 Dummy Task Data
  const currentGroupTask = {
    _id: id,
    title: 'Build AI-Powered Habit Tracker',
    description:
      'A collaborative challenge to build a productivity app that tracks habits and motivates users using AI-driven insights.',
    type: 'public',
    creatorId: 'user_2',
    dueDate: '2025-10-30',
    importance: 'high',
    status: 'ongoing',
    winners: ['user_3', 'user_5'],
  };

  // 👥 Dummy Members
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

  const isAdmin = currentGroupTask.creatorId === myId;

  const glassClass =
    'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg p-5';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <section className="max-w-5xl mx-auto space-y-10">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={glassClass}
        >
          <p className="text-gray-200 leading-relaxed">{currentGroupTask.description}</p>
          <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-300">
            <p>📅 <span className="font-medium">Due:</span> {new Date(currentGroupTask.dueDate).toLocaleDateString()}</p>
            <p>⭐ <span className="font-medium">Importance:</span> {currentGroupTask.importance}</p>
            <p>🔒 <span className="font-medium">Type:</span> {currentGroupTask.type}</p>
            <p>📊 <span className="font-medium">Status:</span> {currentGroupTask.status}</p>
          </div>
        </motion.div>

        {/* Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 mx-auto rounded-full border border-white/30 object-cover"
                />
                <p className="mt-3 font-semibold text-lg">{member.name}</p>
                <p className="text-sm text-gray-300">@{member.username}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Winners or Mark Complete */}
        {currentGroupTask.status === 'completed' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">🏆 Winners</h2>
            <div className="flex flex-wrap gap-4">
              {currentGroupTask.winners.map((winnerId) => {
                const user = members.find((m) => m._id === winnerId);
                return (
                  <div key={user?._id} className={`${glassClass} flex items-center gap-3`}>
                    <Image
                      width={30}
                      height={30}
                      src={user?.avatar || ''}
                      alt={user?.name || ''}
                      className="w-12 h-12 rounded-full border border-white/30"
                    />
                    <p className="font-medium">{user?.name}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-medium transition">
              Mark Complete from My Side
            </button>
          </motion.div>
        )}

        {/* Requests Section (only for admin & public) */}
        {isAdmin && currentGroupTask.type === 'public' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-3">Join Requests</h2>
            <div className="space-y-3">
              {joinRequests.map((req) => (
                <div
                  key={req._id}
                  className={`${glassClass} flex justify-between items-center`}
                >
                  <div>
                    <p className="font-semibold">{req.name}</p>
                    <p className="text-sm text-gray-300">@{req.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg">
                      Accept
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
