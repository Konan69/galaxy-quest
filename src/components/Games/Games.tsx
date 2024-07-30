import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Bone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Games = [
  {
    icon: Rocket,
    text: "Galaxy Adventure",
    action: "Start",
  },
];

export const GameItems = ({ icon: Icon, text, action }: any) => {
  const router = useRouter();

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-700 p-2 rounded-full">
            <Icon className="text-purple-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-white text-base font-semibold">{text}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/game")}
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};
export const GamesComponent = () => {
  return (
    <div className="h-full overflow-y-hidden bg-gray-900 text-white p-8">
      {/* <h1 className="text-2xl font-bold mb-6">Games</h1> */}
      <div>
        {Games.map((game, index) => (
          <GameItems key={index} {...game} />
        ))}
      </div>
    </div>
  );
};
