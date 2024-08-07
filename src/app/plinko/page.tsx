"use client";

import { useEffect, useRef, useState } from "react";
import { BallManager } from "@/app/plinko/classes/BallManager";
import Selector from "./risk";
import { useAddBallMutation } from "@/lib/queries";
type Option = "Low" | "Medium" | "High";
import { Button1 } from "@/components/ui/ui";
import { constants } from "buffer";
import axios from "axios";
import { useGetUser } from "@/hooks/useCache";

export default function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const [lastPoints, setLastPoints] = useState<any>([]);
  const [betAmount, setBetAmount] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const user = useGetUser();

  const { mutate, data: response } = useAddBallMutation();

  const balance = user?.points;

  const [selectedOption, setSelectedOption] = useState<Option>("Low");

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current,
        selectedOption,
        handleBallFinish,
      );
      setBallManager(ballManager);
    }
  }, [canvasRef, selectedOption]);

  const handleAddBall = async () => {
    if (betAmount > balance!) {
      return;
    }
    try {
      mutate({
        // username: user?.username,
        riskLevel: selectedOption,
        // userBalance: balance,
        // betAmount: betAmount,
      });
      // const response = await axios.post("/api/game", {
      //   riskLevel: selectedOption,
      // });

      if (response && ballManager) {
        const { point, multiplier, riskLevel, userBalance, updatedUser } =
          response;
        console.log(response);
        ballManager.addBall(point, multiplier, riskLevel);
      }
      return response;
    } catch (error) {
      console.error("Error adding ball:", error);
    }
  };

  const handleBallFinish = (
    index: number,
    startX?: number,
    multiplier?: number,
    riskLevel?: string,
    updatedUser?: any,
  ) => {
    if (multiplier !== undefined) {
      setLastPoints((prevPoints: any) => {
        const updatedPoints = [...prevPoints, { multiplier, riskLevel }];
        if (updatedPoints.length > 6) {
          updatedPoints.shift();
        }
        return updatedPoints;
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <h1> Points: {balance}</h1>
      <canvas ref={canvasRef} width="800" height="800"></canvas>
      <div className="border-black border-2 bg-zinc-800 shadow-2xl w-80 ml-10">
        <div>
          <h1 className="ml-1 text-lg font-thin">Risk</h1>
          <Selector
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
        <label className="text-white">Amount:</label>
        <input
          id="betAmount"
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseInt(e.target.value))}
          placeholder="Enter Bet Amount"
          className="bg-[#0e212e] mb-4 w-full rounded border-none focus:outline-none focus:bg-gray-600 text-white"
        />
        <div className="flex justify-center"></div>

        <Button1 className="px-10 mb-4" onClick={handleAddBall}>
          Add ball
        </Button1>

        <div className="mt-4 ml-20 stack-container">
          <ul className="stack-list">
            {lastPoints.map((point: any, index: any) => (
              <li key={index} className="stack-item">
                {point.multiplier}x
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
