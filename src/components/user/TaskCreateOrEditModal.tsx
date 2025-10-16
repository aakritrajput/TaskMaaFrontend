'use client'

import { taskType } from "@/app/user/tasks/page";
import { useEffect, useState } from "react";

type modalParamType = {
    open: boolean;
    onClose: () => void;
    initial: Partial<taskType>;
    onSubmit: (data: Partial<taskType>) => Promise<void>;
}

export default function Modal({ open, onClose, initial, onSubmit }: modalParamType) {
  const [title, setTitle] = useState<string>(initial?.title || "");
  const [description, setDescription] = useState<string>(initial?.description || "");
  const [importance, setImportance] = useState<taskType['importance']>(initial?.importance || "low");
  const [dueDate, setDueDate] = useState<string>(initial?.dueDate ? initial.dueDate : "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setImportance(initial?.importance || "low");
    setDueDate(initial?.dueDate ? initial.dueDate.slice(0, 10) : "");
  }, [initial]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: Partial<taskType> = {
      ...initial,
      title: title.trim(),
      description: description.trim(),
      importance,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
    };
    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-[#50e8bd5d] to-slate-800/55 border border-white/6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-3">{initial?._id ? "Edit Task" : "Create Task"}</h3>
        <label className="block text-xs mb-2">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/8 mb-3" required />
        <label className="block text-xs mb-2">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/8 mb-3" rows={3} />
        <div className="flex gap-3 mb-3">
          <div>
            <label className="text-xs">Importance</label>
            <select value={importance} onChange={(e) => setImportance(e.target.value as taskType['importance'])} className="ml-2 p-1 rounded bg-[#00806fce] border border-white/8">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {initial?.type === "general" && (
            <div>
              <label className="text-xs">Due date *</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="ml-2 p-1 rounded bg-transparent border border-white/8" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="cursor-pointer px-3 py-1 rounded border">Cancel</button>
          <button type="submit" className="px-3 py-1 cursor-pointer rounded bg-[#00806fce]">{initial?._id ? "Save" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

