"use client";
import { useEffect } from "react";
import { useGetUserQuery, useRegisterUserMutation } from "@/lib/queries";
import { useInitData } from "@telegram-apps/sdk-react";
import { usePFPStore } from "@/components/Store/userStore";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { getRank, rankThreshold } from "@/lib/rank";
import Ion from "@/components/Icons/IonRocket";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { initUtils } from "@telegram-apps/sdk";
import Navbar from "@/components/Navbar";

export default function LandingClient() {
  const initData = useInitData();
  const username = initData?.user?.username;
  const inv_code = initData?.startParam;
  const utils = initUtils();
  const { selectedPfp } = usePFPStore();
  const fetchuser = useGetUserQuery(username!);

  const createUserMutation = useRegisterUserMutation();
  const progress =
    (fetchuser.data?.points! /
      rankThreshold(getRank(fetchuser.data?.points as number))) *
    100;

  const GradientProgressBar = ({ value }: { value: number }) => {
    return (
      <div className="w-full bg-white rounded-full h-3 overflow-hidden p-[1px]">
        <div
          className="h-full rounded-xl"
          style={{
            width: `${value}%`,
            background:
              "linear-gradient(to right, #020913, #092651, #0B2F64, #0D3979)",
          }}
        />
      </div>
    );
  };

  const share = () => {
    utils.shareURL("https://t.me/mybot/myapp", "Look! Some cool app here!");
    navigator.clipboard.writeText(`https://t.me/mybot?startApp=${inv_code}`);

    toast({
      variant: "default",
      title: "Shared! ",
      description: "your invite link has been copied to clipboard",
    });
  };

  useEffect(() => {
    if (!fetchuser.isLoading && (!fetchuser.isSuccess || !fetchuser.data)) {
      console.log("User not found, creating user:", fetchuser);
      createUserMutation.mutate({ username, inv_code } as any);
    }
  }, [fetchuser.isLoading, fetchuser.isSuccess, fetchuser.data]);

  if (
    createUserMutation.isPending ||
    (fetchuser.isFetching && !fetchuser.isRefetching)
  ) {
    return (
      <div className="text-center z-[100] bg-black h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!username)
    return (
      <div className="text-center text-white">
        Please set username in telegram
      </div>
    );

  return (
    <>
      <div className="min-h-screen min-w-full text-white p-2 overflow-y-auto pb-16 font-inter">
        <div className="flex items-center justify-center pt-10 pb-6">
          {<TonConnectButton className="custom-tonconnect-button" />}
        </div>
        <div className=" mx-auto space-y-4">
          <div className="flex flex-col items-center space-y-2 ">
            <Avatar className="w-28 h-28 border-2 border-white relative ">
              <div className="absolute inset-1  overflow-hidden">
                <Image
                  src={selectedPfp ? selectedPfp : "/Asronaut.svg"}
                  alt="Astro"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </Avatar>

            <h2 className="text-xl font-bold flex flex-row pb-6 pt-4">
              {fetchuser.data?.username.toUpperCase()}
              <button onClick={share} className="ml-2 pl-1 text-white">
                <Send />
              </button>
            </h2>
          </div>

          <div className="relative font-inter text-slate-100 ">
            <div className="absolute -top-3 left-10 text-m bg-[#02080E] px-2">
              Points
            </div>
            <Card className="bg-[#02080E] rounded-xl border-[1.5px] border-white m-4 py-2">
              <CardContent className="px-4 py-1 flex flex-row">
                <div className="flex flex-col w-[70%] ">
                  <div className="text-lg font-sans text-white mb-2">
                    {getRank(fetchuser.data?.points as number)}
                  </div>
                  <div className="flex items-center ">
                    <div className="flex-grow min-w-32 ">
                      <div className="flex items-center justify-center">
                        <GradientProgressBar value={progress} />
                      </div>
                      <div className=" text-base text-white flex justify-end mt-2">
                        {fetchuser.data?.points}/
                        {rankThreshold(
                          getRank(fetchuser.data?.points as number),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" flex items-center justify-end ml-12">
                  <Ion size={42} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-12">
            <h3 className="text-lg pl-2 pb-1 font-semibold mb-2 text-white">
              NFTs
            </h3>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4 gap-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 md:basis-1/2"
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
        <Toaster />
      </div>
      <Navbar />
    </>
  );
}
