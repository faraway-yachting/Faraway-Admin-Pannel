"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { IoReorderThree, IoSearchSharp } from "react-icons/io5";
import Grid from "@/icons/Dashboard";
import { FaSailboat } from "react-icons/fa6";
import Settings from "@/icons/Settings";
import { IoIosLogOut } from "react-icons/io";
import Drawer from "../Drawer";
import { AdminMenus } from "@/data/Sidebar/menu";
import { RiBloggerLine } from "react-icons/ri";
import { IoIosPricetags } from "react-icons/io";



const screenMap: Record<string, { name: string; Icon: React.FC }> = {
  "/dashboard": { name: "Dashboard", Icon: Grid },
  "/tags": { name: "Tags", Icon: IoIosPricetags },
  "/tags/addnewtags": { name: "Tags", Icon: IoIosPricetags },
  "/tags/id": { name: "Tags", Icon: IoIosPricetags },
  "/yachts": { name: "Yachts", Icon: FaSailboat },
  "/yachts/addnewyachts": { name: "Yachts", Icon: FaSailboat },
  "/yachts/id": { name: "Yachts", Icon: FaSailboat },
    "/blog": { name: "Blog", Icon: RiBloggerLine },
    "/blog/id": { name: "Blog", Icon: RiBloggerLine },
  "/blog/addnewblog": { name: "Blog", Icon: RiBloggerLine },
  "/settings": { name: "Settings", Icon: Settings },
};

const Header: React.FC = () => {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const pathname = usePathname();

  let screenKey = pathname;
  if (/^\/yachts\/[^/]+$/.test(pathname) && pathname !== "/yachts" && pathname !== "/yachts/addnewyachts") {
    screenKey = "/yachts/id";
  }
  if (/^\/blog\/[^/]+$/.test(pathname) && pathname !== "/blog" && pathname !== "/blog/addnewblog") {
    screenKey = "/blog/id";
  }
  if (/^\/tags\/[^/]+$/.test(pathname) && pathname !== "/tags" && pathname !== "/tags/addnewtags") {
    screenKey = "/tags/id";
  }

  const screen = screenMap[screenKey];

  return (
    <header className="fixed top-0 left-0 bg-white shadow-lg lg:rounded-tl-[31px] lg:left-[200px] xl:left-[240px] 2xl:left-[260px] px-[30px] right-0 z-20 py-3 lg:py-3 2xl:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="lg:hidden text-black text-[20px] cursor-pointer"
            onClick={toggleDrawer}
          >
            <IoReorderThree />
          </span>
          {screen && (
            <div className="flex items-center space-x-3">
              <span className="text-[#222222]">
                <screen.Icon />
              </span>
              <h5 className="sm:text-[14px] md:text-[22px] lg:text-[24px] font-bold text-[#222222] capitalize">
                {screen.name}
              </h5>
            </div>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="border border-[#999999] w-[200px] md:w-[250px] xl:w-[350px] h-[40px] bg-white flex items-center rounded-full px-3 justify-between gap-1">
            <input type="text" placeholder="Search something here..." className="placeholder:text-[#999999] w-full outline-none text-[#222222]" />
            <IoSearchSharp className="text-[#999999] text-[24px] cursor-pointer" />
          </div>
          <div className="bg-white shadow-lg w-[43px] h-[43px] rounded-full flex items-center justify-center cursor-pointer relative">
            <Image 
              src="/images/bell.svg" 
              alt="bell" 
              width={16} 
              height={19} 
              className="w-4 h-5"
            />
            <div className="absolute w-[24px] h-[24px] bg-[#001B48] rounded-full -top-2 -right-2 text-white font-inter font-semibold text-[12px] flex items-center justify-center">10</div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <Image src="/images/logoo.png" alt="bell" width={43} height={43} className="w-[43px] h-[43px]" />
              <div className="flex flex-col gap-1">
                <h1 className="text-[#001B48] font-bold">FarAway</h1>
                <p className="text-[#222222] font-normal text-[14px]">Yachting</p>
              </div>
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-[#C4C4C4] rounded w-full shadow-md z-10">
                <button
                  onClick={() => { router.push("/"); setIsOpen(false) }}
                  className="w-full flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <IoIosLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer component */}
      <Drawer
        menus={AdminMenus}
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
      />
    </header >
  );
};

export default Header;
