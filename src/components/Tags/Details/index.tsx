"use client";

import { useState, useEffect } from "react";
import Details from "./Details";
import Update from "./Update";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getTagsById } from "@/lib/Features/Tags/tagsSlice";
import type { AppDispatch, RootState } from "@/lib/Store/store";

interface VendorsProps {
  id: string | number;
}

const TagsDetail: React.FC<VendorsProps> = ({ id }) => {
  
  const [showGeneralInfo, setShowGeneralInfo] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.tags);

  useEffect(() => {
    dispatch(getTagsById({ tagsId: id as string }));
  }, [id, dispatch]);

  return (
    <div className={`${!showGeneralInfo ? "h-[calc(100vh-115px)]" : ""}`}>
      {loading && !showGeneralInfo ? (
        <div className="flex items-center justify-center h-[calc(100vh-112px)]">
          <div className="w-10 h-10 border-3 border-t-transparent border-[#001B48] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <BreadCrum showGeneralInfo={showGeneralInfo} />
          <div className="mt-4">
            {showGeneralInfo ? (
              <Update
                goToPrevTab={() => setShowGeneralInfo(false)}
                id={id}
              />
            ) : (
              <Details goToNextTab={() => setShowGeneralInfo(true)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TagsDetail;
