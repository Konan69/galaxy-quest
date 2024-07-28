"use client";
import React, { memo } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TasksComponent from "@/components/Tasks/Tasks";
import { GamesComponent } from "@/components/Games/Games";
import Coins from "@/components/Icons/Coins";

const EarnNav = memo(({ activeTab, setActiveTab }: any) => {
  return (
    <div
      className="mx-auto w-48 flex justify-around items-center z-50 rounded-3xl text-xs backdrop-filter 
                backdrop-blur-md 
                bg-opacity-40 bg-gray-700 opacity-90"
    >
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
});

EarnNav.displayName = "EarnNav";

const EarnPage = () => {
  const [activeTab, setActiveTab] = useState("game");

  return (
    <div className="bg-gray-900">
      <div className="sticky top-24 min-w-full px-24 ">
        <EarnNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="min-h-screen pt-28 px-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
          >
            {activeTab === "game" ? <GamesComponent /> : <TasksComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EarnPage;
