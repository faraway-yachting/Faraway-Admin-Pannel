"use client"

import { useState, useEffect } from "react";
import Yachts from "./Details";
import Yacht from "./DetailsOne"
import YachtsUpdate from "./Update";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getYachtsById } from "@/lib/Features/Yachts/yachtsSlice";
import type { AppDispatch, RootState } from '@/lib/Store/store';

interface VendorsProps {
    id: string | number;
}

const YachtsDetail: React.FC<VendorsProps> = ({ id }) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [showGeneralInfo, setShowGeneralInfo] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.yachts);

    useEffect(() => {
        dispatch(getYachtsById({ yachtsId: id as string }));
    }, [id, dispatch]);

    useEffect(() => {
        if (activeIndex === 0) {
            setActiveIndex(0);
        }
    }, [activeIndex]);


    return (
        <div>
            {loading && !showGeneralInfo ? (
                <div className="flex items-center justify-center h-[calc(100vh-112px)]">
                    <div className="w-10 h-10 border-3 border-t-transparent border-[#001B48] rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <BreadCrum />
                    <div className={`${showGeneralInfo === false ? "flex flex-col lg:flex-row gap-2" : ""} mt-4`}>
                        <div className={`${showGeneralInfo === false ? "w-full lg:w-[70%] xl:w-[75%]" : ""} bg-white shadow-xs rounded-2xl px-5 py-5 overflow-hidden h-fit`}>
                            {activeIndex === 0 && (
                                showGeneralInfo ?
                                    <YachtsUpdate goToPrevTab={() => setShowGeneralInfo(false)} id={id} />
                                    :
                                    <Yachts goToNextTab={() => setShowGeneralInfo(true)} />
                            )}
                        </div>
                        <div className={`${showGeneralInfo === false ? "w-full lg:w-[30%] xl:w-[26%]" : ""}`}>
                            {activeIndex === 0 && (
                                showGeneralInfo ?
                                    null
                                    :
                                    <Yacht />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default YachtsDetail;