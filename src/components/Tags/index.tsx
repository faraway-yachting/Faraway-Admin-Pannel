"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getTags, deleteTags } from "@/lib/Features/Tags/tagsSlice";
import type { RootState, AppDispatch } from '@/lib/Store/store';
import { MdClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TagsDetail = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { allTags, getLoading, totalPages, total } = useSelector((state: RootState) => state.tags);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 10;
  const [yachtsToDelete, setYachtsToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(getTags({ page: currentPages, limit: itemsPerPage }));
  }, [currentPages, itemsPerPage, dispatch]);


  const filteredData = allTags
    ?.filter(tags =>
      tags?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  const isFiltering = searchTerm.trim() !== '';
  const currentItems = filteredData;



  const handleConfirm = () => {
    if (yachtsToDelete) {
      dispatch(deleteTags(yachtsToDelete))
        .unwrap()
        .then(() => {
          toast.success("Tags deleted successfully");
          setIsModalOpen(false);
          dispatch(getTags({ page: currentPages, limit: itemsPerPage }));
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete tags");
        });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };



  return (
    <>
      <div className="">
        <BreadCrum onSearch={setSearchTerm} />
        
        {getLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.1rem)]">
            <div className="w-10 h-10 border-3 border-t-transparent border-[#012A50] rounded-full animate-spin" />
          </div>
        ) : isFiltering && currentItems.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.1rem)] text-lg text-[#012A50]">
            No data available.
          </div>
        ) : allTags?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {currentItems.map((tag, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-[#012A50] mb-2">{tag.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{tag.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Slug: {tag.slug}</span>
                  <button
                    onClick={() => {
                      setYachtsToDelete(tag._id);
                      setIsModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-11.6rem)] text-lg text-[#012A50]">
            No tags available.
          </div>
        )}

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