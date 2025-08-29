"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getYachts, deleteYachts, publishYacht } from "@/lib/Features/Yachts/yachtsSlice";
import type { RootState, AppDispatch } from '@/lib/Store/store';
import { MdClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TagsDetail = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { allYachts, getLoading, totalPages, total } = useSelector((state: RootState) => state.yachts);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 10;
  const [yachtsToDelete, setYachtsToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(getYachts({ page: currentPages, limit: itemsPerPage }));
  }, [currentPages, itemsPerPage, dispatch]);


  const filteredData = allYachts
    .filter(yachts =>
      yachts?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  const isFiltering = searchTerm.trim() !== '';
  const currentItems = filteredData;



  const handleConfirm = () => {
    if (yachtsToDelete) {
      dispatch(deleteYachts(yachtsToDelete))
        .unwrap()
        .then(() => {
          toast.success("Yachts deleted successfully");
          setIsModalOpen(false);
          dispatch(getYachts({ page: currentPages, limit: itemsPerPage }));
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete yacht");
        });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };



  return (
    <>
      <div>
        <BreadCrum onSearch={setSearchTerm} />
        

        {isModalOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#BABBBB]/40 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold text-center">
                Are you sure you want to delete?
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <button
                  onClick={handleConfirm}
                  className="px-[16px] py-[7px] border border-[#DB2828] text-[#DB2828] rounded-full font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <TiTick />
                  Yes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-[16px] py-[7px] border border-[#2185D0] text-[#989898] hover:text-[#2185D0] rounded-full transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <MdClose />
                  No
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TagsDetail;