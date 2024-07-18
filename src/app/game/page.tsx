"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

const Game = dynamic(() => import("@/components/Game/game"), {
  ssr: false,
});

const GamePage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Galactic Quest: Daily Challenge
      </h1>
      <Game />
    </div>
  );
};

export default GamePage;
