"use client"

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { updateBlog, getBlogById } from "@/lib/Features/Blog/blogSlice";
import type { AppDispatch, RootState } from '@/lib/Store/store';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from "formik";
import { updateBlogValidationSchema } from "@/lib/Validation/blogValidationSchema";
import { MdDeleteOutline } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import RichTextEditor from "@/common/TextEditor";
import Tick from "@/icons/Tick";
import { useEffect, useRef } from "react";

interface CustomerProps {
  goToPrevTab: () => void;
  id: string | number;
}
type FormBlogUpdateValues = {
  title: string;
  slug: string;
  shortDescription: string;
  detailDescription: string;
  image: File | string;
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
  }
];

const BlogUpdate: React.FC<CustomerProps> = ({ goToPrevTab, id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentBlog, loading } = useSelector((state: RootState) => state.blog);
  const hasInitialized = useRef(false);
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
    formik.setFieldValue("image", "");
  };

  const formik = useFormik<FormBlogUpdateValues>({
    enableReinitialize: true,
    initialValues: {
      title: currentBlog?.title || "",
      slug: currentBlog?.slug || "",
      shortDescription: currentBlog?.shortDescription || "",
      detailDescription: currentBlog?.detailDescription || "",
      image: currentBlog?.image || "",
    },
    validationSchema: updateBlogValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Validate all required fields
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          // Set all fields as touched to show validation errors
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
        
        // Ensure image is provided
        if (!values.image && !currentBlog?.image) {
          toast.error("Image is required");
          return;
        }
        
        // Prepare the data object with required values
        const updateData: {
          title: string;
          slug: string;
          shortDescription: string;
          detailDescription: string;
          status: "draft" | "published";
          image: File | string;
        } = {
          title: values.title,
          slug: values.slug,
          shortDescription: values.shortDescription,
          detailDescription: values.detailDescription,
          status: currentBlog?.status || "draft",
          image: values.image || currentBlog?.image || "",
        };

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



  // Initialize form values when currentBlog first loads
  useEffect(() => {
    if (currentBlog && !hasInitialized.current) {
      console.log('=== INITIALIZING FORM ===');
      console.log('Setting initial values from blog data...');
      
      // Use formik.resetForm to properly initialize all values
      formik.resetForm({
        values: {
          title: currentBlog.title || "",
          slug: currentBlog.slug || "",
          shortDescription: currentBlog.shortDescription || "",
          detailDescription: currentBlog.detailDescription || "",
          image: currentBlog.image || "",
        }
      });
      
      hasInitialized.current = true;
      console.log('Form initialized successfully');
      console.log('========================');
    }
  }, [currentBlog, formik]);

  const getFieldError = (fieldName: keyof FormBlogUpdateValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  // Show loading state if blog data is not available
  if (loading || !currentBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading blog data...</div>
      </div>
    );
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        {/* Blog Information Section */}
        <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
          <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
            Blog Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogFields.map((field, index) => {
              const isFileUpload = field.type === "file";
              const fieldName = field.name as keyof FormBlogUpdateValues;
              const fieldError = getFieldError(fieldName);

              return (
                <div
                  key={index}
                  className={`${isFileUpload
                    ? "col-span-1 md:col-span-1 lg:col-span-1"
                    : "col-span-1"
                    }`}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <label className="block font-bold text-[#222222]">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>

                  {isFileUpload ? (
                    <>
                      <div
                        className={`text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${fieldError ? "border border-[#DB2828]" : ""
                          }`}
                      >
                        {!formik.values.image || formik.values.image === "" ? (
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
        <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
          <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
            Detail Description
          </p>
          <div className="w-full">
            <RichTextEditor
              key={currentBlog?._id || 'loading'}
              value={formik.values.detailDescription || ""}
              onChange={(html) => {
                formik.setFieldValue("detailDescription", html);
              }}
            />
          </div>
        </div>
      
        {/* Action Buttons */}
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
            className={`rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"
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