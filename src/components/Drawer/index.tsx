"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "@/data/Sidebar/menu";
import { MdKeyboardArrowRight } from "react-icons/md";

interface Props {
    menus: SidebarMenu[];
    isOpen: boolean;
    onClose: () => void;
}
const Drawer: React.FC<Props> = ({ menus, isOpen, onClose }) => {

    const router = useRouter();
    const location = usePathname();

    const isActive = (link: string) => {
        if (link === "/") return location === "/";
        return location.startsWith(link);
    };

    const handleNavigation = (link?: string, isLogout = false) => {
        if (isLogout) {
            localStorage.removeItem("token");
        }
        if (link) {
            router.push(link);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-20 bg-[#BABBBB]/40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            onClick={onClose}
        >
            <div
                className={`fixed inset-y-0 left-0 bg-[#ecebeb] w-[264px] shadow-lg z-30 transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-64"
                    } `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex items-center justify-center h-20 3xl:h-24 border-b border-gray-300">
                    <Image 
            src="/images/logo.png" 
            alt="logo" 
            width={200} 
            height={51} 
            className="lg:w-[165px] xl:w-[200px] h-auto" 
        />
                    <span
                        className="fixed right-[-12px] top-[66px] w-6 h-6 rounded-full rotate-180 bg-[#79BCD1] text-white flex justify-center items-center"
                        onClick={onClose}
                    >
                        <MdKeyboardArrowRight size={20} />
                    </span>
                </div>
                <nav className="pl-4 pt-6 pb-20 sm:py-6 space-y-4 3xl:space-y-6 overflow-y-auto scrollbar-hide h-[calc(100vh-80px)] 3xl:h-[calc(100vh-96px)]">
                    {menus.map((sidebarMenu, index) => {
                        const nonLogoutItems = sidebarMenu.menuItems.filter(
                            (item) => item.id !== "logout"
                        );
                        const logoutItem = sidebarMenu.menuItems.find(
                            (item) => item.id === "logout"
                        );
                        return (
                            <div key={index} className="h-full relative">
                                <ul className="space-y-4">
                                    {nonLogoutItems.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleNavigation(item.link)}
                                                className={`flex w-full cursor-pointer items-center gap-3 p-2 text-sm font-bold 3xl:text-base capitalize rounded-tl-full rounded-bl-full rounded-tr-2xl rounded-br-2xl hover:bg-blue hover:text-text-[#222222] transition-colors duration-300 ${isActive(item.link || "")
                                                    ? "bg-[#001B48] text-white pl-3"
                                                    : "text-[#222222]"
                                                    }`}
                                            >
                                                {item.icon && (
                                                    <span>
                                                        <item.icon />
                                                    </span>
                                                )}
                                                <span>{item.title}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                {logoutItem && (
                                    <div className="absolute bottom-6 w-full pr-4">
                                        <button
                                            type="button"
                                            onClick={() => handleNavigation(logoutItem.link, true)}
                                            className={`flex w-full cursor-pointer items-center gap-3 p-2 text-sm font-bold 3xl:text-base capitalize rounded-tl-full rounded-bl-full rounded-tr-2xl rounded-br-2xl hover:bg-blue hover:text-text-[#222222] transition-colors duration-300 ${location === "/"
                                                ? "bg-[#001B48] text-white pl-3"
                                                : "text-[#222222]"
                                                }`}
                                        >
                                            {logoutItem.icon && (
                                                <span>
                                                    <logoutItem.icon />
                                                </span>
                                            )}
                                            <span>{logoutItem.title}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Drawer;

