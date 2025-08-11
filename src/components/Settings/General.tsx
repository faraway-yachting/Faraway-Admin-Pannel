"use client"

import { useRouter } from "next/navigation";
import { SettingsData } from "@/data/Settings";

interface CustomersProps {
    goToNextTab: () => void;
}

const General: React.FC<CustomersProps> = ({ goToNextTab }) => {

    const router = useRouter();

    return (
        <div>
            {SettingsData.map((section, Idx) => (
                <div key={Idx}>
                    {section.section && (
                        <h2 className="text-[20px] font-bold text-[#0080A7] mb-2 pb-2 border-b border-[#CCCCCC]">{section.section}</h2>
                    )}
                    {section.array && (
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                            {section.array.map((item, idx) => (
                                <div key={idx} className="flex">
                                    <div className="flex items-center gap-1 w-1/2">
                                        <span className="text-[#222222] font-bold">{item.label}</span>
                                        <span className="text-[#222222] font-normal text-[14px]">{item.optional}</span>
                                    </div>
                                    <span className={`font-inter font-medium text-[#222222] w-1/2`}>{item.data}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {(section.btn || section.btnone) && (
                        <div className="mt-3 flex justify-between">
                            {section.btn &&
                                <button onClick={() => router.push('/accounting')} className="rounded-full px-[22px] py-[8px] border border-[#666666] text-[#222222] flex items-center gap-2 justify-center cursor-pointer font-medium">
                                    {section.btn}
                                </button>}
                            {section.btnone &&
                                <button onClick={goToNextTab} className="rounded-full px-[16px] py-[8px] bg-[#0080A7] hover:bg-[#222222] text-white text-center cursor-pointer font-medium flex items-center justify-center gap-2">
                                    {section.icon && <section.icon />}
                                    {section.btnone}
                                </button>
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default General;