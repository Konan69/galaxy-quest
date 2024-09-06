"use client";

import React from "react";

import TasksComponent from "@/components/Tasks";
import { GamesComponent } from "@/components/Games/Games";
import Navbar from "@/components/Navbar";

const EarnPage = () => {
  return (
    <>
      <div className="max-h-full pt-26 overflow-auto text-white">
        <div className="text-center py-8">
          <h1 className="text-3xl py-4 font-bold">Galaxy Earn</h1>
          <p className="text-lg text-gray-300">
            Play games and complete tasks to earn<br></br> galaxy points and
            level up
          </p>
        </div>
        <GamesComponent />
        <TasksComponent />
      </div>
      <Navbar />
    </>
  );
};

export default EarnPage;
