import "dotenv/config";
import mongoose from "mongoose";
import { format, subDays } from "date-fns";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import AI from "../models/AiInsights.js";

const EMAIL = "chkrishna6590@gmail.com";
const PASSWORD = "Pricng@7843";
const NAME = "Krishnakumar Chaurashiya";

const HABITS = [
  {
    name: "Solve 2 DSA questions",
    description:
      "Solve array, string, or dynamic programming problems on LeetCode/CodeChef.",
    category: "Learning",
    frequency: "daily",
    targetDays: 7,
    color: "#2563eb",
    icon: "💻",
    _streakProb: 0.85,
  },
  {
    name: "Interview prep review",
    description:
      "Revise core concepts like DBMS, Computer Networks, Operating Systems, or system design.",
    category: "Learning",
    frequency: "daily",
    targetDays: 5,
    color: "#7c3aed",
    icon: "📝",
    _streakProb: 0.75,
    _pattern: "weekdays",
  },
  {
    name: "Drink 2L of water",
    description:
      "Stay hydrated throughout the day to sustain long coding sessions.",
    category: "Health",
    frequency: "daily",
    targetDays: 7,
    color: "#0ea5e9",
    icon: "💧",
    _streakProb: 0.95,
  },
  {
    name: "Full-stack development coding",
    description:
      "Dedicate focused time to build web apps using React, Node.js, and MongoDB.",
    category: "Productivity",
    frequency: "daily",
    targetDays: 6,
    color: "#10b981",
    icon: "🚀",
    _streakProb: 0.8,
    _pattern: "custom",
    _brokeAt: 15,
  },
  {
    name: "Aptitude & logical reasoning",
    description:
      "Practice quantitative aptitude questions for competitive placement tests.",
    category: "Learning",
    frequency: "daily",
    targetDays: 5,
    color: "#f59e0b",
    icon: "🧩",
    _streakProb: 0.7,
    _pattern: "weekdays",
  },
  {
    name: "UI/UX & CSS styling practice",
    description:
      "Experiment with custom CSS animations, Tailwind features, or frontend component layouts.",
    category: "Creative",
    frequency: "weekly",
    targetDays: 2,
    color: "#ec4899",
    icon: "🎨",
    _streakProb: 0.9,
  },
  {
    name: "Morning run or light exercise",
    description:
      "Clear the mind with physical activity before jumping into screen time.",
    category: "Fitness",
    frequency: "daily",
    targetDays: 5,
    color: "#ef4444",
    icon: "🏃‍♂️",
    _streakProb: 0.65,
    _pattern: "weekdays",
    _brokeAt: 10,
  },
  {
    name: "Read tech documentation or blogs",
    description:
      "Spend time reading system designs, technical API specs, or engineering articles.",
    category: "Learning",
    frequency: "weekly",
    targetDays: 3,
    color: "#4b5563",
    icon: "📚",
    _streakProb: 0.85,
  },
  {
    name: "Revise Git and open-source workflow",
    description:
      "Commit code, clean up branches, push changes, and maintain GitHub project hygiene.",
    category: "Productivity",
    frequency: "weekly",
    targetDays: 2,
    color: "#1f2937",
    icon: "🐙",
    _streakProb: 0.9,
  },
  {
    name: "Mindfulness & deep breathing",
    description:
      "Take a break to reduce stress and maintain absolute focus under deadlines.",
    category: "Mindfulness",
    frequency: "daily",
    targetDays: 7,
    color: "#14b8a6",
    icon: "🧘‍♂️",
    _streakProb: 0.95,
  },
  {
    name: "Track budget and expenses",
    description:
      "Log daily spending and track mutual fund or investment charts.",
    category: "Finance",
    frequency: "weekly",
    targetDays: 1,
    color: "#059669",
    icon: "📊",
    _streakProb: 0.98,
  },
  {
    name: "Mock interview practice",
    description:
      "Participate in peer-to-peer behavioral or technical mock interview sessions.",
    category: "Social",
    frequency: "weekly",
    targetDays: 2,
    color: "#ea580c",
    icon: "🤝",
    _streakProb: 0.75,
    _brokeAt: 5,
  },
  {
    name: "Limit screen time before bed",
    description:
      "Turn off active development servers and step away from screens 30 minutes before sleep.",
    category: "Health",
    frequency: "daily",
    targetDays: 7,
    color: "#6366f1",
    icon: "🌙",
    _streakProb: 0.6,
  },
];

