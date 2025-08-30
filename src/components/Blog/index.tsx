"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getBlogs, deleteBlog, publishBlog } from "@/lib/Features/Blog/blogSlice";
import type { RootState, AppDispatch } from '@/lib/Store/store';
import { FaChevronLeft, FaChevronRight, FaTrash, FaGlobe, FaArchive } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BlogDetail = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { allBlogs, getLoading, totalPages, total } = useSelector((state: RootState) => state.blog);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 10;
  const [yachtsToDelete, setYachtsToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishingYachtId, setPublishingYachtId] = useState<string | null>(null);
  const [yachtToUnpublish, setYachtToUnpublish] = useState<string | null>(null);
  const [yachtToPublish, setYachtToPublish] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(getBlogs({ page: currentPages, limit: itemsPerPage }));
  }, [currentPages, itemsPerPage, dispatch]);

  const filteredData = allBlogs
    .filter(blog =>
      blog?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  const isFiltering = searchTerm.trim() !== '';
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
        className={`w-[35px] h-[35px] rounded-full border cursor-pointer ${currentPages === p ? "bg-[#012A50] text-white" : "bg-white text-[#012A50]"
          }`}
        onClick={() => typeof p === "number" && handlePageChange(p)}
        disabled={p === "..."}
      >
        {p}
      </button>
    ));
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setYachtsToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (yachtsToDelete) {
      dispatch(deleteBlog(yachtsToDelete))
        .unwrap()
        .then(() => {
          toast.success("Blog deleted successfully");
          setIsModalOpen(false);
          dispatch(getBlogs({ page: currentPages, limit: itemsPerPage }));
        })
        .catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete blog";
          toast.error(errorMessage);
        });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePublishClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setYachtToPublish(id);
    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = async () => {
    if (yachtToPublish) {
      setPublishingYachtId(yachtToPublish);
      try {
        const currentBlog = allBlogs.find(blog => blog._id === yachtToPublish);
        let newStatus: "draft" | "published";
        // Default to "draft" if no status field exists, otherwise check current status
        const currentStatus = currentBlog?.status || "draft";
        if (currentStatus === "published") {
          newStatus = "draft";
        } else {
          newStatus = "published";
        }
        const resultAction = await dispatch(publishBlog({ blogId: yachtToPublish, status: newStatus }));
        if (publishBlog.fulfilled.match(resultAction)) {
          const actionText = newStatus === "published" ? "published" : "archived";
          toast.success(`Blog ${actionText} successfully`);
          // Refresh the blog list to show updated status
          dispatch(getBlogs({ page: currentPages, limit: itemsPerPage }));
        } else if (publishBlog.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Failed to update blog status.");
        }
      } catch {
        toast.error("An unexpected error occurred");
      } finally {
        setPublishingYachtId(null);
      }
    }
    setIsPublishModalOpen(false);
  };

  const handleUnpublishClick = (e: React.MouseEvent, yachtId: string) => {
    e.stopPropagation();
    setYachtToUnpublish(yachtId);
    setIsUnpublishModalOpen(true);
  };

  const handleUnpublishConfirm = async () => {
    if (yachtToUnpublish) {
      setPublishingYachtId(yachtToUnpublish);
      try {
        const resultAction = await dispatch(publishBlog({ blogId: yachtToUnpublish, status: "draft" }));
        if (publishBlog.fulfilled.match(resultAction)) {
          toast.success("Blog unpublished successfully");
          // Refresh the blog list to show updated status
          dispatch(getBlogs({ page: currentPages, limit: itemsPerPage }));
        } else if (publishBlog.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Failed to unpublish blog.");
        }
      } catch {
        toast.error("An unexpected error occurred");
      } finally {
        setPublishingYachtId(null);
      }
    }
    setIsUnpublishModalOpen(false);
  };

  const handleUnpublishCancel = () => {
    setIsUnpublishModalOpen(false);
  };

  const handlePublishCancel = () => {
    setIsPublishModalOpen(false);
  };

  // Get the current blog and action text for the modal
  const getModalText = () => {
    if (!yachtToPublish || !allBlogs.length) return "Are you sure you want to publish this blog?";
    const currentBlog = allBlogs.find(blog => blog._id === yachtToPublish);
    const currentStatus = currentBlog?.status || "draft";
    const actionText = currentStatus === "published" ? "archive" : "publish";
    return `Are you sure you want to ${actionText} this blog?`;
  };

  return (
    <>
      <div className={`${currentItems.length > 3 ? "h-auto" : "h-[calc(100vh-115px)]"}`}>
        <BreadCrum onSearch={setSearchTerm} />
        {getLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.5rem)]">
            <div className="w-10 h-10 border-3 border-t-transparent border-[#012A50] rounded-full animate-spin" />
          </div>
        ) : isFiltering && currentItems.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.5rem)] text-lg text-[#012A50]">
            No data available.
          </div>
        ) : allBlogs?.length > 0 ? (
          <div className="grid grid-cols-3 gap-7 mt-[12px]">
            {currentItems.map((blogItem, blogIndex) => {
              return (
                <div key={blogIndex} className="group cursor-pointer mb-3 pb-5 border border-gray-300 rounded-tl-3xl rounded-b-lg overflow-hidden bg-white hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300" >
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => router.push(`/blog/${blogItem._id}`)}
                  >
                    <div className="hidden md:block relative rounded-tl-3xl rounded-br-3xl w-full overflow-hidden">
                      <Image
                        src={typeof blogItem?.image === 'string' ? blogItem.image : '/images/placeholder.jpg'}
                        alt="Blog image"
                        width={450}
                        height={258}
                        className="w-full h-[270px] object-cover "
                      />
                      <div className="absolute top-3 right-4 z-10">
                        <button
                          className="cursor-pointer font-plusjakarta font-extrabold text-sm text-red-500 flex items-center gap-1 bg-[#012A50] backdrop-blur-sm p-2 rounded-full hover:bg-[#5F5C63] transition-colors"
                          onClick={(e) => blogItem._id && handleDeleteClick(e, blogItem._id)}
                        >
                          <FaTrash className="text-white text-lg" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 bg-[#001B48] w-full py-4 rounded-tl-4xl">
                        <h3 className="font-plusjakarta font-extrabold text-center text-base md:text-lg lg:text-xl text-white leading-tight px-4">
                          {blogItem.title && blogItem.title.length > 27 ? `${blogItem.title.substring(0, 27)}...` : blogItem.title || 'Untitled'}
                        </h3>
                      </div>
                    </div>
                    <div className="pt-[4px] px-4 flex flex-col h-50">
                      <p className="font-plusjakarta font-normal text-base lg:text-lg text-[#666666] mt-2 flex-1 overflow-hidden line-clamp-3">{blogItem.shortDescription && blogItem.shortDescription.length > 200 ? `${blogItem.shortDescription.substring(0, 200)}...` : blogItem.shortDescription || 'No description available'}</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            const currentStatus = blogItem.status || "draft";
                            if (currentStatus === "published") {
                              if (blogItem._id) handleUnpublishClick(e, blogItem._id);
                            } else {
                              if (blogItem._id) handlePublishClick(e, blogItem._id);
                            }
                          }}
                          disabled={publishingYachtId === blogItem._id}
                          className={`px-[22px] py-[7px] rounded-full text-center font-medium flex items-center gap-1
                               ${publishingYachtId === blogItem._id
                              ? "bg-[#012A50] text-white cursor-not-allowed"
                              : "bg-[#012A50] hover:bg-[#5F5C63] text-white cursor-pointer"
                            }`}
                        >
                          {publishingYachtId === blogItem._id ? (
                            (blogItem.status || "draft") === "published" ? (
                              <>
                                <FaArchive className="text-sm" />
                                Archiving...
                              </>
                            ) : (
                              <>
                                <FaGlobe className="text-sm" />
                                Publishing...
                              </>
                            )
                          ) : (blogItem.status || "draft") === "published" ? (
                            <>
                              <FaArchive className="text-sm" />
                              Publish
                            </>
                          ) : (
                            <>
                              <FaGlobe className="text-sm" />
                              Draft
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-lg text-[#012A50]">
            No data available.
          </div>
        )}
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

        {isPublishModalOpen && isClient && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#BABBBB]/40 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold text-center">
                {getModalText()}
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <button
                  onClick={handlePublishConfirm}
                  className="px-[16px] py-[7px] border border-[#00B374] text-[#00B374] rounded-full font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <TiTick />
                  Yes
                </button>
                <button
                  onClick={handlePublishCancel}
                  className="px-[16px] py-[7px] border border-[#2185D0] text-[#989898] hover:text-[#2185D0] rounded-full transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <MdClose />
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {isUnpublishModalOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#BABBBB]/40 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold text-center">
                Are you sure you want to unpublish this blog?
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <button
                  onClick={handleUnpublishConfirm}
                  className="px-[16px] py-[7px] border border-[#dc3545] text-[#dc3545] rounded-full font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <TiTick />
                  Yes
                </button>
                <button
                  onClick={handleUnpublishCancel}
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

export default BlogDetail;