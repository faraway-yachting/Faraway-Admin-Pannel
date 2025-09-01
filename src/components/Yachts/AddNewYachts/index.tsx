"use client";

import { useEffect, useState } from "react";
import {
  NewYachtsData,
  RichTextEditorSections,
} from "@/data/Yachts";
import { MdDeleteOutline, MdKeyboardArrowLeft } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/Store/store";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { addYachts } from "@/lib/Features/Yachts/yachtsSlice";
import {
  yachtsvalidationSchema,
  FormYachtsValues,
} from "@/lib/Validation/addyachtsValidationSchema";
import RichTextEditor from "@/common/TextEditor";
import Tick from "@/icons/Tick";
import { getTags } from "@/lib/Features/Tags/tagsSlice";
import { RiArrowDownSLine } from "react-icons/ri";


type RichTextFieldKey =
  // | "Price"
  // | "Trip Details"
  | "Day Charter"
  | "Overnight Charter"
  | "About this Boat"
  | "Specifications"
  | "Boat Layout";

const AddNewYachts: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.yachts.addLoading);
  const { allTags } = useSelector(
    (state: RootState) => state.tags
  );
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isTagsOpen && !target.closest('.tags-dropdown')) {
        setIsTagsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTagsOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        formik.setFieldTouched("Primary Image", true, false);
        formik.setFieldError("Primary Image", "File must be 1MB or smaller");
        e.target.value = "";
        return;
      }
      formik.setFieldValue("Primary Image", file);
      formik.setFieldError("Primary Image", undefined);
    }
  };

  const handleDelete = () => {
    formik.setFieldValue("Primary Image", null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const existingFiles = Array.isArray(formik.values["Gallery Images"]) ? formik.values["Gallery Images"] : [];
      const totalFiles = existingFiles.length + files.length;
      if (totalFiles > 30) {
        formik.setFieldTouched("Gallery Images", true, false);
        formik.setFieldError("Gallery Images", "Maximum 30 images allowed");
        e.target.value = "";
        return;
      } else {
        formik.setFieldValue("Gallery Images", [...existingFiles, ...Array.from(files)]);
        formik.setFieldError("Gallery Images", undefined);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        formik.setFieldTouched("Gallery Images", true, false);
        formik.setFieldError("Gallery Images", "File must be 1MB or smaller");
        return;
      }
      formik.setFieldValue("Gallery Images", file);
      formik.setFieldError("Gallery Images", undefined);
    }
  };

  const handleRemoveImage = (index: number) => {
    const files = Array.isArray(formik.values["Gallery Images"])
      ? [...formik.values["Gallery Images"]]
      : [];
    files.splice(index, 1);
    formik.setFieldValue("Gallery Images", files);
  };

  const formik = useFormik<FormYachtsValues>({
    initialValues: {
      "Boat Type": "",
      Title: "",
      Category: "",
      Capacity: "",
      Length: "",
      "Length Range": "",
      Cabins: "",
      Bathrooms: "",
      "Passenger Day Trip": "",
      "Passenger Overnight": "",
      Guests: "",
      "Guests Range": "",
      "Day Trip Price": "",
      "Overnight Price": "",
      "Daytrip Price (Euro)": "",
      // "Daytrip Price (THB)": "",
      // "Daytrip Price (USD)": "",
      "Primary Image": null as unknown as File,
      "Gallery Images": [] as File[],
      // Price: "",
      // "Trip Details": "",
      "Day Charter": "",
      "Overnight Charter": "",
      "About this Boat": "",
      Specifications: "",
      "Boat Layout": "",
      "Video Link": "",
      Badge: "",
      Slug: "",
      Design: "",
      Built: "",
      "Cruising Speed": "",
      "Length Overall": "",
      "Fuel Capacity": "",
      "Water Capacity": "",
      "Tags": [] as string[],
      Code: "",
      "Yacht Type": "",
    },
    validationSchema: yachtsvalidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          formik.setTouched({
            "Boat Type": true,
            Category: true,
            Capacity: true,
            Length: true,
            "Length Range": true,
            Title: true,
            Cabins: true,
            Bathrooms: true,
            "Passenger Day Trip": true,
            "Passenger Overnight": true,
            Guests: true,
            "Guests Range": true,
            "Day Trip Price": true,
            "Overnight Price": true,
            "Daytrip Price (Euro)": true,
            // "Daytrip Price (THB)": true,
            // "Daytrip Price (USD)": true,
            "Primary Image": {},
            "Gallery Images": true,
            // Price: true,
            // "Trip Details": true,
            "Day Charter": true,
            "Overnight Charter": true,
            "About this Boat": true,
            Specifications: true,
            "Boat Layout": true,
            "Video Link": true,
            // "Video Link 2": true,
            // "Video Link 3": true,
            Badge: true,
            Slug: true,
            Design: true,
            Built: true,
            "Cruising Speed": true,
            "Length Overall": true,
            "Fuel Capacity": true,
            "Water Capacity": true,
            Tags: true,
            Code: true,
            "Yacht Type": true,
          });
          setSubmitting(false);
          return;
        }
        const resultAction = await dispatch(
          addYachts({
            boatType: values["Boat Type"] ?? "",
            price: values["Category"] ?? "",
            capacity: values["Capacity"] ?? "",
            length: values["Length"] ?? "",
            lengthRange: values["Length Range"] ?? "",
            title: values["Title"] ?? "",
            cabins: values["Cabins"],
            tags: (values["Tags"] ?? []).filter((t: string | undefined): t is string => typeof t === "string"),
            bathrooms: values["Bathrooms"],
            passengerDayTrip: values["Passenger Day Trip"],
            passengerOvernight: values["Passenger Overnight"],
            guests: values["Guests"],
            guestsRange: values["Guests Range"],
            dayTripPrice: values["Day Trip Price"],
            overnightPrice: values["Overnight Price"],
            daytripPriceEuro: values["Daytrip Price (Euro)"],
            // daytripPriceTHB: values["Daytrip Price (THB)"] ?? "",
            // daytripPriceUSD: values["Daytrip Price (USD)"] ?? "",
            primaryImage: values["Primary Image"] as File,
            galleryImages: values["Gallery Images"] as File[],
            // priceEditor: values["Price"] ?? "",
            // tripDetailsEditor: values["Trip Details"] ?? "",
            dayCharter: values["Day Charter"] ?? "",
            overnightCharter: values["Overnight Charter"] ?? "",
            aboutThisBoat: values["About this Boat"] ?? "",
            specifications: values["Specifications"] ?? "",
            boatLayout: values["Boat Layout"] ?? "",
            videoLink: values["Video Link"] || undefined,
            // videoLink2: values["Video Link 2"] ?? "",
            // videoLink3: values["Video Link 3"] ?? "",
            badge: values["Badge"] ?? "",
            slug: values["Slug"] ?? "",
            design: values["Design"] ?? "",
            built: values["Built"] ?? "",
            cruisingSpeed: values["Cruising Speed"] ?? "",
            lengthOverall: values["Length Overall"] ?? "",
            fuelCapacity: values["Fuel Capacity"] ?? "",
            waterCapacity: values["Water Capacity"] ?? "",
            code: values["Code"] ?? "",
            type: values["Yacht Type"] ?? "",
          })
        );
        if (addYachts.fulfilled.match(resultAction)) {
          toast.success("Yachts Register successfully", {
            onClose: () => {
              router.push("/yachts");
            },
          });
          formik.resetForm();
        } else if (addYachts.rejected.match(resultAction)) {
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

  const getFieldError = (fieldName: keyof FormYachtsValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {NewYachtsData.map((section, sectionIndex) => {
          return (
            <div key={sectionIndex}>
              {section.section && (
                <h2
                  className={`font-bold mb-2 ${sectionIndex === 0 ? "" : "mt-4"
                    } ${sectionIndex !== 1
                      ? "text-[#001B48] text-[24px] pb-2 border-b border-[#CCCCCC]"
                      : "text-[#222222]"
                    }`}
                >
                  {section.section}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {section.fields.map((field, index) => {
                  const value =
                    formik.values[field.label as keyof typeof formik.values] ??
                    "";
                  const isDropdown = field.type === "dropdown";
                  const isNumber = ["Length", "Cabins", "Bathrooms", "Passenger Day Trip", "Passenger Overnight", "Guests", "Day Trip Price", "Overnight Price", "Daytrip Price (Euro)", "Built", "Cruising Speed", "Length Overall", "Fuel Capacity", "Water Capacity"].includes(field.label);
                  const isPrimaryUpload = field.label === "Primary Image";
                  const isFileUpload = field.label === "Gallery Images";
                  const isCheckbox = field.type === "checkbox";
                  const isTag = field.label === "Tags";
                  const fieldName = field.label as keyof FormYachtsValues;
                  const fieldError = getFieldError(fieldName);
                  if (isCheckbox) {
                    return (
                      <div
                        key={index}
                        className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-4"
                      >
                        <label className="flex items-center gap-2 w-fit">
                          <input
                            type="radio"
                            name="Length Range"
                            value={field.label}
                            checked={
                              formik.values["Length Range"] === field.label
                            }
                            onChange={(e) => {
                              formik.setFieldValue(
                                "Length Range",
                                e.target.value
                              );
                              formik.setFieldTouched(
                                "Length Range",
                                true,
                                false
                              );
                            }}
                            onBlur={formik.handleBlur}
                            className="peer hidden"
                          />
                          <div className="w-4 h-4 cursor-pointer rounded-full border border-[#828282] bg-white flex items-center justify-center peer-checked:border-[#001B48] peer-checked:bg-[#001B48]">
                            {formik.values["Length Range"] === field.label && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label className="block font-semibold text-[#222222] cursor-pointer">
                            {field.label}
                          </label>
                        </label>
                        {index ===
                          section.fields.filter((f) => f.type === "checkbox")
                            .length -
                          1 &&
                          getFieldError(
                            "Length Range" as keyof FormYachtsValues
                          ) && (
                            <p className="text-[#DB2828] text-sm mt-1">
                              {typeof formik.errors["Length Range"] ===
                                "string" && formik.errors["Length Range"]}
                            </p>
                          )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      className={`${isFileUpload
                        ? "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-4"
                        : ""
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
                      {isTag ? (
                        <>
                          <div
                            className={`bg-[#F0F2F4] rounded-lg px-3 py-2 w-full ${fieldError ? "border border-[#DB2828]" : ""
                              }`}
                          >
                            <div className="relative tags-dropdown">
                              <button
                                type="button"
                                onClick={() => setIsTagsOpen(!isTagsOpen)}
                                className="w-full rounded-md cursor-pointer flex items-center justify-between"
                              >
                                <span className={Array.isArray(formik.values[fieldName]) && formik.values[fieldName].length > 0 ? "text-[#222222]" : "text-[#999999]"}>
                                  {Array.isArray(formik.values[fieldName]) && formik.values[fieldName].length > 0 
                                    ? `${formik.values[fieldName].length} tags selected`
                                    : "Select tags"
                                  }
                                </span>
                                <RiArrowDownSLine className={`transition-transform text-[#999999] ${isTagsOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isTagsOpen && (
                                <div className="absolute top-full left-0 scrollbar-thick right-0 z-10 mt-1 max-h-[200px] overflow-y-auto border hover:text-white border-gray-300 rounded-md bg-white shadow-lg">
                                  {allTags && allTags.length > 0 ? (
                                    allTags.map((tag) => (
                                      <label
                                        key={tag._id}
                                        onClick={() => {
                                          const currentValues = Array.isArray(formik.values[fieldName]) ? formik.values[fieldName] : [];
                                          const isSelected = currentValues.includes(tag.Name);
                                          let newValues;
                                          if (isSelected) {
                                            newValues = currentValues.filter(value => value !== tag.Name);
                                          } else {
                                            newValues = [...currentValues, tag.Name];
                                          }
                                          formik.setFieldValue(fieldName, newValues);
                                          formik.setFieldTouched(fieldName, true, false);
                                        }}
                                        className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:text-white hover:bg-[#1967D2] ${
                                          Array.isArray(formik.values[fieldName]) && formik.values[fieldName].includes(tag.Name)
                                            ? "bg-blue-50"
                                            : ""
                                        }`}
                                      >
                                        <span className="text-sm text-[#222222] hover:text-white">{tag.Name}</span>
                                        {Array.isArray(formik.values[fieldName]) && formik.values[fieldName].includes(tag.Name) && (
                                          <span className="text-[#222222]">
                                            <Tick />
                                          </span>
                                        )}
                                      </label>
                                    ))
                                  ) : (
                                    <div className="px-3 py-2 text-[#999999] text-sm">
                                      No Tags Available
                                    </div>
                                  )}
                                </div>
                              )}
                              <input
                                type="hidden"
                                name={fieldName}
                                value={Array.isArray(formik.values[fieldName]) ? formik.values[fieldName].join(",") : ""}
                              />
                            </div>
                          </div>
                          {fieldError && (
                            <p className="text-[#DB2828] text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isDropdown ? (
                        <>
                          <div
                            className={`bg-[#F0F2F4] rounded-lg px-3 py-2 w-full ${fieldError ? "border border-[#DB2828]" : ""
                              }`}
                          >
                            <select
                              name={fieldName}
                              value={formik.values[fieldName] as string}
                              onChange={(e) => {
                                formik.handleChange(e);
                                formik.setFieldTouched(fieldName, true, false);
                              }}
                              onBlur={formik.handleBlur}
                              className={`w-full outline-0 cursor-pointer ${value ? "text-[#222222]" : "text-[#999999]"
                                }`}
                            >
                              <option value="" disabled hidden>
                                {field.placeholder}
                              </option>
                              {field.options?.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="text-[#222222] outline-0 pt-4"
                                >
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          {fieldError && (
                            <p className="text-[#DB2828] text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isPrimaryUpload ? (
                        <>
                          <div
                            className={`text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${fieldError ? "border border-[#DB2828]" : ""
                              }`}
                          >
                            {!formik.values["Primary Image"] ? (
                              <input
                                type="file"
                                name="Primary Image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer w-full"
                              />
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <p className="text-[#222222] font-medium">
                                    {(() => {
                                      const file = formik.values[
                                        "Primary Image"
                                      ] as File;
                                      if (!file) return "No file selected";
                                      const name = file.name;
                                      const extMatch = name.match(/\.[^/.]+$/);
                                      const ext = extMatch ? extMatch[0] : "";
                                      const firstWord = name
                                        .replace(/\.[^/.]+$/, "")
                                        .split(/[ .]/)[0]
                                        .slice(0, 5);
                                      return `${firstWord}${ext}`;
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
                      ) : isFileUpload ? (
                        <>
                          <div
                            className={`border border-dashed border-[#C4C4C4] bg-white rounded-md py-12 px-4 text-center w-full  ${fieldError ? "border border-[#DB2828]" : ""
                              }`}
                          >
                            <div
                              onDrop={handleDrop}
                              onDragOver={(e) => e.preventDefault()}
                              onBlur={() =>
                                formik.setFieldTouched(
                                  "Gallery Images",
                                  true,
                                  false
                                )
                              }
                              className="text-[#B3B3B3] font-normal text-[14px] flex flex-col items-center cursor-pointer"
                            >
                              <input
                                type="file"
                                name="Gallery Images"
                                accept="image/png, image/jpeg"
                                multiple
                                onChange={handleFileUpload}
                                onBlur={() =>
                                  formik.setFieldTouched(
                                    "Gallery Images",
                                    true,
                                    false
                                  )
                                }
                                className="hidden"
                                id="generalinfo-upload"
                              />
                              <label
                                htmlFor="generalinfo-upload"
                                className="cursor-pointer block"
                                onClick={() =>
                                  formik.setFieldTouched(
                                    "Gallery Images",
                                    true,
                                    false
                                  )
                                }
                              >
                                <div className="flex items-center gap-1">
                                  <Image
                                    src="/images/Inventory/file_upload.svg"
                                    alt="upload"
                                    width={20}
                                    height={20}
                                  />
                                  <p>
                                    Drop file to attach or{" "}
                                    <span className="text-[#0080A7] underline">
                                      browser
                                    </span>
                                  </p>
                                </div>
                                <p>JPEG, PNG (Max size 10MB)</p>
                              </label>
                              {Array.isArray(formik.values["Gallery Images"]) &&
                                formik.values["Gallery Images"].length > 0 && (
                                  <div className="mt-4 grid grid-cols-3 gap-4">
                                    {formik.values["Gallery Images"].map(
                                      (
                                        file: File | undefined,
                                        index: number
                                      ) => {
                                        if (!file) return null;
                                        return (
                                          <div
                                            key={index}
                                            className="relative w-[100px] h-[100px]"
                                          >
                                            <Image
                                              src={URL.createObjectURL(file)}
                                              alt={`upload-${index}`}
                                              width={100}
                                              height={100}
                                              className="w-[100px] h-[100px] object-cover rounded-lg"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveImage(index)
                                              }
                                              className="absolute top-1 right-1 border border-[#CCCCCC] cursor-pointer rounded-md p-1 shadow-lg"
                                            >
                                              <MdDeleteOutline className="text-[#DB2828] hover:text-[#0080A7] text-md" />
                                            </button>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                          {fieldError && (
                            <p className="text-[#DB2828] text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isNumber ? (
                        <>
                          <input
                            type="number"
                            name={fieldName}
                            placeholder={field.placeholder}
                            value={
                              typeof formik.values[fieldName] === "string" || typeof formik.values[fieldName] === "number"
                                ? formik.values[fieldName]
                                : ""
                            }
                            onChange={(e) => {
                              formik.handleChange(e);
                              formik.setFieldTouched(fieldName, true, false);
                            }}
                            onBlur={formik.handleBlur}
                            className={`placeholder:text-[#999999] outline-none text-[#222222] w-full bg-[#F0F2F4] rounded-lg px-3 py-2  ${fieldError ? "border border-[#DB2828]" : ""
                              }`}
                            onWheel={e => e.currentTarget.blur()}
                            onKeyDown={e => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                e.preventDefault();
                              }
                            }}
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
          );
        })}
        {RichTextEditorSections.map((section) => {
          return (
            <div key={section.id} className="mt-4 grid lg:grid-cols-2 gap-2">
              <p className="font-bold text-[#222222]">{section.label}</p>
              <div className="w-full">
                <RichTextEditor
                  value={formik.values[section.label as RichTextFieldKey] ?? ""}
                  onChange={(html) => formik.setFieldValue(section.label, html)}
                />
              </div>
            </div>
          );
        })}
        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={() => router.push("/yachts")} className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium">
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
  );
};

export default AddNewYachts;
