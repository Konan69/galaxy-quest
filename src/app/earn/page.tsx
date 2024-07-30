"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TasksComponent from "@/components/Tasks/Tasks";
import { GamesComponent } from "@/components/Games/Games";
import Coins from "@/components/Icons/Coins";

const EarnNav = memo(
  ({
    activeTab,
    setActiveTab,
  }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }) => {
    return (
      <div className="mx-auto w-48 flex justify-around items-center rounded-3xl text-xs backdrop-filter backdrop-blur-md bg-opacity-40 bg-gray-700 opacity-90">
        <button
          onClick={() => setActiveTab("game")}
          className={`text-center w-1/2 ${activeTab === "game" ? "text-white bg-purple-500 rounded-l-3xl" : "text-[#85827d]"}`}
        >
          <Coins className="w-6 h-6 mx-auto" />
          <p className="mt-1">Arcade</p>
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`text-center w-1/2 ${activeTab === "tasks" ? "text-white bg-purple-500 rounded-r-3xl" : "text-[#85827d]"}`}
        >
          <Coins className="w-6 h-6 mx-auto" />
          <p className="mt-1">Tasks</p>
        </button>
      </div>
    );
  },
);

EarnNav.displayName = "EarnNav";

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const EarnPage = () => {
  const [[activeTab, direction], setActiveTab] = useState(["game", 0]);

  const paginate = (newDirection: number) => {
    setActiveTab([newDirection === 1 ? "tasks" : "game", newDirection]);
  };

  return (
    <div className="bg-gray-900">
      <div className="min-w-full mx-auto pt-16">
        <EarnNav
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab([tab, tab === "game" ? -1 : 1])}
        />
      </div>
      <div className="max-h-full pt-26 overflow-auto">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            {activeTab === "game" ? <GamesComponent /> : <TasksComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EarnPage;
