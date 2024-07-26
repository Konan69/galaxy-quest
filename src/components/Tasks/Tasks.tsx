import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dog, Send, Users, Bone } from "lucide-react";

const tasks = [
  { icon: Dog, text: "Early Reward", reward: "+50 Points", action: "Check" },
  {
    icon: Send,
    text: "Subscribe to Galaxy Quest channel",
    reward: "+100 POINTS",
    action: "Start",
  },
  {
    icon: Users,
    text: "Invite 5 friends to Galaxy Quest",
    reward: "+20000 POINTS",
    action: "Check",
  },
  {
    icon: Bone,
    text: "Send 🦴 to Binance X.com",
    reward: "+100 DOGS",
    action: "Start",
  },
  {
    icon: Bone,
    text: "Send 🦴 to OKX X.com",
    reward: "+100 DOGS",
    action: "Start",
  },
];

const TaskItem = ({ icon: Icon, text, reward, action }: any) => (
  <Card className="bg-gray-800 border-gray-700 mb-4">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-700 p-2 rounded-full">
          <Icon className="text-purple-500 w-6 h-6" />
        </div>
        <div>
          <p className="text-white font-semibold">{text}</p>
          <p className="text-purple-500">{reward}</p>
        </div>
      </div>
      <Button
        variant={action === "Check" ? "outline" : "default"}
        className={
          action === "Check"
            ? "bg-transparent text-white border-purple-500 hover:bg-purple-500 hover:text-white"
            : "bg-purple-500 text-white hover:bg-purple-600"
        }
      >
        {action}
      </Button>
    </CardContent>
  </Card>
);

const TasksComponent = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* <h1 className="text-2xl font-bold mb-6">Tasks</h1> */}
      <div>
        {tasks.map((task, index) => (
          <TaskItem key={index} {...task} />
        ))}
      </div>
    </div>
  );
};

export default TasksComponent;
