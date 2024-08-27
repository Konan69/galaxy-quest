"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Home from "../Icons/Home";
import Earn from "../Icons/Earn";
import Shop from "../Icons/Shop";
import Leaderboard from "../Icons/Leaderboard";

const colorMap: Record<string, string> = {
  Home: "text-Home",
  Earn: "text-Earn",
  Shop: "text-Shop",
  Leaderboard: "text-Leaderboard",
};

const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: any;
  label: string;
  isActive: boolean;
}) => (
  <Link href={href}>
    <div
      className={`flex flex-col items-center justify-center relative ${colorMap[label]}`}
    >
      <Icon className={`w-8 h-8`} />
      <p className="mt-1">{label}</p>
      {isActive && (
        <div
          className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-[1px]  bg-current`}
        />
      )}
    </div>
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/landing", icon: Home, label: "Home" },
    { href: "/earn", icon: Earn, label: "Earn" },
    { href: "/shop", icon: Shop, label: "Shop" },
    {
      href: "/leaderboard",
      icon: Leaderboard,
      label: "Leaderboard",
    },
  ];

  return (
    <div className="fixed bottom-0 min-w-full flex justify-around items-center z-10 text-xs bg-customdark opacity-90 h-14 px-4 py-10">
      {navItems.map((item) => (
        <NavItem key={item.href} {...item} isActive={pathname === item.href} />
      ))}
    </div>
  );
}
