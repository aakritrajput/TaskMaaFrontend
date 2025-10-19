"use client";

import { RootState } from "@/src/lib/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";

// --- Types ---
type Importance = "low" | "medium" | "high";
type GroupType = "private" | "public";

export type Member = {
  id: string;
  name: string;
  username: string;
  profilePic?: string;
  isFriend?: boolean;
};

export type GroupTaskFormData = {
  title: string;
  description: string;
  type: GroupType;
  dueDate: string; // ISO date string
  importance: Importance;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: GroupTaskFormData & { members: Member['id'][] }) => void;
  editData?: (GroupTaskFormData & { members: Member[] }) | null;
  friendsList: Member[]; // our friends
  publicMembers?: Member[]; // existing public members when editing a public group
};

export default function TwoStepGroupTaskOverlay({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
  friendsList,
  publicMembers = [],
}: Props) {
  // internal step state
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>(editData?.members || []);
  const initialCandidates = editData?.type == 'public' ? [...friendsList, ...publicMembers] : [...friendsList]
  const [allCandidates, setAllCandidates] = useState<Member[]>(initialCandidates);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const user = useSelector((state: RootState) => state.auth.user)
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<GroupTaskFormData>({
    defaultValues: editData || {
      title: "",
      description: "",
      type: "private",
      dueDate: "",
      importance: "medium",
    },
  });

  const watchedType = watch("type");
  console.log('watchType: ', watchedType)
  useEffect(() => {
    if (watchedType === "public") {
      setAllCandidates((prev) => {
        const combined = [
          ...friendsList,
          ...publicMembers.filter((m) => !friendsList.some((f) => f.id === m.id)),
        ];
        // Only update if actually changed
        const isSame =
          prev.length === combined.length &&
          prev.every((p, i) => p.id === combined[i].id);
        return isSame ? prev : combined;
      });
    } else {
      setAllCandidates((prev) => {
        const isSame =
          prev.length === friendsList.length &&
          prev.every((p, i) => p.id === friendsList[i].id);
        return isSame ? prev : friendsList;
      });
    }
  }, [watchedType, friendsList, publicMembers]);


  // when editData changes, reset form and members
  useEffect(() => {
    if (editData) {
      reset(editData);
      setSelectedMembers(editData.members || []);
      setStep(1);
    }
  }, [editData, reset]);

  useEffect(() => {
    if (!isOpen) {
      // cleanup when modal closes
      setTimeout(() => {
        setStep(1);
      }, 200);
    }
  }, [isOpen]);

  function pushToast(text: string) {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((t) => [{ id, text }, ...t].slice(0, 5));
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2200);
  }

  function addMember(m: Member) {
    if (selectedMembers.some((x) => x.id === m.id)) return;
    setSelectedMembers((s) => [...s, m]);
    pushToast(`${m.name} added`);
  }
  function removeMember(id: string) {
    const removed = selectedMembers.find((s) => s.id === id);
    setSelectedMembers((s) => s.filter((x) => x.id !== id));
    if (removed) pushToast(`${removed.name} removed`);
  }

  const onFinalSubmit: SubmitHandler<GroupTaskFormData> = (data) => {
    const idsOfSelectedMembers = selectedMembers.map((member) => member.id)
    onSubmit({ ...data, members: user ? [...idsOfSelectedMembers, user._id] : idsOfSelectedMembers });
    pushToast(data.title ? `"${data.title}" saved` : "Task saved");
    // will reset only when creating new (if editing we might want to keep state externally)
    // close modal shortly after
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/90 items-center justify-center">

      {/* toasts */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 z-60">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-3 py-1 rounded-full text-sm bg-teal-600/90 text-white shadow-lg glassy"
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* centered glass card */}
      <div className="relative w-[95%] max-w-3xl mx-auto">
        <div className="mx-auto overflow-y-auto scrollable-div rounded-2xl bg-[rgba(10,20,30,0.6)] min-h-[200px] border border-[rgba(255,255,255,0.04)] shadow-2xl px-6 pt-10 pb-16 glass-effect">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{editData ? "Edit Group Task" : "Create Group Task"}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-md text-sm bg-transparent border border-transparent hover:border-white/10"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </header>

          <main>
            {/* Step container with CSS slide/fade */}
            <div className="relative min-h-[420px]">
              {/* Step 1 */}
              <section
                className={`absolute inset-0 transition-transform duration-300 ease-in-out ${step === 1 ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0 pointer-events-none"}`}
                aria-hidden={step !== 1}
              >
                <form
                  onSubmit={handleSubmit(() => setStep(2))}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-slate-200 mb-1">Title *</label>
                    <input
                      {...register("title", { required: 'Title is required !!' })}
                      className="w-full rounded-lg px-3 py-2 bg-gradient-to-b from-[#062e2e] to-[#04252a] border border-transparent focus:border-teal-400 outline-none text-white"
                      placeholder="Add a short title"
                    />
                    {errors.title && (
                      <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-200 mb-1">Description</label>
                    <textarea
                      {...register("description", { required: false })}
                      className="w-full rounded-lg px-3 py-2 h-28 bg-gradient-to-b from-[#062e2e] to-[#04252a] border border-transparent focus:border-teal-400 outline-none text-white resize-none"
                      placeholder="Describe the task in a few lines"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-200 mb-1">Type *</label>
                      <div className="flex gap-3 items-center">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="private" {...register("type")} defaultChecked={editData ? editData.type == 'private' : true} className="accent-teal-400" />
                          <span className="text-sm text-slate-200">Private</span>
                        </label>

                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="public" {...register("type")} defaultChecked={editData?.type == 'public'} className="accent-teal-400" />
                          <span className="text-sm text-slate-200">Public</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-200 mb-1">Due date *</label>
                      <input
                        type="date"
                        {...register("dueDate", {required: 'Please Provide a due date !!'})}
                        className="w-full rounded-lg px-3 py-2 bg-gradient-to-b from-[#062e2e] to-[#04252a] border border-transparent focus:border-teal-400 outline-none text-white"
                      />
                      {errors.dueDate && (
                        <p className="text-xs text-red-400 mt-1">{errors.dueDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-200 mb-1">Importance</label>
                    <div className="flex gap-3 items-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="low" {...register("importance")} defaultChecked={editData?.importance == 'low'} className="accent-teal-300" />
                        <span className="text-sm text-slate-200">Low</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="medium" {...register("importance")} defaultChecked={editData ? editData.importance == 'medium' : true} className="accent-teal-400" />
                        <span className="text-sm text-slate-200">Medium</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="high" {...register("importance")} defaultChecked={editData?.importance == 'high'} className="accent-teal-500" />
                        <span className="text-sm text-slate-200">High</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-[rgba(255,255,255,0.04)] text-slate-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-[#00d2a3] to-[#06a3c6] text-black font-semibold shadow-neon">Next</button>
                  </div>
                </form>
              </section>

              {/* Step 2 */}
              <section
                className={`absolute inset-0 transition-transform duration-300 ease-in-out ${step === 2 ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0 pointer-events-none"}`}
                aria-hidden={step !== 2}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.length === 0 && <div className="text-sm text-slate-400">No members added yet</div>}
                    {selectedMembers.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] px-3 py-1 rounded-full">
                        <Image width={20} height={20} src={m.profilePic ? m.profilePic : '/profile/default_profile_pic.png'} alt={m.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-slate-200">{m.name}</span>
                        <button onClick={() => removeMember(m.id)} className="ml-2 text-xs text-red-300">✕</button>
                      </div>
                    ))}
                  </div>

                  <div className="max-h-56 overflow-auto py-2">
                    <div className="space-y-2">
                      {allCandidates.map((member) => {
                        const added = selectedMembers.some((s) => s.id === member.id);
                        return (
                          <div key={member.id} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Image width={30} height={30} src={member.profilePic ? member.profilePic : '/profile/default_profile_pic.png'} alt={member.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <div className="text-slate-200 font-medium">{member.name}</div>
                                <div className="text-xs text-slate-400">@{member.username} {member.isFriend ? "(friend)" : "(public)"}</div>
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => (added ? removeMember(member.id) : addMember(member))}
                                className={`px-3 py-1 rounded-md font-medium ${added ? "bg-transparent border border-red-400 text-red-300" : "bg-gradient-to-r from-[#00d2a3] to-[#06a3c6] text-black"}`}
                              >
                                {added ? "Remove" : "Add"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button onClick={() => setStep(1)} className="px-4 py-2 rounded-md bg-transparent border border-[rgba(255,255,255,0.04)] text-slate-300">Back</button>
                    <div className="flex items-center gap-3">
                      <button onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-[rgba(255,255,255,0.04)] text-slate-300">Cancel</button>
                      <button onClick={handleSubmit(onFinalSubmit)} className="px-4 py-2 rounded-md bg-gradient-to-r from-[#00d2a3] to-[#06a3c6] text-black font-semibold shadow-neon">{editData ? "Update" : "Create"}</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* small style block for shadows/glass */}
      <style>{`
        .glassy { backdrop-filter: blur(6px); }
        .shadow-neon { box-shadow: 0 6px 20px rgba(0,210,163,0.12), 0 2px 6px rgba(6,163,198,0.08); }
        .glass-effect { background: linear-gradient(135deg, rgba(2,50,50,0.42), rgba(4,37,47,0.6)); }
      `}</style>
    </div>
  );
}
