"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};
const faqs: FAQItem[] = [
  {
    question: "What exactly is TaskMaa?",
    answer:
      "TaskMaa isn’t just a to-do list — it’s a place to plan, track, and actually enjoy managing your work and ideas. From small daily tasks to bigger goals, it keeps everything in one place so you don’t have to jump between apps.",
  },
  {
    question: "Is TaskMaa free to use?",
    answer:
      "Right now, yes — it’s completely free. I want people to experience it without worrying about subscriptions. Later, there might be advanced plans, but the core features will stay accessible.",
  },
  {
    question: "Can I use TaskMaa on my phone?",
    answer:
      "Yes! TaskMaa works smoothly on phones, tablets, and desktops. It’s fully responsive, so you can check tasks, add new ones, or plan your day from anywhere — no extra app downloads needed.",
  },
  {
    question: "What features does TaskMaa have?",
    answer:
      "TaskMaa lets you create tasks, set deadlines, organize projects, track progress, get reminders, and even collaborate with others. Soon, AI tools will help you plan smarter and save time.",
  },
  {
    question: "Will my data be safe?",
    answer:
      "Absolutely. Your data stays private, stored securely, and never sold to anyone. I’ve made security a priority from day one.",
  },
  {
    question: "Can TaskMaa handle big projects?",
    answer:
      "Yes — whether it’s a quick grocery list or a multi-step work project. You can break big tasks into smaller ones, track your progress, and keep everything neat and manageable.",
  },
  {
    question: "Will TaskMaa have AI features?",
    answer:
      "That’s the plan! Things like auto-prioritizing your tasks, suggesting schedules, and helping you break down complex projects are on the way.",
  },
  {
    question: "How is TaskMaa different from other task managers?",
    answer:
      "Many apps are either too plain or overloaded with features you’ll never use. TaskMaa is built to be simple, quick to set up, and powerful enough to actually make a difference in your day.",
  },
  {
    question: "Can I suggest new features?",
    answer:
      "Definitely. TaskMaa is growing, and the best ideas often come from people using it every day. If something can make it better, I want to hear it.",
  },
];


export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent mb-10 drop-shadow-sm">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/20 rounded-xl overflow-hidden bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left text-white font-medium hover:bg-white/10 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${
                    openIndex === index ? "rotate-180 text-teal-300" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-5 pt-2 text-teal-50 border-t border-white/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
