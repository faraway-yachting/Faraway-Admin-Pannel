"use client"

import { useState } from "react";
import Image from "next/image";
import General from "./General";
import GeneralOne from "./GeneralOne";
import { MdDeleteOutline } from "react-icons/md";

const Settings: React.FC = () => {

    const [showSettings, setShowSettings] = useState(false);


    return (
        <div className="flex flex-col lg:flex-row gap-2 mt-3">
            <div className="bg-white shadow-xs rounded-lg px-2 py-2 'w-full lg:w-[70%] xl:w-[75%] h-fit">
                {showSettings ? (
                    <GeneralOne goToPrevTab={() => setShowSettings(false)} />
                ) : (
                    <General goToNextTab={() => setShowSettings(true)} />
                )}
            </div>
            <div className="w-full lg:w-[30%] xl:w-[26%]">
                <div className="flex flex-col gap-3">
                    <div className="bg-white shadow-xs rounded-lg px-2 py-2">
                        <h2 className="text-[20px] font-bold text-[#0080A7] mb-2 pb-2 border-b border-[#CCCCCC]">Profile Image</h2>
                        <div className="flex justify-center">
                            <Image src="/images/main.svg" alt="img" width={400} height={400} />
                        </div>
                    </div>
                    <div className="flex justify-center gap-3">
                        <button className="rounded-full px-[16px] py-[7px] bg-[#0080A7] hover:bg-[#222222] text-white text-center cursor-pointer font-medium flex items-center justify-center gap-2">
                            <Image src="/images/photo.svg" alt="img" width={16} height={16} />
                            Change Profile
                        </button>
                        <button className="rounded-full px-[16px] py-[7px] border border-[#DB2828] text-[#DB2828] flex items-center gap-2 justify-center cursor-pointer font-medium">
                            <MdDeleteOutline />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;