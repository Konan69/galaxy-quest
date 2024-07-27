import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dog, Send, Users, Bone } from "lucide-react";
import { useUserStore } from "@/components/Store/userStore";
import { useUpdateTaskMutation } from "@/mutations/mutations";

const tasks = [
  {
    id: "EarlyReward",
    icon: Dog,
    text: "Early Reward",
    reward: 50,
    action: "Claim",
  },
  {
    id: "SubTgram",
    icon: Send,
    text: "Subscribe to Galaxy Quest channel",
    reward: +100,
    action: "Start",
  },
  {
    id: "Invite5",
    icon: Users,
    text: "Invite 5 friends to Galaxy Quest",
    reward: 20000,
    action: "Check",
  },
];

const TaskItem = ({
  icon: Icon,
  text,
  reward,
  action,
  onAction,
}: {
  icon: any;
  text: string;
  reward: number;
  action: string;
  onAction: () => void;
}) => (
  <Card className="bg-gray-800 border-gray-700 mb-4">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-700 p-2 rounded-full">
          <Icon className="text-purple-500 w-6 h-6" />
        </div>
        <div>
          <p className="text-white font-semibold">{text}</p>
          <p className="text-purple-500">+{reward} Points</p>
        </div>
      </div>
      <Button
        variant={action === "Check" ? "outline" : "default"}
        className={
          action === "Check"
            ? "bg-transparent text-white border-purple-500 hover:bg-purple-500 hover:text-white"
            : "bg-purple-500 text-white hover:bg-purple-600"
        }
        onClick={onAction}
      >
        {action}
      </Button>
    </CardContent>
  </Card>
);

const TasksComponent = () => {
  const updateTask = useUpdateTaskMutation();
  const { user: storeUser, setUser } = useUserStore();
  const handleTaskAction = (task: any) => {
    if (task.id === "EarlyReward") {
      window.open(
        "https://twitter.com/intent/follow?screen_name=GalaxyQuestNFT",
        "_blank",
      );
      updateTask.mutate({
        taskId: task.id,
        username: storeUser?.username!,
        points: task.reward,
      });
    }
    // Handle other tasks here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* <h1 className="text-2xl font-bold mb-6">Tasks</h1> */}
      <div>
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            {...task}
            onAction={() => handleTaskAction(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksComponent;
