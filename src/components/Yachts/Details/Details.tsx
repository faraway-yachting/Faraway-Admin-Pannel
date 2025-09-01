"use client"

import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from '@/lib/Store/store';
import DOMPurify from 'dompurify';

interface CustomersProps {
    goToNextTab: () => void;
}

function formatDateToDDMMYY(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

const Yachts: React.FC<CustomersProps> = ({ goToNextTab }) => {

    const router = useRouter();
    const { yachts } = useSelector((state: RootState) => state.yachts);

    const GeneralInfoData = [
        {
            array: [
                { label: "Title", data: yachts?.title || "N/A" },
                { label: "Boat Type", data: yachts?.boatType || "N/A" },
                { label: "Yacht Type", data: yachts?.type || "N/A" },
                { label: "Category", data: yachts?.price || "N/A" },
                { label: "Capacity", data: yachts?.capacity || "N/A" },
                { label: "Length", data: `${yachts?.length}ft` || "N/A" },
                { label: "Cabins", data: yachts?.cabins || "N/A" },
                { label: "Bathrooms", data: yachts?.bathrooms || "N/A" },
                { label: "Passenger Day Trip", data: yachts?.passengerDayTrip || "N/A" },
                { label: "Passenger Overnight", data: yachts?.passengerOvernight || "N/A" },
                { label: "Guests", data: yachts?.guests || "N/A" },
                { label: "Guests Range", data: yachts?.guestsRange || "N/A" },
                { label: "Day Trip Price", data: yachts?.dayTripPrice || "N/A" },
                { label: "Overnight Price", data: yachts?.overnightPrice || "N/A" },
                { label: "Day Trip Price Euro", data: `${yachts?.daytripPriceEuro}€` || "N/A" },
                { label: "Length Range", optional: "(Optional)", data: yachts?.lengthRange || "N/A" },
                { label: "Badge", optional: "(Optional)", data: yachts?.badge || "N/A" },
                { label: "Built", optional: "(Optional)", data: formatDateToDDMMYY(yachts?.built || "N/A") },
                { label: "Design", optional: "(Optional)", data: yachts?.design || "N/A" },
                { label: "Cruising Speed", optional: "(Optional)", data: yachts?.cruisingSpeed || "N/A" },
                { label: "Length Overall", optional: "(Optional)", data: yachts?.lengthOverall || "N/A" },
                { label: "Fuel Capacity", optional: "(Optional)", data: yachts?.fuelCapacity || "N/A" },
                { label: "Water Capacity", optional: "(Optional)", data: yachts?.waterCapacity || "N/A" },
                { label: "Code", optional: "(Optional)", data: yachts?.code || "N/A" },
            ],
            iconone: MdKeyboardArrowLeft,
            btn: "Back",
            icon: MdEdit,
            btnone: "Edit",
        },
    ];

    return (
        <div className="">
            {GeneralInfoData.map((section, Idx) => (
                <div key={Idx}>
                    {section.array && (
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                            {section.array
                                .filter((item) => item.data !== "N/A")
                                .map((item, idx) => (
                                    <div key={idx} className="flex">
                                        <div className="flex items-center gap-1 w-1/2">
                                            <span className="text-[#222222] font-bold">{item.label}</span>
                                            <span className="text-[#222222] font-normal text-[14px]">{item.optional}</span>
                                        </div>
                                        <span className="font-inter font-medium text-[#222222] w-1/2 break-words">{item.data}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <h2 className="font-bold text-[#222222] mb-4">Tags</h2>
                        <div className="space-y-2">
                            {yachts?.tags?.map((tag) => (
                                <div key={tag} className="flex items-center">
                                    <span className="text-[#222222] mr-2">•</span>
                                    <span className="text-[#222222] font-medium text-[14px]">{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {yachts?.dayCharter?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Day Charter</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(yachts.dayCharter || "") }}
                            />
                        </div>
                    )}
                    {yachts?.overnightCharter?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Overnight Charter</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(yachts.overnightCharter || "") }}
                            />
                        </div>
                    )}
                    {yachts?.aboutThisBoat?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">About this Boat</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(yachts.aboutThisBoat || "") }}
                            />
                        </div>
                    )}
                    {yachts?.specifications?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Specifications</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(yachts.specifications || "") }}
                            />
                        </div>
                    )}
                    {yachts?.boatLayout?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Boat Layout</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: yachts.boatLayout }}
                            />
                        </div>
                    )}
                    {(section.btn || section.btnone) && (
                        <div className="mt-3 flex justify-between">
                            {section.btn &&
                                <button onClick={() => router.push('/yachts')} className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium">
                                    {section.iconone && <section.iconone />}
                                    {section.btn}
                                </button>}
                            {section.btnone &&
                                <button onClick={goToNextTab} className="rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2">
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

export default Yachts;