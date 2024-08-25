import Coins from "../Icons/Coins";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className="fixed bottom-0 min-w-full flex justify-around items-center z-10 
      text-xs  bg-customdark
      opacity-90 h-14"
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
