"use client";
import React from "react";
import { useUserStore } from "@/components/Store/userStore";
import axios from "axios";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

const Game = dynamic(() => import("@/components/Game/game"), {
  ssr: false,
});

const GamePage: NextPage = () => {
  const { user } = useUserStore();

  return (
    <div className="container mx-auto px-2 py-2">
      <Game />
    </div>
  );
};

export default GamePage;
