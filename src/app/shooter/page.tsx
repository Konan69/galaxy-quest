"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

const Game = dynamic(() => import("@/components/Game/game"), {
  ssr: false,
});

const GamePage: NextPage = () => {
  return (
    <div className="container mx-auto px-2 py-2">
      <Game />
    </div>
  );
};

export default GamePage;
