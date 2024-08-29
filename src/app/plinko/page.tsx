"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { BallManager } from "@/app/plinko/classes/BallManager";
import Selector from "./risk";
import { useAddBallMutation } from "@/lib/queries";
import { Button1 } from "@/components/ui/ui";
import axios, { AxiosResponse } from "axios";
import { useGetUser } from "@/hooks/useCache";
import SlotCounter, { SlotCounterRef } from "react-slot-counter";
import { useQueryClient } from "@tanstack/react-query";

type Option = "Low" | "Medium" | "High";

interface PointResponse {
  newBalance: number;
}

export default function Game() {
  const user = useGetUser();
  const queryclient = useQueryClient();
  const [ballManager, setBallManager] = useState<BallManager>();
  const [lastPoints, setLastPoints] = useState<any>([]);
  const [serverPoints, setServerPoints] = useState<number>(user?.points || 0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotCounterRef = useRef<SlotCounterRef>(null);
  const [pendingRequests, setPendingRequests] = useState<
    Promise<AxiosResponse<PointResponse>>[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutateAsync, data: response } = useAddBallMutation();

  const balance = user?.points;

  const [selectedOption, setSelectedOption] = useState<Option>("Low");
  const [betAmount, setBetAmount] = useState<number>(0);

  const handleBallFinish = useCallback(
    async (
      index: number,
      startX?: number,
      multiplier?: number,
      riskLevel?: string,
      currentBetAmount?: number,
    ) => {
      const request = axios.post<PointResponse>("/api/game/plinko", {
        username: user?.username,
        betAmount: currentBetAmount,
        multiplier: multiplier,
      });

      setPendingRequests((prev) => [...prev, request]);

      try {
        const response = await request;
        if (response) {
          setServerPoints(response.data.newBalance);
        }

        if (multiplier !== undefined && riskLevel !== undefined) {
          setLastPoints((prevPoints: any) => {
            const updatedPoints = [...prevPoints, { multiplier, riskLevel }];
            if (updatedPoints.length > 6) {
              updatedPoints.shift();
            }
            return updatedPoints;
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setPendingRequests((prev) => prev.filter((r) => r !== request));
      }
    },
    [user?.username],
  );

  useEffect(() => {
    if (canvasRef.current) {
      const newBallManager = new BallManager(
        canvasRef.current,
        selectedOption,
        handleBallFinish,
      );
      setBallManager(newBallManager);
    }
  }, [canvasRef, selectedOption, handleBallFinish]);

  useEffect(() => {
    const updateIsUpdating = async () => {
      if (pendingRequests.length === 0 && isUpdating) {
        setIsUpdating(false);
      } else if (pendingRequests.length > 0 && !isUpdating) {
        setIsUpdating(true);
        await Promise.all(pendingRequests);
        setIsUpdating(false);
        slotCounterRef.current?.startAnimation();
      }
    };

    updateIsUpdating();
  }, [pendingRequests, isUpdating, serverPoints, queryclient]);

  const handleAddBall = async () => {
    if (betAmount > balance!) {
      return;
    }
    try {
      mutateAsync({
        riskLevel: selectedOption,
        betAmount: betAmount,
      });
      if (response && ballManager) {
        const { point, multiplier, riskLevel } = response;
        ballManager.addBall(point, multiplier, riskLevel, betAmount);
      }
      return response;
    } catch (error) {
      console.error("Error adding ball:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <h1>
        Points:
        <SlotCounter
          ref={slotCounterRef}
          value={serverPoints}
          startValue={serverPoints}
          duration={0.3}
          useMonospaceWidth={true}
          animateOnVisible={false}
          autoAnimationStart={false}
        />
      </h1>
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
          onChange={(e) => {
            setBetAmount(parseInt(e.target.value) || 0);
          }}
          placeholder="Enter Bet Amount"
          className="bg-[#0e212e] mb-4 w-full rounded border-none focus:outline-none focus:bg-gray-600 text-white"
        />
        <div className="flex justify-center"></div>

        <Button1 className="px-2 mb-4" onClick={handleAddBall}>
          Add ball
        </Button1>

        <div className="mt-4 ml-20 stack-container">
          <ul className="stack-list">
            {lastPoints.map((point: any, index: number) => (
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
