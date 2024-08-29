import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  Users,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Wallet,
  SparklesIcon,
} from "lucide-react";
import { useTelegramId } from "@/components/Store/userStore";
import { useGetUser } from "@/hooks/useCache";
import {
  useMembershipCheck,
  useSetWalletMutation,
  useUpdateTaskMutation,
} from "@/lib/queries";
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
  useTonConnectUI,
  SendTransactionRequest,
} from "@tonconnect/ui-react";

import X from "../Icons/X";
import Ton from "../Icons/Ton";

const tasks = [
  {
    id: "EarlyReward",
    icon: SparklesIcon,
    text: "Early Reward",
    reward: 2000,
    action: "Start",
  },
  {
    id: "FollowX",
    icon: X,
    text: "Follow Galaxy Quest on Twitter",
    reward: 3000,
    action: "Start",
  },
  {
    id: "SubTgram",
    icon: Send,
    text: "Subscribe to Galaxy Quest channel",
    reward: 2000,
    action: "Start",
  },

  {
    id: "Invite5",
    icon: Users,
    text: "Invite 5 friends to Galaxy Quest",
    reward: 10000,
    action: "Start",
  },
  {
    id: "ConnectWallet",
    icon: Wallet,
    text: "Connect wallet",
    reward: 1000,
    action: "Connect",
  },
  {
    id: "TX",
    icon: Ton,
    text: "Make a Ton Transaction",
    reward: 10000,
    action: "Start",
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
  text: string | any;
  reward: number;
  action: string;
  onAction: () => void;
  completed?: boolean;
  isWalletTask?: boolean;
}) => (
  <Card className={`mb-2 ${completed ? "bg-tasks" : "bg-tasks"} border-bgdark`}>
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
  const user = useGetUser();
  const { telegramId } = useTelegramId();
  const [isOpen, setIsOpen] = React.useState(false);
  const [checkMembership, setCheckMembership] = useState(false);
  const membershipCheck = useMembershipCheck({
    userId: telegramId!,
    groupId: demoGroup,
    enabled: false,
  });
  const wallet = useTonWallet();
  const address = useTonAddress();
  const walletUpdated = useRef(false);

  const [TonConnectUI, setOptions] = useTonConnectUI();

  const taskUpdater = (task: any) => {
    updateTask.mutate(
      {
        taskId: task.id,
        username: user?.username!,
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
  const checkMember = async (task: any) => {
    try {
      const result = await membershipCheck.refetch();
      if (result.data?.isMember) {
        taskUpdater(task);
      } else {
        toast({
          variant: "default",
          description: "You have not joined the channel",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking membership",
        description:
          "There was an error checking your membership. Please try again.",
      });
    }
  };

  const sendTx = async (task: any) => {
    try {
      const transaction: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 6000,
        messages: [
          {
            address: "UQDQw8FkEt8ELh0uLG1vIQSWNU2wRWi-KVMXMul7QhtUxtKL",
            amount: "100000000",
            payload: "transaction",
            stateInit: "",
          },
        ],
      };

      const result = await TonConnectUI.sendTransaction(transaction);
      if (result.boc) {
        taskUpdater(task);
      } else {
        console.log(result);
        toast({
          variant: "destructive",
          title: "Error sending transaction",
          description:
            "There was an error sending the transaction. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error sending transaction",
        description:
          "There was an error sending the transaction. Please try again.",
      });
    }
  };

  const handleTaskAction = (task: any) => {
    if (task.id === "FollowX") {
      window.open(
        "https://twitter.com/intent/follow?screen_name=GalaxyQuestNFT",
        "_blank",
      );
      taskUpdater(task);
    }
    if (task.id === "EarlyReward") {
      setTimeout(() => taskUpdater(task), 3000);
    }
    if (task.id === "Invite5") {
      user?.invites! >= 5
        ? taskUpdater(task)
        : toast({
            variant: "default",
            description: "invite at least 5 people to complete the task.",
          });
    }
    if (task.id === "SubTgram") {
      checkMember(task);
    }
    if (task.id === "TX") {
      sendTx(task);
    }
  };

  useEffect(() => {
    if (wallet && !walletUpdated.current && !user?.tasks?.ConnectWallet) {
      walletUpdated.current = true;
      const connectWalletTask = tasks.find(
        (task) => task.id === "ConnectWallet",
      );
      if (connectWalletTask) {
        updateWallet.mutate(
          {
            username: user?.username!,
            wallet: address,
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
  }, [wallet, user]);

  const pendingTasks = tasks.filter(
    (task) => !user?.tasks?.[task.id as keyof typeof user.tasks],
  );
  const completedTasks = tasks.filter(
    (task) => user?.tasks?.[task.id as keyof typeof user.tasks],
  );

  return (
    <div className="h-full overflow-y-auto text-white p-8 pb-16">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
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

      <Toaster />
    </div>
  );
};

export default TasksComponent;
