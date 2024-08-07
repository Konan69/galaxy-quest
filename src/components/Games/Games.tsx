import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, CircleDollarSignIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Game {
  icon: React.ElementType;
  text: string;
  action: string;
  link: string;
}

const Games: Game[] = [
  {
    icon: Rocket,
    text: "Galaxy Adventure",
    action: "Start",
    link: "/shooter",
  },
  {
    icon: CircleDollarSignIcon,
    text: "Plinko",
    action: "Start",
    link: "/plinko",
  },
];

interface GameItemsProps extends Game {
  onNavigate: (link: string) => void;
}

const GameItems: React.FC<GameItemsProps> = React.memo(
  ({ icon: Icon, text, action, link, onNavigate }) => {
    const handleClick = useCallback(() => {
      onNavigate(link);
    }, [link, onNavigate]);

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
            onClick={handleClick}
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            {action}
          </Button>
        </CardContent>
      </Card>
    );
  },
);

GameItems.displayName = "GameItems";

export const GamesComponent: React.FC = () => {
  const router = useRouter();
  const navigate = useCallback(
    (link: string) => {
      router.push(link);
    },
    [router],
  );

  const memoizedGames = useMemo(() => Games, []);

  return (
    <div className="overflow-y-auto bg-gray-900 text-white p-8">
      <div>
        {memoizedGames.map((game, index) => (
          <GameItems key={index} {...game} onNavigate={navigate} />
        ))}
      </div>
    </div>
  );
};
