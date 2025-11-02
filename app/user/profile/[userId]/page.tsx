"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { RootState } from "@/src/lib/store";


type UserProfile = {
  _id: string;
  username: string;
  name: string;
  profilePicture: string;
  profileType: "public" | "private";
  overallScore?: number;
  longestStreak?: number;
  about?: string;
  badges?: number[];
  isFriend: boolean;
  isRequested: boolean;
  sentOrRecieved: "sent" | "received" | null;
}


const StrangerProfilePage = () => {
  const router = useRouter();
  const { userId: profileId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const myUserId = user?._id;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");


  // Redirect if viewing self
  useEffect(() => {
    if (!profileId || !myUserId) return;
    if (profileId === myUserId) {
      router.push("/user/profile");
    } else {
        const fetchProfile = async (): Promise<void> => {
           try {
             setLoading(true);
             const res = await axios.get<{ data: UserProfile }>(
               `http://localhost:5000/api/user/profile/${profileId}`,
               { withCredentials: true }
             );
             setProfile(res.data.data);
           } catch (error) {
             if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
               setError(`There was some Error: ${error.response.data.message}`)
             }else {
               setError("There was some Error while fetching the profile of given user !! ")
             }
           } finally {
             setLoading(false);
           }
        };
        fetchProfile();
    }
  }, [profileId, myUserId, router]);

  // Handle friend actions
  const handleFriendAction = async (action: "send" | "accepted" | "rejected") => {
    setActionLoading(true);
    try {
        if(action === 'send'){
            await axios.post(`http://localhost:5000/api/user/sendFriendRequest/${profileId}`, {}, { withCredentials: true });
            if(profile){
                profile.sentOrRecieved = "sent";
                profile.isRequested = true;
            }
        }
        else{
            const data = {response: action}
            await axios.post(`http://localhost:5000/api/user/responseToFriendRequest/${profileId}`, data, { withCredentials: true })
            if(action === 'accepted' && profile){
                profile.isFriend = true;
                profile.isRequested = false;
                profile.sentOrRecieved = null;
            }
            else if (action === 'rejected' && profile){
                profile.isFriend = false;
                profile.isRequested = false;
                profile.sentOrRecieved = null;
            }
        }
    } catch (error) {
        if(axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message){
          setActionError(`There was some Error: ${error.response.data.message}`)
        }else {
          setActionError("There was some error while performing the action !! ")
        }
    } finally {
      setActionLoading(false);
    }
  };

  // 🩵 Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-transparent px-4 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/10 space-y-4 animate-pulse">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/20" />
          <div className="h-4 bg-white/20 rounded w-1/2 mx-auto" />
          <div className="h-3 bg-white/10 rounded w-1/3 mx-auto" />
          <div className="flex justify-around mt-6">
            <div className="w-16 h-4 bg-white/10 rounded" />
            <div className="w-16 h-4 bg-white/10 rounded" />
          </div>
          <div className="h-16 bg-white/10 rounded mt-4" />
          <div className="h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg mt-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400 bg-transparent">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  const {
    username,
    name,
    profilePicture,
    profileType,
    overallScore,
    longestStreak,
    about,
    badges,
    isFriend,
    isRequested,
    sentOrRecieved,
  } = profile;

  console.log({
    username,
    name,
    profilePicture,
    profileType,
    overallScore,
    longestStreak,
    about,
    badges,
    isFriend,
    isRequested,
    sentOrRecieved,
  })

  return (
    <motion.div
      className="min-h-screen flex justify-center items-center bg-transparent px-4 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-white/10">
        {/* Profile Image */}
        <div className="w-28 h-28 mx-auto rounded-full border-cyan-300 border-2 overflow-hidden">
           <Image
             src={profilePicture ? profilePicture : "/profile/default_profile_pic.jpg"}
             alt="Profile Picture"
             width={130}
             height={130}
             className="object-cover rounded-full border-2"
           />
        </div>
       

        {/* Name + Username */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-cyan-300">@{username}</p>
        </div>

        {/* Stats */}
        {profileType === "public" && (
          <div className="flex justify-around mt-6 text-sm text-gray-300">
            <div>
              <p className="text-cyan-300 text-lg font-semibold">{overallScore ?? "--"}</p>
              <p>Score</p>
            </div>
            <div>
              <p className="text-cyan-300 text-lg font-semibold">{longestStreak ?? "--"}</p>
              <p>Longest Streak</p>
            </div>
          </div>
        )}

        {/* About */}
        {profileType === "public" && about && (
          <p className="text-gray-300 text-sm mt-4 border-t border-white/10 pt-3">{about}</p>
        )}

        {/* Badges */}
        {profileType === "public" && badges && badges.length > 0 && (
          <div className="flex justify-center gap-3 mt-3">
            {badges.map((badgeIndex) => (
              <Image
                key={badgeIndex}
                src={`/badges/${badgeIndex}.png`}
                alt={`Badge ${badgeIndex}`}
                width={30}
                height={30}
                className="rounded-full"
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-2">
          {isFriend ? (
            <button
              onClick={() => router.push("/user/chat")}
              className="w-full py-2 rounded-lg font-medium bg-gradient-to-r cursor-pointer from-pink-500 to-blue-500 hover:opacity-90 transition-all"
            >
              Chat
            </button>
          ) : !isRequested ? (
            <button
              onClick={async() => await handleFriendAction("send")}
              disabled={actionLoading}
              className="w-full py-2 rounded-lg font-medium bg-gradient-to-r cursor-pointer from-green-400 to-cyan-500 hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {actionLoading ? "Sending..." : "Send Request"}
            </button>
          ) : sentOrRecieved === "sent" ? (
            <p className="text-gray-400 italic">Request sent</p>
          ) : sentOrRecieved === "received" ? (
            <div className="flex flex-col gap-2">
                <h1 className="text-start text-gray-300 text-sm px-2">@{username} has requested you: </h1>
             <div className="flex gap-2">
              <button
                onClick={async() => await handleFriendAction("accepted")}
                disabled={actionLoading}
                className="flex-1 py-2 rounded-lg font-medium bg-gradient-to-r cursor-pointer from-blue-500 to-cyan-400 hover:opacity-90 disabled:opacity-60 transition-all"
              >
                Accept
              </button>
              <button
                onClick={async() => await handleFriendAction("rejected")}
                disabled={actionLoading}
                className="flex-1 py-2 rounded-lg font-medium cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 disabled:opacity-60 transition-all"
              >
                Decline
              </button>
             </div>
            </div>
          ) : null}
          {actionError && <p className="p-2 text-center text-red-500 text-wrap">{actionError}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default StrangerProfilePage;
