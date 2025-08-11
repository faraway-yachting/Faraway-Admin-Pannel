"use client";
import { useRouter } from "next/navigation";
import Tick from "@/icons/Tick";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import { useFormik } from "formik";
import { addBlog } from "@/lib/Features/Blog/blogSlice";
import { addBlogValidationSchema } from "@/lib/Validation/blogValidationSchema";
import RichTextEditor from "@/common/TextEditor";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormValues = {
  image: File | null;
  slug: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  status?: string;
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
    label: "Description",
    name: "shortDescription",
    type: "text",
    required: true,
    placeholder: "Enter description"
  }
];

const BlogDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.blog.addLoading);

  const formik = useFormik<FormValues>({
    initialValues: {
      image: null,
      slug: "",
      title: "",
      shortDescription: "",
      detailDescription: "",
    },
    validationSchema: addBlogValidationSchema,
    onSubmit: async (values) => {
      if (!values.image) {
        toast.error("Primary image is required");
        return;
      }

      if (!values.detailDescription || values.detailDescription.trim().length < 50) {
        toast.error("Blog content must be at least 50 characters");
        return;
      }

      try {
        // Validate required fields
        if (!values.title || values.title.trim().length < 3) {
          toast.error("Title must be at least 3 characters");
          return;
        }
        
        if (!values.slug || values.slug.trim().length < 3) {
          toast.error("Slug must be at least 3 characters");
          return;
        }
        
        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(values.slug)) {
          toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
          return;
        }
        
        if (!values.shortDescription || values.shortDescription.trim().length < 10) {
          toast.error("Short description must be at least 10 characters");
          return;
        }

        const blogData = {
          title: values.title.trim(),
          slug: values.slug.trim().toLowerCase(),
          status: "draft", // Add default status
          shortDescription: values.shortDescription.trim(),
          image: values.image,
          detailDescription: values.detailDescription.trim(),
        };
        
        console.log("Submitting blog data:", blogData);

        const resultAction = await dispatch(addBlog(blogData));
        if (addBlog.fulfilled.match(resultAction)) {
          toast.success("Blog created successfully");
          router.push("/blog");
        } else if (addBlog.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Failed to create blog");
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    },
  });

  const renderInputField = (field: { name: string; type: string; placeholder: string; label: string; required?: boolean }) => {
    const fieldName = field.name as keyof FormValues;
    const fieldError = formik.touched[fieldName] && formik.errors[fieldName];
    
    if (field.type === "file") {
      return (
        <div className="relative">
          <input
            type="file"
            name={fieldName}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formik.setFieldValue(fieldName, file);
              }
            }}
            onBlur={formik.handleBlur}
            className="placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2 cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#001B48] file:text-white hover:file:bg-[#222222]"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        name={fieldName}
        placeholder={field.placeholder}
        value={formik.values[fieldName] as string || ""}
        onChange={(e) => {
          formik.handleChange(e);
          formik.setFieldTouched(fieldName, true, false);
        }}
        onBlur={formik.handleBlur}
        maxLength={field.name === "shortDescription" ? 600 : undefined}
        className={`placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2 ${
          fieldError ? "border border-[#DB2828]" : ""
        }`}
      />
    );
  };

  return (
    <>
      <div className="mt-4 flex justify-between flex-col">
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {blogFields.map((field, index) => {
                const fieldName = field.name as keyof FormValues;
                const fieldError = formik.touched[fieldName] && formik.errors[fieldName];
                
                return (
                  <div key={index} className="flex flex-col">
                    <label className="block text-sm font-medium text-[#222222] mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {renderInputField(field)}
                    
                    {fieldError && (
                      <p className="text-[#DB2828] text-sm mt-1">
                        {typeof formik.errors[fieldName] === "string" &&
                          formik.errors[fieldName]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="font-bold text-[#222222] ms-2 mb-3">Blog Content</p>
            <div className="w-full">
              <RichTextEditor
                value={formik.values.detailDescription}
                onChange={(html) => {
                  formik.setFieldValue('detailDescription', html);
                  formik.setFieldTouched('detailDescription', true, false);
                }}
              />
            </div>
            {formik.touched.detailDescription && formik.errors.detailDescription && (
              <p className="text-[#DB2828] text-sm mt-1 ms-2">
                {formik.errors.detailDescription}
              </p>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => router.push("/blog")} 
              className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium"
            >
              <MdKeyboardArrowLeft />
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-full px-[16px] py-[8px] bg-[#001B48] hover:bg-[#222222] text-white flex items-center justify-center gap-2 font-medium ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Save ..." : <><Tick /> Save</>}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default BlogDetail;