"use client"

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { updateBlog, getBlogById, Blog } from "@/lib/Features/Blog/blogSlice";
import type { AppDispatch, RootState } from '@/lib/Store/store';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from "formik";
import { updateBlogValidationSchema } from "@/lib/Validation/blogValidationSchema";
import { MdDeleteOutline } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import RichTextEditor from "@/common/TextEditor";
import Tick from "@/icons/Tick";
import { useEffect, useState } from "react";

interface CustomerProps {
  goToPrevTab: () => void;
  id: string | number;
}
type FormBlogUpdateValues = {
  title: string;
  slug: string;
  shortDescription: string;
  detailDescription: string;
  image: File | string | null;
};

const blogFields = [
  {
    label: "Primary Image",
    name: "image",
    type: "file",
    required: true,
    placeholder: "Upload image"
  },
  {
    label: "Slug",
    name: "slug",
    type: "text",
    required: true,
    placeholder: "Enter slug"
  },
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
    placeholder: "Enter title"
  },
  {
    label: "Short Description",
    name: "shortDescription",
    type: "text",
    required: true,
    placeholder: "Enter short description"
  },
];

const BlogUpdate: React.FC<CustomerProps> = ({ goToPrevTab, id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentBlog, loading } = useSelector((state: RootState) => state.blog);
  // Ensure blog data is loaded when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getBlogById({ blogId: id.toString() }));
    }
  }, [id, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        formik.setFieldTouched("image", true, false);
        formik.setFieldError("image", "File must be 5MB or smaller");
        e.target.value = "";
        return;
      }
      formik.setFieldValue("image", file);
      formik.setFieldError("image", undefined);
    }
  };


  const handleDelete = () => {
    formik.setFieldValue("image", null);
  };

  const formik = useFormik<FormBlogUpdateValues>({
    enableReinitialize: true,
    initialValues: {
      title: currentBlog?.title || "",
      slug: currentBlog?.slug || "",
      shortDescription: currentBlog?.shortDescription || "",
      detailDescription: currentBlog?.detailDescription || "",
      image: currentBlog?.image || null,
    },
    validationSchema: updateBlogValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          formik.setTouched({
            title: true,
            slug: true,
            shortDescription: true,
            detailDescription: true,
            image: true,
          });
          setSubmitting(false);
          return;
        }
        // Prepare the data object, only including fields that have values
        const updateData: {
          title?: string;
          slug?: string;
          shortDescription?: string;
          detailDescription?: string;
          status?: "draft" | "published";
          image?: File | string;
        } = {};
        if (values.title) updateData.title = values.title;
        if (values.slug) updateData.slug = values.slug;
        if (values.shortDescription) updateData.shortDescription = values.shortDescription;
        if (values.detailDescription) updateData.detailDescription = values.detailDescription;
        // Include status field (required by API)
        updateData.status = currentBlog?.status || "draft";
        // Only include image if it's a new File, not a string URL
        if (values.image instanceof File) {
          updateData.image = values.image;
        }

        const resultAction = await dispatch(
          updateBlog({
            blogId: id.toString(),
            data: updateData,
          })
        );

        if (updateBlog.fulfilled.match(resultAction)) {
          toast.success("Blog updated successfully", {
            onClose: () => {
              router.push("/blog");
            },
          });
          formik.resetForm();
        } else if (updateBlog.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Something went wrong.");
        }
      } catch {
        toast.error("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName: keyof FormBlogUpdateValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  // Show loading state if blog data is not available
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading blog data...</div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div>
          <h2 className="font-bold mb-2 text-[#001B48] text-[24px] pb-2 border-b border-[#CCCCCC]">
            Blog Information
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {blogFields.map((field, index) => {
              const isFileUpload = field.type === "file";
              const fieldName = field.name as keyof FormBlogUpdateValues;
              const fieldError = getFieldError(fieldName);

              return (
                <div
                  key={index}
                  className={`${isFileUpload
                    ? "col-span-1"
                    : "col-span-1"
                    }`}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <label className="block font-bold text-[#222222]">
                      {field.label}
                    </label>
                    {field.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </div>

                  {isFileUpload ? (
                    <>
                      <div
                        className={`text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${fieldError ? "border border-[#DB2828]" : ""
                          }`}
                      >
                        {!formik.values.image ? (
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                          />
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-[#222222] font-medium">
                                {(() => {
                                  const image = formik.values.image;
                                  if (!image) return "No file selected";

                                  if (image instanceof File) {
                                    const name = image.name;
                                    const extMatch = name.match(/\.[^/.]+$/);
                                    const ext = extMatch ? extMatch[0] : "";
                                    const firstWord = name
                                      .replace(/\.[^/.]+$/, "")
                                      .split(/[ .]/)[0]
                                      .slice(0, 5);
                                    return `${firstWord}${ext}`;
                                  } else if (typeof image === 'string') {
                                    const parts = image.split('/');
                                    const filename = parts[parts.length - 1];
                                    const extMatch = filename.match(/\.[^/.]+$/);
                                    const ext = extMatch ? extMatch[0] : "";
                                    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
                                    if (nameWithoutExt.length > 5) {
                                      return `${nameWithoutExt.slice(0, 5)}${ext}`;
                                    }
                                    return filename;
                                  }
                                  return "No file selected";
                                })()}
                              </p>
                              <MdDeleteOutline
                                className="cursor-pointer text-red-500"
                                onClick={handleDelete}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {fieldError && (
                        <p className="text-[#DB2828] text-sm mt-1">
                          {typeof formik.errors[fieldName] === "string" &&
                            formik.errors[fieldName]}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        name={fieldName}
                        placeholder={field.placeholder}
                        value={formik.values[fieldName] as string}
                        onChange={(e) => {
                          formik.handleChange(e);
                          formik.setFieldTouched(fieldName, true, false);
                        }}
                        onBlur={formik.handleBlur}
                        maxLength={field.name === "shortDescription" ? 600 : undefined}
                        className={`placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${fieldError ? "border border-[#DB2828]" : ""
                          }`}
                      />
                      {fieldError && (
                        <p className="text-[#DB2828] text-sm mt-1">
                          {typeof formik.errors[fieldName] === "string" &&
                            formik.errors[fieldName]}
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rich Text Editor for Detail Description */}
        <div className="mt-4 grid lg:grid-cols-2 gap-2">
          <p className="font-bold text-[#222222]">Detail Description</p>
          <div className="w-full">
            <RichTextEditor
              value={formik.values.detailDescription ?? ""}
              onChange={(html) => formik.setFieldValue("detailDescription", html)}
            />


          </div>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            onClick={goToPrevTab}
            className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium"
          >
            <MdKeyboardArrowLeft />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-full px-[16px] py-[8px] bg-[#001B48] hover:bg-[#222222] text-white flex items-center justify-center gap-2 font-medium ${loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
          >
            {loading ? "Save ..." : <><Tick /> Save</>}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default BlogUpdate;