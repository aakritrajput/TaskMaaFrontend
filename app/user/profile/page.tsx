"use client";

import { RootState } from "@/src/lib/store";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  profilePicture?: string | null;
  profileType?: string;
  about?: string;
  badges?: number[];
};

export type RequestItem = {
  _id: string;
  username: string;
  name: string;
  profilePicture?: string;
};

const DEFAULT_BADGE_IMAGES = [
  "/TaskMaa_AI.png",
  "/TaskMaa_AI.png",
  "/TaskMaa_AI.png",
  "/TaskMaa_AI.png",
  "/TaskMaa_AI.png",
  "/TaskMaa_AI.png",
];

export default function ProfilePage() {
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [requestsError, setRequestsError] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [editName, setEditName] = useState("");
  const [editProfileType, setEditProfileType] = useState("private");
  const [editAbout, setEditAbout] = useState("");
  const [editProfilePicFile, setEditProfilePicFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/user/profile/${userId}`,
          { withCredentials: true }
        );
        setProfile(res.data.data);
        setEditProfileType(res.data.data.profileType || "private");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError(`Error: ${error.response.data.message}`);
        } else {
          setError("Error while fetching profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    async function fetchRequests() {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/requestsIRecieved`, {
          withCredentials: true,
        });
        setRequests(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setRequestsError(`Error: ${error.response.data.message}`);
        } else {
          setRequestsError("Error while fetching requests.");
        }
      }
    }

    fetchProfile();
    fetchRequests();
  }, [userId]);

  function badgeImageForIndex(index: number) {
    return DEFAULT_BADGE_IMAGES[index] || DEFAULT_BADGE_IMAGES[0];
  }

  function openEdit() {
    if (!profile) return;
    setEditName(profile.name || "");
    setEditProfileType(profile.profileType || "");
    setEditAbout(profile.about || "");
    setPreviewUrl(profile.profilePicture || null);
    setEditing(true);
  }

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setEditProfilePicFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  }

  async function submitEdit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!userId) return;
    try {
      setEditSubmitting(true);
      const form = new FormData();
      form.append("name", editName);
      form.append("profileType", editProfileType);
      form.append("about", editAbout);
      if (editProfilePicFile) form.append("profilePicture", editProfilePicFile);

      const res = await axios.put(
        `http://localhost:5000/api/user/editProfile`,
        form,
        { withCredentials: true }
      );

      setProfile(res.data.data);
      setEditing(false);
      setEditProfilePicFile(null);
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error(err);
      alert("Could not update profile.");
    } finally {
      setEditSubmitting(false);
    }
  }

  const handleFriendAction = async ({
    profileId,
    action,
  }: {
    profileId: string;
    action: "accepted" | "rejected";
  }) => {
    setActionLoading(true);
    try {
      const data = { response: action };
      await axios.post(
        `http://localhost:5000/api/user/responseToFriendRequest/${profileId}`,
        data,
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((req) => req._id !== profileId));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setActionError(`Error: ${error.response.data.message}`);
      } else {
        setActionError("Error performing action.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const logoutHandler = async () => {
    setLoggingOut(true);
    try {
      await axios.get("http://localhost:5000/api/user/logout", { withCredentials: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}`);
      } else {
        alert("There was some Error logging out from your account !!");
      }
      window.location.reload();
    } finally {
      setLoggingOut(false);
      window.location.reload();
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete("http://localhost:5000/api/user/delete", { withCredentials: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}`);
      } else {
        alert("There was some Error deleting your account !!");
      }
    } finally {
      setDeleting(false);
      window.location.reload();
    }
  };

  // === Confirm Delete Modal ===
  const ConfirmModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#04232d] text-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-sm mb-6 text-white/80">
          Are you sure you want to permanently delete your account? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            disabled={deleting}
            onClick={() => {
              setShowConfirmModal(false);
              deleteAccount();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer hover:opacity-90 disabled:opacity-60"
          >
            {deleting ? "Processing..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <p>No user found in Redux store.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#02111a] via-[#012a2b] to-[#052b3a] text-white p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-10 bg-white/10 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 h-80"></div>
            <div className="col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 h-60"></div>
              <div className="p-6 rounded-2xl bg-white/5 h-60"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#02111a] via-[#012a2b] to-[#052b3a] text-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">My Profile</h1>
        </header>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-y-2 md:gap-6">
          <div className="col-span-1 p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-4 border border-white/10 shadow-inner">
                <Image
                  width={100}
                  height={100}
                  src={profile?.profilePicture || "/profile/default_profile_pic.jpg"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold">{profile?.name || "-"}</h2>
              <p className="text-sm text-white/70">@{profile?.username || "-"}</p>
              <p className="mt-3 text-sm text-white/80">{profile?.profileType || "private"}</p>

              <div className="mt-4 w-full">
                <button
                  onClick={openEdit}
                  className="w-full py-2 cursor-pointer rounded-xl bg-gradient-to-r from-[#2dd4bf]/40 to-[#60a5fa]/30 backdrop-blur-md hover:from-[#2dd4bf]/50"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 w-full">
                <h3 className="text-sm font-medium mb-2">Badges</h3>
                <div className="flex gap-3 flex-wrap">
                  {profile?.badges && profile.badges.length > 0 ? (
                    profile.badges.map((b, idx) => (
                      <div key={idx} className="flex flex-col items-center text-xs">
                        <Image
                          width={40}
                          height={40}
                          src={badgeImageForIndex(b)}
                          alt={`badge-${b}`}
                          className="w-12 h-12"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/60">No badges yet.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-around gap-3 p-2">
                <button
                  disabled={loggingOut}
                  className="text-black px-2 py-1 cursor-pointer bg-gradient-to-r from-pink-400 to-cyan-400 hover:bg-gradient-to-r hover:from-gray-500 hover:to-red-400 rounded-xl"
                  onClick={logoutHandler}
                >
                  {loggingOut ? "Processing..." : "Logout"}
                </button>
                <button
                  disabled={deleting}
                  className="text-black leading-tight text-center px-2 py-1 cursor-pointer bg-gradient-to-r from-yellow-400 to-cyan-400 hover:bg-gradient-to-r hover:from-gray-500 hover:to-red-400 rounded-xl"
                  onClick={() => setShowConfirmModal(true)}
                >
                  {deleting ? "Processing..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-2 space-y-6">
            {/* About */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-white/4 to-white/6 backdrop-blur-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              {editing ? (
                <form onSubmit={submitEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1">Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/6"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Profile Type</label>
                    <select
                      value={editProfileType}
                      onChange={(e) => setEditProfileType(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/6"
                    >
                      <option className="bg-black" value="public">
                        Public
                      </option>
                      <option className="bg-black" value="private">
                        Private
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">About</label>
                    <textarea
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/6 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Profile Picture</label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-full overflow-hidden border cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Image
                          width={100}
                          height={100}
                          src={
                            previewUrl || "/profile/default_profile_pic.jpg"
                          }
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={editSubmitting}
                      className="flex items-center justify-center gap-2 px-4 cursor-pointer py-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#60a5fa] disabled:opacity-50"
                    >
                      {editSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 cursor-pointer py-2 rounded-xl bg-white/6"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="whitespace-pre-wrap">
                  {profile?.about || "No bio yet."}
                </p>
              )}
            </div>

            {/* Requests */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Requests</h3>
              </div>

              {requestsError && (
                <p className="text-red-400 mt-2 text-sm">{requestsError}</p>
              )}
              {actionError && (
                <p className="text-red-400 mt-2 text-sm">{actionError}</p>
              )}

              <div className="mt-4">
                {requests.length === 0 ? (
                  <p className="text-sm text-white/60">No requests.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div key={req._id} className="flex flex-col gap-2">
                        <div className="flex flex-col justify-center items-center gap-1">
                          <Image
                            width={40}
                            height={40}
                            src={
                              req.profilePicture ??
                              "/profile/default_profile_pic.jpg"
                            }
                            alt="Profile Pic"
                          />
                          <h1 className="text-md text-gray-300 text-center">
                            {req.username}
                          </h1>
                          <p className="text-sm text-gray-400 text-center">
                            {req.name}
                          </p>
                        </div>
                        <div className="flex gap-2 justify-around p-2">
                          <button
                            onClick={() =>
                              handleFriendAction({
                                profileId: req._id,
                                action: "accepted",
                              })
                            }
                            disabled={actionLoading}
                            className="flex-1 py-2 rounded-lg font-medium bg-gradient-to-r cursor-pointer from-blue-500 to-cyan-400 hover:opacity-90 disabled:opacity-60 transition-all"
                          >
                            {actionLoading ? "..." : "Accept"}
                          </button>
                          <button
                            onClick={() =>
                              handleFriendAction({
                                profileId: req._id,
                                action: "rejected",
                              })
                            }
                            disabled={actionLoading}
                            className="flex-1 py-2 rounded-lg font-medium cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 disabled:opacity-60 transition-all"
                          >
                            {actionLoading ? "..." : "Decline"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {showConfirmModal && <ConfirmModal />}
    </main>
  );
}
