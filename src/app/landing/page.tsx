"use client";

import { useEffect } from "react";
import { useGetUserQuery, useRegisterUserMutation } from "@/lib/queries";
import { useInitData } from "@telegram-apps/sdk-react";
import { useTelegramId } from "@/components/Store/userStore";
import { useGetUser } from "@/hooks/useCache";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Astro from "../_assets/Asronaut.svg";
import Image from "next/image";

import { TonConnectButton } from "@tonconnect/ui-react";
import { RocketIcon } from "lucide-react";

export default function LandingClient() {
  const initData = useInitData();
  const username = initData?.user?.username;
  const inv_code = initData?.startParam;
  const user = useGetUser();

  if (!username)
    return (
      <div className="text-center text-white">
        Please set username in telegram
      </div>
    );

  useGetUserQuery(username);

  const { setTelegramId } = useTelegramId();
  const createUserMutation = useRegisterUserMutation();

  useEffect(() => {
    if (!user && username) {
      createUserMutation.mutate({ username, inv_code } as any);
      setTelegramId(initData?.user?.id);
    }
    if (username) {
      setTelegramId(initData?.user?.id);
    }
  }, [username]);

  if (createUserMutation.isPending)
    return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen min-w-full text-white p-2 overflow-y-auto pb-16 font-inter">
      <div className="flex justify-center pt-10 pb-6">
        <TonConnectButton />
      </div>
      <div className=" mx-auto space-y-4">
        <div className="flex flex-col items-center space-y-2 ">
          <Avatar className="w-28 h-28 border-2 border-white relative p-6">
            <div className="absolute inset-6  overflow-hidden">
              <Image src={Astro} alt="Astro" layout="fill" objectFit="cover" />
            </div>
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="flex flex-row pt-4 pb-6">
            <h2 className="text-xl font-bold">
              {user?.username.toUpperCase()}
            </h2>
          </div>
        </div>

        <Card className="bg-[#02080E] rounded-xl text-slate-100 m-4">
          <CardContent className="p-2 pl-6">
            <div className="">Cadet</div>
            <div className=" flex justify-between items-center">
              <div className="min-w-64">
                <Progress
                  value={60}
                  className="w-full h-2 rounded-full border-white"
                  style={{
                    background:
                      "linear-gradient(to right, #020913, #092651, #0B2F64, #0D3979)",
                  }}
                />
                <div className="flex justify-end pt-1">{user?.points}/150</div>
              </div>

              <div className="p-4 flex justify-end">
                <RocketIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-12">
          <h3 className="text-lg pl-2 pb-1 font-semibold mb-2 text-white">
            NFT'S
          </h3>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4 gap-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-4/5 md:basis-1/2"
                >
                  <Card className="bg-[#02080E] rounded-xl border-transparent">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-3xl text-white font-semibold">
                        {index === 1 ? "?" : "Coming soon"}
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
