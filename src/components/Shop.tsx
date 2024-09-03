"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
const ShopNav = ({ activeTab, setActiveTab }: any) => {
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
      <div className="flex justify-end px-4 py-0 mr-4 place-items-center bg-Leaderboard text-black text-sm">
        GP : 3456
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
    price: "4000",
    src: "/pfp/Remilio.webp",
  },
];

const PfpComponent = ({ name, price, src }: any) => (
  <Card className="flex flex-col bg-transparent border-none border-bgdark w-44 h-52 relative">
    <CardContent className="p-0 h-full">
      <div className="relative rounded-lg h-[60%] w-full overflow-hidden">
        <Image
          className=" object-cover w-full h-full rounded-lg"
          src={src}
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className=" bg-panel pl-2  pb-2 flex flex-col ">
        <div className="text-white text-sm font-normal pb-2">{name}</div>
        <button className="mx-auto bg-orange-600 rounded-md w-[60%] py-1 ">
          {price} GP
        </button>
      </div>
    </CardContent>
  </Card>
);

const SkinsComponent = () => {
  return <div>Skins</div>;
};

const ShopComponent = () => {
  const [activeTab, setActiveTab] = useState("Pfps");
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
          className="w-auto pr-4 grid grid-cols-2 gap-x-4 gap-y-4"
        >
          {activeTab === "Pfps" ? (
            PFPs.map((PFP, index) => <PfpComponent {...PFP} key={index} />)
          ) : (
            <SkinsComponent />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ShopComponent;
