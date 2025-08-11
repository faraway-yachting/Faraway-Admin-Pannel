"use client"

import { useRouter } from 'next/navigation';
import { IoSearchSharp } from "react-icons/io5";

interface BreadCrumProps {
    onSearch: (term: string) => void;
}

const BreadCrum: React.FC<BreadCrumProps> = ({ onSearch }) => {

    const router = useRouter();

    const handleAddNewVehicle = () => {
        router.push("/yachts/addnewyachts");
    };

    return (
        <div className="flex justify-between items-center bg-white shadow-xs rounded-2xl px-3 py-5">
            <div className="border border-[#999999] w-[246px] py-[7px] bg-white flex items-center rounded-full px-2 justify-between gap-2">
                <IoSearchSharp className="text-[#999999] text-[24px] cursor-pointer" />
                <input type="text" placeholder="Search yachts" onChange={(e) => onSearch(e.target.value)} className="placeholder:text-[#999999] w-full outline-none text-[#222222]" />
            </div>
            <div className="hidden md:flex items-center gap-3">
                <button className="px-[16px] py-[7px] rounded-full bg-[#012A50] hover:bg-[#5F5C63] text-center font-medium text-white cursor-pointer hover:text-white" onClick={handleAddNewVehicle}>+ Add New Yachts</button>
            </div>
        </div>
    );
};

export default BreadCrum;