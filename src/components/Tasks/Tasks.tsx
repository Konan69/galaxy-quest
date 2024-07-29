import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dog,
  Send,
  Users,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useTelegramId, useUserStore } from "@/components/Store/userStore";
import {
  useMembershipCheck,
  useUpdateTaskMutation,
} from "@/mutations/mutations";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "../ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
    reward: 100,
    action: "Claim",
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
  completed = false,
}: {
  icon: any;
  text: string;
  reward: number;
  action: string;
  onAction: () => void;
  completed?: boolean;
}) => (
  <Card
    className={`mb-4 ${completed ? "bg-gray-700" : "bg-gray-800"} border-gray-700`}
  >
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-full ${completed ? "bg-green-700" : "bg-gray-700"}`}
        >
          <Icon
            className={`w-6 h-6 ${completed ? "text-green-300" : "text-purple-500"}`}
          />
        </div>
        <div>
          <p className="text-white text-base font-semibold">{text}</p>
          <p className={`${completed ? "text-green-300" : "text-purple-500"}`}>
            +{reward} Points
          </p>
        </div>
      </div>
      {!completed && (
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
      )}
      {completed && <CheckCircle className="text-green-500 w-6 h-6" />}
    </CardContent>
  </Card>
);

const TasksComponent = () => {
  const { toast } = useToast();
  const updateTask = useUpdateTaskMutation();
  const demoGroup = 1002175023524;
  const { user: storeUser, setUser } = useUserStore();
  const { telegramId } = useTelegramId();
  const [isOpen, setIsOpen] = React.useState(false);
  const membershipCheck = useMembershipCheck({
    userId: telegramId!,
    groupId: demoGroup,
  });

  const taskUpdater = (task: any) => {
    updateTask.mutate(
      {
        taskId: task.id,
        username: storeUser?.username!,
        points: task.reward,
      },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Task completed",
            description: `+${task.reward} points`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to complete task",
            description:
              "There was an error completing the task. Please try again.",
          });
        },
      },
    );
  };

  const checkMember = (task: any) =>
    membershipCheck.data?.isMember
      ? taskUpdater(task)
      : toast({
          variant: "default",
          description: "You have not joined the channel",
        });

  if (membershipCheck.error) {
    toast({
      variant: "destructive",
      title: "Failed to check membership",
      description: `${membershipCheck.error.message}`,
    });
    console.error(membershipCheck.error);
    return;
  }

  const handleTaskAction = (task: any) => {
    if (task.id === "EarlyReward") {
      window.open(
        "https://twitter.com/intent/follow?screen_name=GalaxyQuestNFT",
        "_blank",
      );
      setTimeout(() => taskUpdater(task), 5000);
    }
    if (task.id === "Invite5") {
      storeUser?.invites! >= 5
        ? taskUpdater(task)
        : toast({
            variant: "default",
            description: "invite at least 5 people to complete the task.",
          });
    }
    if (task.id === "SubTgram") {
      // -1002175023524;
      checkMember(task);
    }
  };
  // Handle other tasks here
  const pendingTasks = tasks.filter(
    (task) => !storeUser?.tasks?.[task.id as keyof typeof storeUser.tasks],
  );
  const completedTasks = tasks.filter(
    (task) => storeUser?.tasks?.[task.id as keyof typeof storeUser.tasks],
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-white p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
        {pendingTasks.map((task, index) => (
          <TaskItem
            key={index}
            {...task}
            onAction={() => handleTaskAction(task)}
            completed={false}
          />
        ))}
      </div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h2 className="text-xl font-bold">Completed Tasks</h2>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-purple-500 w-9 p-0"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {completedTasks.map((task, index) => (
            <TaskItem
              key={index}
              {...task}
              onAction={() => {}}
              completed={true}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Toaster />
    </div>
  );
};

export default TasksComponent;
