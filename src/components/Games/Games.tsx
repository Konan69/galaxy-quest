import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Assuming this is your ShadCN carousel
import { Rocket, CircleDollarSignIcon } from "lucide-react"; // Replace with custom icons if necessary

interface Game {
  icon: React.ElementType;
  text: string;
  action: string;
  link: string;
  image: string;
}

const Games: Game[] = [
  {
    icon: Rocket,
    text: "Galaxy Adventure",
    action: "Start",
    link: "/shooter",
    image: "/Galaxy.png",
  },
  {
    icon: CircleDollarSignIcon,
    text: "Plinko",
    action: "Start",
    link: "/plinko",
    image: "/Plinko.png",
  },
];

interface GameItemsProps extends Game {
  className?: string;
}

const GameItems: React.FC<GameItemsProps> = React.memo(
  ({ icon: Icon, text, link, className, image }) => {
    return (
      <Card className={`bg-gray-800 border-gray-700 w-72 ${className}`}>
        <CardContent className="px-0">
          <div className="relative w-full h-32 mb-4">
            <Image
              src={image}
              alt={text}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 p-2 rounded-full">
                <Icon className="text-purple-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-white text-base font-semibold">{text}</p>
                <p className="text-gray-400 text-sm">Arcade</p>
              </div>
            </div>
            <Link href={link} passHref>
              <Button className="bg-orange-500 text-white hover:bg-orange-600 p-2 rounded-full">
                &rarr;
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  },
);

export const GamesComponent: React.FC = () => {
  return (
    <div className="overflow-hidden text-white py-8">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {Games.map((game, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-4/5 md:basis-1/2"
            >
              <GameItems key={index} {...game} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
