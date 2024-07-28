import Coins from "../Icons/Coins";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-[calc(80%-2rem)] flex justify-around items-center z-50 rounded-3xl
      text-xs backdrop-filter backdrop-blur-md bg-opacity-40 bg-gray-700
      opacity-90"
    >
      <Link href="/landing">
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Home</p>
        </div>
      </Link>
      <Link href="/earn">
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
      </Link>
      <Link href="/earn">
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Shop</p>
        </div>
      </Link>
      <Link href="/earn">
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-20 h-8 mx-auto" />
          <p className="mt-1">Leaderboard</p>
        </div>
      </Link>
    </div>
  );
}