const todayKey = () => format(new Date(), "yyyy-MM-dd");

const buildLogs = (habit, totalDays = 90) => {
  const logs = [];
  const today = new Date();

  for (let i = 0; i < totalDays; i++) {
    const d = subDays(today, i);
    const dow = d.getDay();
    const key = format(d, "yyyy-MM-dd");
    let p = habit._streakProb;

    if (habit._pattern === "weekdays") {
      if (dow === 0 || dow === 6) p *= 0.35;
    }

    if (habit._pattern === "dropoff") {
      if (i < 14) p *= 0.25;
    }

    if (habit._brokeAt && i >= habit._brokeAt - 2 && i <= habit._brokeAt + 2) {
      continue;
    }

    const seed = Math.sin(i * 9301 + habit.name.length * 49297) * 233280;
    const rnd = seed - Math.floor(seed);
    if (rnd < p) logs.push({ completedDate: key });
  }

  return logs;
};

const run = async () => {
  await connectDB();

  let user = await User.findOne({ email: EMAIL });
  if (user) {
    console.log(`Found existing user ${EMAIL} – clearing their data...`);
    await Habit.deleteMany({ userId: user._id });
    await HabitLog.deleteMany({ userId: user._id });
    await AIInsight.deleteMany({ userId: user._id });
    user.name = NAME;
    user.avatar = NAME.charAt(0).toUpperCase();
    user.morningMotivation = true;
    user.password = PASSWORD;
    await user.save();
  } else {
    user = await User.create({
      name: NAME,
      email: EMAIL,
      password: PASSWORD,
      avatar: NAME.charAt(0).toUpperCase(),
      morningMotivation: true,
    });
    console.log(`Created user ${EMAIL}`);
  }

  const createdHabits = [];
  for (let i = 0; i < HABITS.length; i++) {
    const h = HABITS[i];
    const habit = await Habit.create({
      userId: user._id,
      name: h.name,
      description: h.description,
      category: h.category,
      frequency: h.frequency,
      targetDays: h.targetDays,
      color: h.color,
      icon: h.icon,
      order: i,
      createdAt: subDays(new Date(), 89),
      updatedAt: subDays(new Date(), 89),
    });

    habit.createdAt = subDays(new Date(), 89);
    await habit.save({ timestamps: false });
    createdHabits.push({ habit, config: h });
  }

  let totalLogs = 0;
  for (const { habit, config } of createdHabits) {
    const logs = buildLogs(config);
    if (!logs.length) continue;
    const docs = logs.map((l) => ({
      userId: user._id,
      habitId: habit._id,
      completedDate: l.completedDate,
    }));
    await HabitLog.insertMany(docs, { ordered: false }).catch(() => {});
    totalLogs += docs.length;
  }

  const today = todayKey();
  const todayDoneHabits = createdHabits.slice(0, 4).map((c) => c.habit);
  for (const h of todayDoneHabits) {
    await HabitLog.updateOne(
      { userId: user._id, habitId: h._id, completedDate: today },
      {
        $setOnInsert: {
          userId: user._id,
          habitId: h._id,
          completedDate: today,
        },
      },
      { upsert: true },
    );
  }

  console.log(`\n✅ Seed complete`);
  console.log(`  User:      ${EMAIL}`);
  console.log(`  Password:  ${PASSWORD}`);
  console.log(`  Habits:    ${createdHabits.length}`);
  console.log(`  Logs:      ~${totalLogs}`);

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});