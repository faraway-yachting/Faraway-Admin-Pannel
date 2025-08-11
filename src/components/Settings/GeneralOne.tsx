"use client"

import { useState } from "react";
import { GeneralSettingsData } from "@/data/Settings";

interface GeneralInfoProps {
    goToPrevTab: () => void;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ goToPrevTab }) => {

    const [values, setValues] = useState<Record<string, string | number>>({});
    const [visibility, setVisibility] = useState<Record<string, boolean>>({});


    const handleChange = (label: string, value: string | number) => {
        setValues((prev) => ({ ...prev, [label]: value }));
    };

    const toggleVisibility = (label: string) => {
        setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
    };


    return (
        <div>
            {GeneralSettingsData.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                    <h2 className="text-[20px] font-bold text-[#0080A7] mb-2 pb-2 border-b border-[#CCCCCC]">
                        {section.section}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {section.fields.map((field, index) => {
                            const value = values[field.label] || "";
                            const isDropdown = field.type === "dropdown";
                            const isAddress = field.label === "Address";
                            const isNumber = field.type === "number";
                            return (
                                <div key={index} className={`${isAddress ? 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3' : ''}`}>
                                    <label className="block font-bold text-[#222222] mb-2">
                                        {field.label}
                                    </label>
                                    {isDropdown ? (
                                        <div className="bg-[#F0F2F4] rounded-lg px-3 py-2 w-full">
                                            <select
                                                className={`w-full outline-0 cursor-pointer ${value ? 'text-[#222222]' : 'text-[#999999]'}`}
                                                value={value as string}
                                                onChange={(e) => handleChange(field.label, e.target.value)}
                                            >
                                                <option value="" disabled hidden>{field.placeholder}</option>
                                                {field.options?.map((option) => (
                                                    <option key={option} value={option} className="text-[#222222] outline-0 pt-4">
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : isAddress ? (
                                        <input
                                            type="text"
                                            placeholder={field.placeholder}
                                            value={value as string}
                                            onChange={(e) => handleChange(field.label, e.target.value)}
                                            className="placeholder:text-[#999999] outline-none text-[#222222] bg-[#F0F2F4] rounded-lg px-3 py-2 w-full"
                                        />
                                    ) : isNumber ? (
                                        <div className="bg-[#F0F2F4] rounded-lg px-3 py-2 w-full flex items-center justify-between">
                                            <input
                                                type={visibility[field.label] ? "text" : "password"}
                                                placeholder={field.placeholder}
                                                value={value as string}
                                                onChange={(e) => handleChange(field.label, e.target.value)}
                                                className="placeholder:text-[#999999] outline-none text-[#222222] w-full"
                                            />
                                            {field.iconone && field.icon && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleVisibility(field.label)}
                                                    className={`cursor-pointer ${visibility[field.label] ? 'text-[#222222]' : 'text-[#999999]'}`}
                                                >
                                                    {visibility[field.label] ? <field.iconone /> : <field.icon />}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={field.placeholder}
                                            value={value as string}
                                            onChange={(e) => handleChange(field.label, e.target.value)}
                                            className="placeholder:text-[#999999] outline-none text-[#222222] bg-[#F0F2F4] rounded-lg px-3 py-2 w-full"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {(section.btn || section.btnone) && (
                        <div className="mt-3 flex justify-between">
                            {section.btn &&
                                <button onClick={goToPrevTab} className="rounded-full w-[93px] h-[38px] border border-[#666666] text-[#222222] flex items-center gap-2 justify-center cursor-pointer font-medium">
                                    {section.btn}
                                </button>}
                            {section.btnone &&
                                <button className="rounded-full w-[169px] h-[38px] bg-[#0080A7] hover:bg-[#222222] text-white text-center cursor-pointer font-medium">
                                    {section.btnone}
                                </button>}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default GeneralInfo;