import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import asteroid from "../../app/_assets/Sprites/asteroid.png";
import ship from "../../app/_assets/Sprites/ship.png";
import lazer from "../../app/_assets/Sprites/lazer.png";
import rapidFireIcon from "../../app/_assets/Sprites/rapidfire.png";
import Lives from "../../app/_assets/Sprites/Lives.png";
import shieldIcon from "../../app/_assets/Sprites/shield.png";
import doublePointsIcon from "../../app/_assets/Sprites/doublepoints.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserStore } from "@/components/Store/userStore";
import { useAddPointsMutation } from "@/lib/queries";

// Constants for game dimensions and element sizes
const GAME_HEIGHT = 500;
const GAME_WIDTH = 300;
const SHIP_SIZE = 40;
const OBSTACLE_SIZE = 60;
const PROJECTILE_SIZE = 5;
const POWERUP_SIZE = 30;

// Constants for difficulty scaling
const INITIAL_OBSTACLE_SPEED = 3;
const INITIAL_SPAWN_INTERVAL = 1500;
const MAX_DIFFICULTY_FACTOR = 10;
const DIFFICULTY_INCREASE_INTERVAL = 5000; // 5 seconds

// Constants for powerups
const POWERUP_DURATION = 10000; // 10 seconds
const POWERUP_SPAWN_CHANCE = 0.2; // 20% chance to spawn a powerup when an obstacle is destroyed

// Interfaces for game objects
interface Obstacle {
  x: number;
  y: number;
  id: number;
  health: number;
  rotationSpeed: number;
}

interface Projectile {
  x: number;
  y: number;
  id: number;
  health: number;
}

interface Position {
  x: number;
  y: number;
}

interface Powerup {
  x: number;
  y: number;
  id: number;
  type: "rapidFire" | "shield" | "doublePoints" | "extraLife";
}

