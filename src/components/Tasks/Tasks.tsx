import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dog,
  Send,
  Users,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Wallet,
} from "lucide-react";
import { useTelegramId, useUserStore } from "@/components/Store/userStore";
import {
  useMembershipCheck,
  useSetWalletMutation,
  useUpdateTaskMutation,
} from "@/mutations/mutations";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "../ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  TonConnectButton,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";

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
  {
    id: "ConnectWallet",
    icon: Wallet,
    text: "Connect wallet",
    reward: 2000,
    action: "Connect",
  },
];

const TaskItem = ({
  icon: Icon,
  text,
  reward,
  action,
  onAction,
  completed = false,
  isWalletTask = false,
}: {
  icon: any;
  text: string;
  reward: number;
  action: string;
  onAction: () => void;
  completed?: boolean;
  isWalletTask?: boolean;
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
      {!completed &&
        (isWalletTask ? (
          <TonConnectButton />
        ) : (
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
        ))}
      {completed && <CheckCircle className="text-green-500 w-6 h-6" />}
    </CardContent>
  </Card>
);

const TasksComponent = () => {
  const { toast } = useToast();
  const updateTask = useUpdateTaskMutation();
  const updateWallet = useSetWalletMutation();
  const demoGroup = -1002175023524;
  const { user: storeUser, setUser } = useUserStore();
  const { telegramId } = useTelegramId();
  const [isOpen, setIsOpen] = React.useState(false);
  const membershipCheck = useMembershipCheck({
    userId: telegramId!,
    groupId: demoGroup,
  });
  const wallet = useTonWallet();
  const address = useTonAddress();
  const walletUpdated = useRef(false);

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
      checkMember(task);
    }
  };

  useEffect(() => {
    if (wallet && !walletUpdated.current && !storeUser?.tasks?.ConnectWallet) {
      walletUpdated.current = true;
      const connectWalletTask = tasks.find(
        (task) => task.id === "ConnectWallet",
      );
      if (connectWalletTask) {
        updateWallet.mutate(
          {
            username: storeUser?.username!,
            wallet: wallet.account.publicKey?.toString()!,
          },
          {
            onSuccess: () => {
              taskUpdater(connectWalletTask);
            },
            onError: () => {
              walletUpdated.current = false;
              toast({
                variant: "destructive",
                title: "Failed to update wallet",
                description:
                  "There was an error updating your wallet. Please try again.",
              });
            },
          },
        );
      }
    }
  }, [wallet, storeUser]);

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
            isWalletTask={task.id === "ConnectWallet"}
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
      <div>Address is {address}</div>

      <Toaster />
    </div>
  );
};

export default TasksComponent;
