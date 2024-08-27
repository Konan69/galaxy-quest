import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CircleDollarSign, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Ion from "../Icons/IonRocket";
import Coin from "../Icons/Coin";

interface Game {
  icon: React.ElementType;
  name: string;
  category: string;
  link: string;
  image: string;
}

const Games: Game[] = [
  {
    name: "Galaxy Adventures",
    icon: Ion,
    category: "Arcade",
    image: "/Galaxy.png",
    link: "/shooter",
  },
  {
    name: "Plinko",
    icon: Coin,
    category: "Arcade",
    image: "/Plinko.png",
    link: "/plinko",
  },
];

const GameCard: React.FC<Game> = ({
  name,
  icon: Icon,
  category,
  image,
  link,
}) => (
  <Card className="flex flex-col bg-transparent border z-0 border-bgdark w-64 h-48 relative">
    <CardContent className="p-0 h-full">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          className="object-cover w-full h-full rounded-lg"
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
        />

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-panel p-4 flex items-center rounded-b-lg">
          <Icon className="text-purple-500 w-6 h-6" />
          <div className="ml-4">
            <h3 className="text-white text-sm font-normal">{name}</h3>
            <p className="text-gray-400 text-xs">{category}</p>
          </div>
          <div className="flex grow justify-end">
            <Link href={link} passHref>
              <button className="bg-orange-600 rounded-md p-2 ">
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const GamesComponent = () => {
  return (
    <Carousel className="relative w-full">
      <CarouselContent className="flex flex-row snap-center scroll-snap-x scroll-smooth pl-8 mr-8">
        {Games.map((game, index) => (
          <CarouselItem
            key={index}
            className="snap-center basis-[75%]  w-[85%]"
          >
            <GameCard {...game} key={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        {Games.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full mx-1 ${
              index === 0 ? "bg-white" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
};