const Game: React.FC = () => {
  const { user } = useUserStore();
  const addPointsMutation = useAddPointsMutation();
  // State hooks for game objects and status
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficultyFactor, setDifficultyFactor] = useState(1);

  // Refs for ship position and other states
  const shipPositionRef = useRef<Position>({
    x: GAME_WIDTH / 2 - SHIP_SIZE / 2,
    y: GAME_HEIGHT - SHIP_SIZE,
  });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerPositionRef = useRef<Position>({ x: 0, y: 0 });
  const scoreRef = useRef(score);
  const gameTimeRef = useRef(0);

  // Refs for powerup states
  const rapidFireRef = useRef(false);
  const shieldRef = useRef(false);
  const doublePointsRef = useRef(false);
  const extraLifeRef = useRef(false);

  // Update scoreRef whenever score changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Function to spawn a new obstacle at a random x position
  const spawnObstacle = useCallback(() => {
    const newObstacle: Obstacle = {
      x: Math.random() * (GAME_WIDTH - OBSTACLE_SIZE),
      y: -OBSTACLE_SIZE,
      id: Date.now(),
      health: 1,
      rotationSpeed: Math.random() * 360 + 180,
    };
    setObstacles((prev) => [...prev, newObstacle]);
  }, []);

  // Function to create a new projectile at the ship's current position
  const shoot = useCallback(() => {
    const newProjectile: Projectile = {
      x: shipPositionRef.current.x + SHIP_SIZE / 2 - PROJECTILE_SIZE / 2,
      y: shipPositionRef.current.y - PROJECTILE_SIZE,
      id: Date.now(),
      health: 1,
    };
    setProjectiles((prev) => [...prev, newProjectile]);
  }, []);

  // Function to start or restart the game
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setObstacles([]);
    setProjectiles([]);
    setPowerups([]);
    setDifficultyFactor(1);
    gameTimeRef.current = 0;
    shipPositionRef.current = {
      x: GAME_WIDTH / 2 - SHIP_SIZE / 2,
      y: GAME_HEIGHT - SHIP_SIZE,
    };
    rapidFireRef.current = false;
    shieldRef.current = false;
    doublePointsRef.current = false;
    extraLifeRef.current = false;
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    setGameStarted(false);

    if (user && user.username) {
      addPointsMutation.mutate({
        username: user.username,
        points: scoreRef.current,
      });
    }
  }, [user, addPointsMutation]);

  // Function to spawn a powerup
  const spawnPowerup = useCallback((x: number, y: number) => {
    if (Math.random() < POWERUP_SPAWN_CHANCE) {
      const powerupTypes: Powerup["type"][] = [
        "rapidFire",
        "shield",
        "doublePoints",
        "extraLife",
      ];
      const newPowerup: Powerup = {
        x,
        y,
        id: Date.now(),
        type: powerupTypes[Math.floor(Math.random() * powerupTypes.length)],
      };
      setPowerups((prev) => [...prev, newPowerup]);
    }
  }, []);

  // Function to activate a powerup
  const activatePowerup = useCallback((type: Powerup["type"]) => {
    switch (type) {
      case "rapidFire":
        rapidFireRef.current = true;
        setTimeout(() => {
          rapidFireRef.current = false;
        }, POWERUP_DURATION);
        break;
      case "shield":
        shieldRef.current = true;
        setTimeout(() => {
          shieldRef.current = false;
        }, POWERUP_DURATION);
        break;
      case "doublePoints":
        doublePointsRef.current = true;
        setTimeout(() => {
          doublePointsRef.current = false;
        }, POWERUP_DURATION);
        break;
      case "extraLife":
        setLives((prev) => Math.min(prev + 1, 5));
        break;
    }
  }, []);

  // Function to update game state including movement and collision detection
  const updateGameState = useCallback(() => {
    gameTimeRef.current += 50;
    if (gameTimeRef.current % DIFFICULTY_INCREASE_INTERVAL === 0) {
      setDifficultyFactor((prev) =>
        Math.min(prev + 0.1, MAX_DIFFICULTY_FACTOR),
      );
    }

    setObstacles((prev) =>
      prev
        .map((obs) => ({
          ...obs,
          y: obs.y + INITIAL_OBSTACLE_SPEED * difficultyFactor,
        }))
        .filter((obs) => {
          if (obs.y + OBSTACLE_SIZE >= GAME_HEIGHT) {
            setLives((l) => l - 1);
            return false;
          }
          if (
            shipPositionRef.current.x < obs.x + OBSTACLE_SIZE &&
            shipPositionRef.current.x + SHIP_SIZE > obs.x &&
            shipPositionRef.current.y < obs.y + OBSTACLE_SIZE &&
            shipPositionRef.current.y + SHIP_SIZE > obs.y
          ) {
            if (!shieldRef.current) {
              setLives((l) => l - 1);
            }
            return false;
          }
          return true;
        }),
    );

    setProjectiles((prev) =>
      prev
        .map((proj) => ({ ...proj, y: proj.y - 5 }))
        .filter((proj) => proj.y > 0 && proj.health > 0),
    );

    setProjectiles((prevProj) =>
      prevProj.map((proj) => {
        let updatedProj = { ...proj };
        setObstacles(
          (prevObs) =>
            prevObs
              .map((obs) => {
                if (
                  proj.x < obs.x + OBSTACLE_SIZE &&
                  proj.x + PROJECTILE_SIZE > obs.x &&
                  proj.y < obs.y + OBSTACLE_SIZE &&
                  proj.y + PROJECTILE_SIZE > obs.y
                ) {
                  updatedProj.health -= 1;
                  if (obs.health === 1) {
                    const pointsGained = doublePointsRef.current ? 10 : 5;
                    setScore((s) => s + pointsGained);
                    spawnPowerup(obs.x, obs.y);
                    return null;
                  }
                  return { ...obs, health: obs.health - 1 };
                }
                return obs;
              })
              .filter(Boolean) as Obstacle[],
        );
        return updatedProj;
      }),
    );

    setPowerups((prev) =>
      prev
        .map((powerup) => ({ ...powerup, y: powerup.y + 2 }))
        .filter((powerup) => {
          if (
            shipPositionRef.current.x < powerup.x + POWERUP_SIZE &&
            shipPositionRef.current.x + SHIP_SIZE > powerup.x &&
            shipPositionRef.current.y < powerup.y + POWERUP_SIZE &&
            shipPositionRef.current.y + SHIP_SIZE > powerup.y
          ) {
            activatePowerup(powerup.type);
            return false;
          }
          return powerup.y < GAME_HEIGHT;
        }),
    );

    setLives((prev) => {
      if (prev <= 0) {
        endGame();
      }
      return prev;
    });
  }, [difficultyFactor, spawnPowerup, activatePowerup]);

  // Effect to start and manage game loops
  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    let obstacleSpawnLoop: NodeJS.Timeout;
    let shootingLoop: NodeJS.Timeout;

    if (gameStarted && !gameOver) {
      gameLoop = setInterval(updateGameState, 50);
      obstacleSpawnLoop = setInterval(
        spawnObstacle,
        INITIAL_SPAWN_INTERVAL / difficultyFactor,
      );
      shootingLoop = setInterval(() => {
        shoot();
        if (rapidFireRef.current) {
          setTimeout(shoot, 150);
        }
      }, 1000);
    }

    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleSpawnLoop);
      clearInterval(shootingLoop);
    };
  }, [
    gameStarted,
    gameOver,
    updateGameState,
    spawnObstacle,
    shoot,
    difficultyFactor,
  ]);

  // Handle pointer down event to start dragging the ship
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerPositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Handle pointer move event to move the ship
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - SHIP_SIZE / 2;
      const newY = e.clientY - rect.top - SHIP_SIZE / 2;

      shipPositionRef.current = {
        x: Math.max(0, Math.min(GAME_WIDTH - SHIP_SIZE, newX)),
        y: Math.max(0, Math.min(GAME_HEIGHT - SHIP_SIZE, newY)),
      };

      const shipElement = gameAreaRef.current.querySelector(
        ".ship",
      ) as HTMLElement;
      if (shipElement) {
        shipElement.style.left = `${shipPositionRef.current.x}px`;
        shipElement.style.top = `${shipPositionRef.current.y}px`;
      }
    }
  }, []);

  // Handle pointer up event to stop dragging the ship
  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="flex flex-row items-center w-full justify-between pl-10">
        <div className="text-left">
          Difficulty: {difficultyFactor.toFixed(1)}x
        </div>
        <div className="flex flex-row items-center justify-end pr-12 gap-x-2">
          <Image
            src={rapidFireIcon}
            width={30}
            height={30}
            alt="Rapid Fire"
            className={rapidFireRef.current ? "" : "grayscale"}
          />
          <Image
            src={shieldIcon}
            width={24}
            height={24}
            alt="Shield"
            className={shieldRef.current ? "" : "grayscale"}
          />
          <Image
            src={doublePointsIcon}
            width={28}
            height={28}
            alt="Double Points"
            className={doublePointsRef.current ? "" : "grayscale"}
          />
        </div>
      </div>
      <div
        ref={gameAreaRef}
        className="relative bg-black border-4 border-purple-500 overflow-hidden touch-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Image
          src={ship}
          alt="Ship"
          className="absolute cursor-move ship"
          style={{
            left: shipPositionRef.current.x,
            top: shipPositionRef.current.y,
            width: SHIP_SIZE,
            height: SHIP_SIZE,
            touchAction: "none",
          }}
        />
        {shieldRef.current && (
          <div
            className="absolute border-4 border-blue-500 rounded-full"
            style={{
              left: shipPositionRef.current.x - 5,
              top: shipPositionRef.current.y - 5,
              width: SHIP_SIZE + 10,
              height: SHIP_SIZE + 10,
            }}
          />
        )}
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute"
            style={{
              left: obs.x,
              top: obs.y,
              width: OBSTACLE_SIZE,
              height: OBSTACLE_SIZE,
              animation: `spin ${360 / obs.rotationSpeed}s linear infinite`,
            }}
          >
            <Image
              src={asteroid}
              alt="Asteroid"
              width={OBSTACLE_SIZE}
              height={OBSTACLE_SIZE}
            />
          </div>
        ))}
        {projectiles.map((proj) => (
          <Image
            key={proj.id}
            src={lazer}
            alt="Lazer"
            className="absolute"
            style={{
              left: proj.x,
              top: proj.y,
              width: PROJECTILE_SIZE,
              height: PROJECTILE_SIZE * 2,
            }}
          />
        ))}
        {powerups.map((powerup) => (
          <Image
            key={powerup.id}
            src={
              powerup.type === "rapidFire"
                ? rapidFireIcon
                : powerup.type === "shield"
                  ? shieldIcon
                  : powerup.type === "extraLife"
                    ? Lives
                    : doublePointsIcon
            }
            alt={powerup.type}
            className="absolute"
            style={{
              left: powerup.x,
              top: powerup.y,
              width: POWERUP_SIZE,
              height: POWERUP_SIZE,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex ">
        Score: {score} |
        {lives &&
          Array.from({ length: lives }).map((_, i) => (
            <Image
              key={i}
              src={Lives}
              alt="Lives"
              width={30}
              height={30}
              className=" -mx-1"
            />
          ))}
      </div>

      <AlertDialog open={!gameStarted || gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {gameOver ? "Game Over" : "Galactic Quest"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {gameOver
                ? `Your final score: ${score}`
                : "Ready to start your space adventure?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <div className="flex place-content-center">
              <AlertDialogAction className="mr-2 w-22" onClick={startGame}>
                {gameOver ? "Play Again" : "Start Game"}
              </AlertDialogAction>
              <Link href="/" className="w-20">
                <AlertDialogAction>Exit</AlertDialogAction>
              </Link>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Game;
