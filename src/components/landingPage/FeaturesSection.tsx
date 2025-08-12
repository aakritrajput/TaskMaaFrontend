import { Brain, Heart, Star, Users, Moon, MessageCircle  } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col rounded-[30px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_20px_rgba(47,203,163,0.25)] hover:shadow-[0_15px_40px_rgba(47,203,163,0.45)] transition-transform duration-500 hover:scale-[1.05] cursor-pointer max-w-md mx-auto">
      {/* Soft gradient blob behind icon */}
      <div
        className={`absolute -top-10 -left-10 w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${gradient}`}
      />
      
      {/* Icon in a soft glass circle */}
      <div className="relative z-10 flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-[#69f5c5]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-2xl font-semibold text-white mb-2 tracking-wide">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-gray-300 font-light text-base leading-relaxed ">
        {description}
      </p>
    </div>
  );
}


export default function FeaturesSection() {
  const features = [
  {
    icon: <Brain className="w-8 h-8 text-[#69f5c5]" />,
    title: "Task Management Engine",
    description:
      "Add, edit, prioritize, and track your tasks effortlessly — stay organized with status updates and due dates to keep you on top.",
    gradient: "from-green-400 to-blue-500",
  },
  {
    icon: <Heart className="w-8 h-8 text-[#69f5c5]" />,
    title: "Emotionally Aware AI Assistant",
    description:
      "Maa's intelligent emotional support guides and motivates you with personalized messages, gentle scolding, and weekly check-ins to keep you accountable.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Star className="w-8 h-8 text-[#69f5c5]" />,
    title: "Performance Tracking & Rewards",
    description:
      "Celebrate your wins with streak tracking, star achievements, respect points, and an emotional approval score that reflects Maa’s mood.",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: <Users className="w-8 h-8 text-[#69f5c5]" />,
    title: "Friend Collaboration & Competition",
    description:
      "Invite friends to share goals, chat, compete on tasks, and get AI-powered evaluations on who’s the most sincere and consistent.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <Moon className="w-8 h-8 text-[#69f5c5]" />,
    title: "Personalized Daily Rituals",
    description:
      "Start and end your day with Maa’s good morning/good night messages, motivational quotes, and self-reflection prompts to build lasting habits.",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    icon: <MessageCircle  className="w-8 h-8 text-[#69f5c5]" />,
    title: "MaaBot & Smart Notifications",
    description:
      "Interact with MaaBot’s GPT-powered chatbot and receive smart reminders and offline alerts designed to keep your motivation high.",
    gradient: "from-cyan-400 to-teal-500",
  },
];

//  const dotPatternSvg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <section className="relative py-24 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Why Choose TaskMaa?
          </h2>
          <p className="text-lg text-[#a0b8b8] max-w-xl mx-auto leading-relaxed">
            More than just a task manager — TaskMaa builds an emotional bond with your goals,
            making productivity personal, cozy, and rewarding.
          </p>
        </div>

        {/* Cozy Features Grid - flex wrap for organic layout */}
        <div className="flex flex-wrap justify-center gap-10">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <button
            className="inline-block px-12 py-4 rounded-full bg-gradient-to-r from-[#2fac81] to-[#69f5c5]
                       text-white font-semibold text-xl shadow-lg cursor-pointer
                       transition-shadow duration-400 hover:scale-105 font-['Jua']"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}