//fix exit button
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Rocket } from "lucide-react";
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
import { useAddPointsMutation } from "@/mutations/mutations";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Constants for game dimensions and element sizes
const GAME_HEIGHT = 400;
const GAME_WIDTH = 300;
const SHIP_SIZE = 40;
const OBSTACLE_SIZE = 30;
const PROJECTILE_SIZE = 5;

// Interfaces for obstacle and projectile states
interface Obstacle {
  x: number;
  y: number;
  id: number;
  health: number;
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

const Game: React.FC = () => {
  const { user } = useUserStore();
  const addPointsMutation = useAddPointsMutation();
  // State hooks for game objects and status
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Refs for ship position and other states
  const shipPositionRef = useRef<Position>({
    x: GAME_WIDTH / 2 - SHIP_SIZE / 2,
    y: GAME_HEIGHT - SHIP_SIZE,
  });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerPositionRef = useRef<Position>({ x: 0, y: 0 });
  const scoreRef = useRef(score); // Ref for score

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
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setObstacles([]);
    setProjectiles([]);
    shipPositionRef.current = {
      x: GAME_WIDTH / 2 - SHIP_SIZE / 2,
      y: GAME_HEIGHT - SHIP_SIZE,
    };
  };

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

  // Function to update game state including movement and collision detection
  const updateGameState = useCallback(() => {
    // Move obstacles down and check for collisions with the ship or bottom of the screen
    setObstacles((prev) =>
      prev
        .map((obs) => ({ ...obs, y: obs.y + 2 }))
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
            setLives((l) => l - 1);
            return false;
          }
          return true;
        }),
    );

    // Move projectiles up and check if they are out of bounds
    setProjectiles((prev) =>
      prev
        .map((proj) => ({ ...proj, y: proj.y - 5 }))
        .filter((proj) => proj.y > 0 && proj.health > 0),
    );

    // Check for collisions between projectiles and obstacles
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
                    setScore((s) => s + 20);
                    return null; // Remove obstacle if health reaches zero
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

    // Check if lives are depleted to end the game
    setLives((prev) => {
      if (prev <= 0) {
        endGame();
      }
      return prev;
    });
  }, []);

  // Effect to start and manage game loops
  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    let obstacleSpawnLoop: NodeJS.Timeout;
    let shootingLoop: NodeJS.Timeout;

    if (gameStarted && !gameOver) {
      gameLoop = setInterval(updateGameState, 50);
      obstacleSpawnLoop = setInterval(spawnObstacle, 2000);
      shootingLoop = setInterval(shoot, 1000);
    }

    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleSpawnLoop);
      clearInterval(shootingLoop);
    };
  }, [gameStarted, gameOver, updateGameState, spawnObstacle, shoot]);

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
      shipElement.style.left = `${shipPositionRef.current.x}px`;
      shipElement.style.top = `${shipPositionRef.current.y}px`;
    }
  }, []);

  // Handle pointer up event to stop dragging the ship
  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div
        ref={gameAreaRef}
        className="relative bg-black border-4 border-purple-500 overflow-hidden touch-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Rocket
          className="absolute text-yellow-400 cursor-move ship"
          style={{
            left: shipPositionRef.current.x,
            top: shipPositionRef.current.y,
            width: SHIP_SIZE,
            height: SHIP_SIZE,
            touchAction: "none",
          }}
        />
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute rounded-full bg-red-500 "
            style={{
              left: obs.x,
              top: obs.y,
              width: OBSTACLE_SIZE,
              height: OBSTACLE_SIZE,
            }}
          />
        ))}
        {projectiles.map((proj) => (
          <div
            key={proj.id}
            className={`absolute rounded-full bg-blue-500`}
            style={{
              left: proj.x,
              top: proj.y,
              width: PROJECTILE_SIZE,
              height: PROJECTILE_SIZE,
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        Score: {score} | Lives: {lives}
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
          <AlertDialogFooter>
            <AlertDialogAction onClick={startGame}>
              {gameOver ? "Play Again" : "Start Game"}
            </AlertDialogAction>
            <Link href="/landing">
              <AlertDialogAction>Exit</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Game;
