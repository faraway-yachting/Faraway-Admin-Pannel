"use client";

import { NewTagsData } from "@/data/Tags";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { updateTags } from "@/lib/Features/Tags/tagsSlice";
import {
  tagsValidationSchema,
  FormTagsValues,
} from "@/lib/Validation/addtagsValidationSchema";
import Tick from "@/icons/Tick";

interface TagsProps {
  goToPrevTab: () => void;
  id: string | number;
}

const UpdateTags: React.FC<TagsProps> = ({ goToPrevTab, id }) => {

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tags, loading } = useSelector((state: RootState) => state.tags);

  const formik = useFormik<FormTagsValues>({
    enableReinitialize: true,
    initialValues: {
      Name: tags?.Name || "",
      Slug: tags?.Slug || "",
      Description: tags?.Description || "",
    },
    validationSchema: tagsValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          formik.setTouched({
            Name: true,
            Slug: true,
            Description: true,
          });
          setSubmitting(false);
          return;
        }
        const resultAction = await dispatch(
          updateTags({
            payload: {
              name: values["Name"] ?? "",
              slug: values["Slug"] ?? "",
              description: values["Description"] ?? "",
            },
            tagsId: id.toString(),
          })
        );
        if (updateTags.fulfilled.match(resultAction)) {
          toast.success("Tags Update successfully", {
            onClose: () => {
              router.push("/tags");
            },
          });
          formik.resetForm();
        } else if (updateTags.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName: keyof FormTagsValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-between h-[calc(100vh-214px)]"
      >
        {NewTagsData.map((section, sectionIndex) => {
          return (
            <div key={sectionIndex}>
              {section.section && (
                <h2
                  className={`font-bold mb-2 text-[#001B48] text-[24px] pb-2 border-b border-[#CCCCCC] ${
                    sectionIndex === 0 ? "" : "mt-4"
                  }`}
                >
                  {section.section}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map((field, index) => {
                  const isDescription = field.label === "Description";
                  const fieldName = field.label as keyof FormTagsValues;
                  const fieldError = getFieldError(fieldName);
                  return (
                    <div
                      key={index}
                      className={`${
                        isDescription ? "col-span-1 sm:col-span-2" : ""
                      }`}
                    >
                      <label className="block font-bold text-[#222222] mb-2">
                        {field.label}
                      </label>
                      {isDescription ? (
                        <>
                          <textarea
                            name={fieldName}
                            placeholder={field.placeholder}
                            value={formik.values[fieldName] as string}
                            onChange={(e) => {
                              formik.handleChange(e);
                              formik.setFieldTouched(fieldName, true, false);
                            }}
                            onBlur={formik.handleBlur}
                            rows={6}
                            className={`placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${
                              fieldError ? "border border-[#DB2828]" : ""
                            }`}
                          />
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
                            className={`placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${
                              fieldError ? "border border-[#DB2828]" : ""
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
          );
        })}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevTab}
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
            {loading ? (
              "Save ..."
            ) : (
              <>
                <Tick /> Save
              </>
            )}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UpdateTags;
