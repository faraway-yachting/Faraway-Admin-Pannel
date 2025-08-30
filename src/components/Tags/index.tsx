"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getTags, deleteTags } from "@/lib/Features/Tags/tagsSlice";
import { FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import { MdClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TagsDetail = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { allTags, getLoading, totalPages, total } = useSelector(
    (state: RootState) => state.tags
  );
  console.log(allTags, "Tags Data");
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 10;
  const [yachtsToDelete, setYachtsToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(getTags({ page: currentPages, limit: itemsPerPage }));
  }, [currentPages, itemsPerPage, dispatch]);

  const filteredData =
    allTags?.filter((tags) =>
      tags?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  const isFiltering = searchTerm.trim() !== "";
  const currentItems = filteredData;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPages(newPage);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | string)[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, "...", totalPages - 1, totalPages);
    }
    return pages.map((p, index) => (
      <button
        key={index}
        className={`w-[35px] h-[35px] rounded-full border cursor-pointer ${
          currentPages === p
            ? "bg-[#012A50] text-white"
            : "bg-white text-[#012A50]"
        }`}
        onClick={() => typeof p === "number" && handlePageChange(p)}
        disabled={p === "..."}
      >
        {p}
      </button>
    ));
  };

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

  // Helper function to truncate text to 15 words
  const truncateToWords = (text: string, wordLimit: number = 15) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <>
      <div className={`${currentItems.length > 7 ? "h-auto" : "h-[calc(100vh-115px)]"}`}>
        <BreadCrum onSearch={setSearchTerm} />
        <div className="mt-4">
          {getLoading ? (
            <div className="flex items-center justify-center h-[calc(100vh-14.1rem)]">
              <div className="w-10 h-10 border-3 border-t-transparent border-[#012A50] rounded-full animate-spin" />
            </div>
          ) : isFiltering && currentItems.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-14.1rem)] text-lg text-[#012A50]">
              No data available.
            </div>
          ) : allTags?.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="w-full border-collapse table-fixed">
                <thead className="bg-[#012A50] text-white">
                  <tr>
                    <th className="w-1/4 px-4 py-3 text-left">Name</th>
                    <th className="w-1/4 px-4 py-3 text-left">Slug</th>
                    <th className="w-1/3 px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((tag, index) => (
                    <tr
                      key={index}
                      onClick={() => router.push(`/tags/${tag._id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-[#012A50]">
                        {tag.Name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{tag.Slug}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div title={tag.Description}>
                          {truncateToWords(tag.Description)}
                        </div>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-center gap-4">
                        <button onClick={() => router.push(`/tags/${tag._id}`)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setYachtsToDelete(tag._id);
                            setIsModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-14.1rem)] text-lg text-[#012A50]">
              No tags available.
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10">
          {total > 10 && !isFiltering && !getLoading && (
            <div className="flex gap-2 items-center">
              {currentPages > 1 && (
                <button
                  className="w-[35px] h-[35px] text-[16px] cursor-pointer text-[#012A50] flex justify-end items-center"
                  onClick={() => handlePageChange(currentPages - 1)}
                >
                  <FaChevronLeft />
                </button>
              )}
              {renderPagination()}
              {currentPages < totalPages && (
                <button
                  className="w-[35px] h-[35px] text-[16px] cursor-pointer text-[#012A50]"
                  onClick={() => handlePageChange(currentPages + 1)}
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          )}
        </div>

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
