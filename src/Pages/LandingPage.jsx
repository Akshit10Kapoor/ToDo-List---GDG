import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Grid3X3,
  Users,
  BarChart3,
  Play,
} from "lucide-react";

// Pastel-first landing that matches your Todo page vibe (blurred blobs, cards, subtle motion)
// Color palette restricted to *-100 / *-200 intensities per your request.
// Hook up the primary CTA (onClick / href) to your auth flow; navigate to the main Todo page after login.

const TaskFlowLanding = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const id = setInterval(
      () => setFeatureIdx((i) => (i + 1) % features.length),
      2800
    );
    return () => clearInterval(id);
  }, []);

  const features = [
    {
      icon: Grid3X3,
      title: "Organize beautifully",
      desc: "Cards, sections, and flows that stay out of your way.",
      bg: "bg-blue-100",
    },
    {
      icon: BarChart3,
      title: "See progress clearly",
      desc: "Gentle analytics to nudge tasks to done.",
      bg: "bg-green-100",
    },
    {
      icon: Users,
      title: "Focus as a team",
      desc: "Shared priorities without the noise.",
      bg: "bg-purple-100",
    },
  ];

  const container = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, duration: 0.6, ease: "easeOut" },
    },
  };

  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Pastel floating blobs (matches your main page language) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-36 -right-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" />
        <div
          className="absolute -bottom-40 -left-24 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute top-1/3 left-1/5 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-pulse"
          style={{ animationDelay: "2.4s" }}
        />
      </div>

      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-gray-700" />
          </div>
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
            href="#features"
          >
            Features
          </a>
          
          <button className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-blue-100">
            Sign in
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <header className="relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isMounted ? "show" : "hidden"}
          className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16 lg:gap-16"
        >
          {/* Left */}
          <motion.div variants={item} className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-gray-800">
              <Play className="h-4 w-4" /> Quick, thoughtful, calm
            </div>
            <h1 className="text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              Organize. Focus.{" "}
              <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Finish.
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-600">
              A refined workspace for todos and projects. Gentle visuals, zero
              clutter, and just enough data to keep momentum.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#login" // Hook to your auth route
                className="group inline-flex items-center justify-center rounded-xl border border-green-200 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition hover:bg-green-100"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition hover:bg-purple-100"
              >
                Explore features
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-lg bg-pink-100" />
              <div className="h-8 w-8 rounded-lg bg-yellow-100" />
              <div className="h-8 w-8 rounded-lg bg-red-100" />
              <span className="text-sm text-gray-600">
                Pastel-first, distraction-free UI
              </span>
            </div>
          </motion.div>

          {/* Right: floating preview card */}
          <motion.div
            variants={item}
            className="relative mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-blue-100 to-purple-100 blur-2xl" />
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Today</h3>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-blue-100 p-4">
                    <p className="text-xs text-gray-600">Active projects</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="rounded-xl bg-green-100 p-4">
                    <p className="text-xs text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-yellow-100 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-700">
                      <span>Website Redesign</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-yellow-200">
                      <div
                        className="h-2 rounded-full bg-yellow-200"
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl bg-purple-100 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-700">
                      <span>Mobile App</span>
                      <span>60%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-purple-200">
                      <div
                        className="h-2 rounded-full bg-purple-200"
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini feature carousel chips */}
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 p-2 shadow-sm backdrop-blur">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={featureIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${features[featureIdx].bg}`}
                    >
                      {React.createElement(features[featureIdx].icon, {
                        className: "h-4 w-4 text-gray-700",
                      })}
                    </div>
                    <div className="pr-1 text-sm">
                      <p className="font-semibold text-gray-900">
                        {features[featureIdx].title}
                      </p>
                      <p className="-mt-0.5 text-gray-600">
                        {features[featureIdx].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Highlights */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-16"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ">
          {[
            {
              Icon: Grid3X3,
              title: "Structure that feels natural",
              desc: "Projects, lists and priorities without ceremony.",
              bg: "bg-blue-100",
            },
            {
              Icon: BarChart3,
              title: "Progress without pressure",
              desc: "Lightweight charts and activity cues.",
              bg: "bg-yellow-100",
            },
            {
              Icon: CheckCircle2,
              title: "Stay on top of tasks",
              desc: "Clear priorities and calm reminders keep you focused.",
              bg: "bg-pink-100",
            },
          ].map(({ Icon, title, desc, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`rounded-2xl ${bg} p-6 shadow-sm hover:shadow-lg cursor-pointer`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow">
                <Icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-gray-700">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-green-100 to-blue-100 p-8 shadow-xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Ready to move from list to done?
              </h2>
              <p className="mt-1 text-gray-700">
                Sign in to keep your momentum. It takes seconds.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#login"
                className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm transition hover:bg-blue-100"
              >
                Sign in
              </a>
              
            </div>
          </div>
        </div>
      </section>

      {/* subtle scroll cue at bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-10 hidden items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-700 shadow-sm backdrop-blur md:flex">
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100"
        >
          ↑
        </motion.span>
      </div>
    </div>
  );
};

export default TaskFlowLanding;
