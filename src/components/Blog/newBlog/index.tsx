"use client";
import { useRouter } from "next/navigation";
import Tick from "@/icons/Tick";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import { useFormik } from "formik";
import { addBlog, AddBlogPayload } from "@/lib/Features/Blog/blogSlice";
import { addBlogValidationSchema } from "@/lib/Validation/blogValidationSchema";
import RichTextEditor from "@/common/TextEditor";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormValues = {
  image: File | undefined;
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
      image: undefined,
      slug: "",
      title: "",
      shortDescription: "",
      detailDescription: "",
    },
    validationSchema: addBlogValidationSchema,
    onSubmit: async (values) => {
      try {
        // Check if there are any validation errors
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          // Set all fields as touched to show validation errors
          formik.setTouched({
            image: true,
            slug: true,
            title: true,
            shortDescription: true,
            detailDescription: true,
          });
          return;
        }

        // Prepare blog data with required values
        const blogData: AddBlogPayload = {
          title: values.title.trim(),
          slug: values.slug.trim(),
          status: "draft",
          shortDescription: values.shortDescription.trim(),
          detailDescription: values.detailDescription.trim(),
          image: values.image,
        };
        
        // Ensure image is provided
        if (!values.image) {
          toast.error("Image is required");
          return;
        }
        
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
              } else {
                formik.setFieldValue(fieldName, undefined);
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
      <div className="mt-4">
        <form onSubmit={formik.handleSubmit}>
          {/* Blog Information Section */}
          <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
            <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
              Blog Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {blogFields.map((field, index) => {
                const fieldName = field.name as keyof FormValues;
                const fieldError = formik.touched[fieldName] && formik.errors[fieldName];
                
                return (
                  <div key={index} className="flex flex-col">
                    <label className="block font-bold text-[#222222] mb-2">
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
          </div>
          
          {/* Blog Content Section */}
          <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full mb-6">
            <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
              Blog Content
            </p>
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
              <p className="text-[#DB2828] text-sm mt-1">
                {formik.errors.detailDescription}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-3 flex justify-between">
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
              className={`rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2 ${
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