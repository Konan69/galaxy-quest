"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TasksComponent from "@/components/Tasks/Tasks";
import Coins from "@/components/Icons/Coins";
import { GamesComponent } from "@/components/Games/Games";

const EarnNav = ({ activeTab, setActiveTab }: any) => {
  return (
    <div
      className="fixed py-1 top-20 left-1/2 transform -translate-x-1/2 w-[calc(65%-2rem)] flex justify-around items-center z-50 rounded-3xl text-xs backdrop-filter 
                backdrop-blur-md 
                bg-opacity-40 bg-gray-700 opacity-90"
    >
      <button
        onClick={() => setActiveTab("game")}
        className={`text-center w-1/4 ${activeTab === "game" ? "text-white" : "text-[#85827d]"}`}
      >
        <Coins className="w-6 h-6 mx-auto" />
        <p className="mt-1">Arcade</p>
      </button>
      <button
        onClick={() => setActiveTab("tasks")}
        className={`text-center w-1/4 ${activeTab === "tasks" ? "text-white" : "text-[#85827d]"}`}
      >
        <Coins className="w-6 h-6 mx-auto" />
        <p className="mt-1">Tasks</p>
      </button>
    </div>
  );
};

const EarnPage = () => {
  const [activeTab, setActiveTab] = useState("game");

  return (
    <div className=" bg-gray-900">
      <EarnNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-h-screen pt-32 px-4">
        <AnimatePresence mode="wait">
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
