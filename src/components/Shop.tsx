"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { usePurchase } from "@/lib/queries";
import { useGetUser } from "@/hooks/useCache";
import { toast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { usePFPStore } from "./Store/userStore";
import Navbar from "./Navbar";
const ShopNav = ({ activeTab, setActiveTab }: any) => {
  const user = useGetUser();
  return (
    <div className="flex w-full justify-between mb-4">
      <nav className="flex ml-4 overflow-hidden border-bgdark border-2">
        <motion.button
          onClick={() => setActiveTab("Pfps")}
          className={`text-center py-2 px-4 text-xs font-extralight ${
            activeTab === "Pfps"
              ? "text-white bg-Active"
              : "text-[#FFFFFF] text-opacity-70 bg-Inactive"
          }`}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          PFPs
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("Skins")}
          className={`text-center py-2 px-4 text-xs font-extralight ${
            activeTab === "Skins"
              ? "text-white bg-Active"
              : "text-[#FFFFFF] text-opacity-70 bg-Inactive"
          }`}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Skins
        </motion.button>
      </nav>
      <div className="flex justify-end px-4 py-0 mr-4 place-items-center bg-Leaderboard text-black text-sm rounded-sm">
        {`GP: ${user?.points}`}
      </div>
    </div>
  );
};

const PFPs = [
  {
    name: "Moby",
    price: 0,
    src: "/pfp/Moby.png",
  },
  {
    name: "Coby",
    price: 0,
    src: "/pfp/Coby.png",
  },
  {
    name: "Keycat",
    price: 1400,
    src: "/pfp/Keycat.png",
  },
  {
    name: "Remilio",
    price: 4000,
    src: "/pfp/Remilio.webp",
  },
];

const PfpComponent = ({
  name,
  price,
  src,
  isPurchased,
  onAction,
}: {
  name: string;
  price: number;
  src: string;
  isPurchased: boolean;
  onAction: () => void;
}) => {
  const { selectedPfp, setSelectedPfp } = usePFPStore();

  const handleSelect = () => {
    setSelectedPfp(src);
  };

  return (
    <Card className="flex flex-col bg-transparent  border-bgdark border-2 w-full h-52 relative">
      <CardContent className="p-0 h-full">
        <div className="relative rounded-t-xl h-[70%] w-full overflow-hidden">
          <Image
            className="object-cover w-full h-full rounded-none"
            src={src}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="bg-panel pl-2 pb-2 pt-1 flex flex-row rounded h-[30%]">
          <div className="w-[80%]">
            <div className="text-white text-sm font-normal pb-1">{name}</div>
            <div className="flex flex-row">
              <div className="text-gray-400 text-sm ">GP</div>
              <div className="text-white pl-1 text-sm">{price}</div>
            </div>
          </div>
          <div className="pr-2 my-auto ">
            <button
              onClick={isPurchased ? handleSelect : onAction}
              className={` my-auto rounded-md h-6 w-16 text-xs ${
                isPurchased && selectedPfp === src
                  ? "bg-gray-600"
                  : isPurchased
                    ? "bg-orange-600"
                    : "bg-orange-600"
              }`}
            >
              {isPurchased && selectedPfp === src
                ? "Selected"
                : isPurchased
                  ? "Select"
                  : `Buy`}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SkinsComponent = () => {
  return <div>Skins</div>;
};

const ShopComponent = () => {
  const [activeTab, setActiveTab] = useState("Pfps");
  const user = useGetUser();
  const { mutateAsync } = usePurchase();

  const isItemPurchased = (itemName: string): boolean => {
    return user?.purchases?.[itemName as keyof typeof user.purchases] === true;
  };

  const handlePurchase = async (itemKey: string, price: number) => {
    try {
      const result = await mutateAsync({
        username: user?.username!,
        itemKey,
        price,
      });
      if (result) {
        toast({
          variant: "default",
          description: "Purchase successful",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.response.data.error,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <ShopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full px-4 grid grid-cols-2 gap-x-4 gap-y-4"
        >
          {activeTab === "Pfps" ? (
            PFPs.map((PFP, index) => (
              <PfpComponent
                {...PFP}
                key={index}
                isPurchased={isItemPurchased(PFP.name)}
                onAction={() => {
                  if (!isItemPurchased(PFP.name)) {
                    handlePurchase(PFP.name, PFP.price);
                  }
                }}
              />
            ))
          ) : (
            <SkinsComponent />
          )}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </div>
  );
};

export default ShopComponent;
