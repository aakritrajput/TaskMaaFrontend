'use client'

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";


type searchUserType = {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<searchUserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState<string>('');

  // 🔍 Handle search on submit
  const handleSearch = async (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e?.preventDefault(); // prevent page reload

    setUser(null);
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/search?username=${query}`,
        { withCredentials: true }
      );
      setUser(response.data.data);
    } catch (error) {
        if(axios.isAxiosError(error)){
          setQueryError(`${error.response?.data.message}`)
        }else {
          console.log("There was some Error while searching for the given user !! ", error)
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[96vh] px-2 max-w-lg mx-auto mt-6 relative">
      {/* 🔹 Search form */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gradient-to-r from-cyan-800/30 to-teal-700/30 backdrop-blur-lg border border-white/10 rounded-2xl p-3 shadow-lg transition-all focus-within:border-cyan-400/40"
      >
        <Search
          className="text-gray-300 w-5 h-5 mr-2 cursor-pointer"
          onClick={(e) => {
            handleSearch(e);
          }}
        />
        <input
          type="text"
          placeholder="Search user by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder-gray-400"
        />
        {loading && <Loader2 className="animate-spin w-5 h-5 text-cyan-300" />}
      </form>

      {/* 🔹 Results */}
      {user && (
        <div className="absolute px-2 mt-2 w-[96%] bg-[#0c1b1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
            <div
              className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-all"
            >
              <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
              <Image
                src={user.profilePicture || "/profile/default_profile_pic.jpg"}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full object-cover border border-white/10"
              />
              </div>
              
              <div className="flex flex-1">
                <div className="flex flex-col gap-1">
                     <span className="text-white font-medium">{user.username}</span>
                    <span className="text-gray-400 text-sm">{user.name}</span>
                </div>
              </div>
              <div className="h-full m-2 flex justify-center items-center">
                <Link href={`/user/profile/${user._id}`} className="p-2 bg-gradient-to-r from-blue-500 to-pink-400 rounded-xl">View</Link>
              </div>
            </div>
        </div>
      )}

      {/* 🫥 No results */}
      {!loading && queryError && (
        <div className="absolute mt-2 w-full bg-[#0c1b1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-center text-gray-400 py-4">
          {queryError}
        </div>
      )}
    </div>
  );
}

