"use client";
import React from "react";
import { useGetUser } from "@/hooks/useCache";
import { useInitData } from "@telegram-apps/sdk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserQuery } from "@/lib/queries";
import Navbar from "@/components/Navbar";

const Leaderboard = () => {
  const user = useGetUser();
  return (
    <>
      <div className="w-full max-w-md mx-auto space-y-4">
        <div className="w-full pt-8 pb-6 flex justify-center text-3xl font-bold">
          Leaderboard
        </div>

        <Card className=" border-none text-white">
          <CardHeader className="p-0 bg-Lbcard">
            <div className="space-y-2 border-bgdark border-2">
              <div className="flex justify-between text-lg px-6 py-4 ">
                <span>Rank</span>
                <span>Username</span>
                <span>Points</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-96 bg-tasks rounded-none">
            <div> Coming soon...</div>
          </CardContent>
        </Card>
        <div className="px-4">
          <Card className="bg-tasks bg-opacity-70 border-none rounded-3xl text-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-normal">-</div>
                <div className="flex flex-col items-center">
                  <div className=" font-light">
                    {user?.username.charAt(0).toUpperCase() +
                      user?.username.slice(1)!}
                  </div>
                </div>
                <div className=" font-light">{user?.points}</div>
              </div>
            </CardContent>
          </Card>
          {/* <div className="text-sm">Invites: {user?.invites}</div> */}
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default Leaderboard;
