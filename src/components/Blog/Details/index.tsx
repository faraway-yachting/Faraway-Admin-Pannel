"use client";

import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import Image from "next/image";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { getBlogById } from "@/lib/Features/Blog/blogSlice";

interface BlogDetailsProps {
  id: string;
  goToNextTab?: () => void;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ id, goToNextTab }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const blogState = useSelector((state: RootState) => state.blog);
  const { currentBlog, loading, error } = blogState;

  useEffect(() => {
    if (id) {
      dispatch(getBlogById({ blogId: id }));
    }
  }, [id, dispatch]);

  const blogInfoData = [
    {
      array: [
        { label: "Title", data: currentBlog?.title || "N/A" },
        { label: "Slug", data: currentBlog?.slug || "N/A" },
        { label: "Status", data: currentBlog?.status || "N/A" },
      ],
      iconone: MdKeyboardArrowLeft,
      btn: "Back",
      icon: MdEdit,
      btnone: "Edit",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-106px)]">
        <div className="w-10 h-10 border-3 border-t-transparent border-[#012A50] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">No blog found</div>
        <div className="mt-4">
          <button
            onClick={() => {
              // Temporary test - dispatch a mock blog
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test with Mock Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Blog Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          {/* Blog Information */}
          {blogInfoData.map((section, Idx) => (
            <div key={Idx}>
              {section.array && (
                <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
                  <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Blog Information
                  </p>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                    {section.array
                      .filter((item) => item.data !== "N/A")
                      .map((item, idx) => (
                        <div key={idx} className="flex">
                          <div className="flex items-center gap-1 w-1/3">
                            <span className="text-[#222222] font-bold">
                              {item.label}:
                            </span>
                          </div>
                          <span className="font-inter font-medium text-[#222222] w-1/2 break-words">
                            {item.data}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {currentBlog?.shortDescription?.trim() && (
                <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
                  <h2 className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Short Description
                  </h2>
                  <div className="prose max-w-full">
                    <p className="text-[#222222] font-medium leading-relaxed">
                      {currentBlog.shortDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          {currentBlog?.image && (
            <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
              <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                Blog Image
              </p>
              {currentBlog.image && (
                <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                  <Image
                    src={currentBlog.image as string}
                    alt="Blog Image"
                    width={400}
                    height={250}
                    className="rounded-lg w-full h-auto max-h-[300px] object-cover"
                    unoptimized={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Short Description */}

      {/* Detailed Description */}
      {currentBlog?.detailDescription?.trim() && (
        <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
          <h2 className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
            Detailed Description
          </h2>
          <div
            className="prose max-w-full"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentBlog.detailDescription || ""),
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 flex justify-between">
        <button
          onClick={() => router.push("/blog")}
          className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium"
        >
          <MdKeyboardArrowLeft />
          Back
        </button>
        <button
          onClick={goToNextTab}
          className="rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2"
        >
          <MdEdit />
          Edit
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
