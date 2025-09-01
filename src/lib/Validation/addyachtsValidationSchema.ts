import * as Yup from "yup";

export const yachtsvalidationSchema = Yup.object().shape({
  "Title": Yup.string().required("Title is required"),
  "Boat Type": Yup.string().required("Boat Type is required"),
  "Category": Yup.string().required("Category is required"),
  "Capacity": Yup.string().required("Capacity is required"),
  "Length": Yup.string().required("Length is required"),
  "Length Range": Yup.string(),
  "Cabins": Yup.string().required("Cabins is required"),
  "Bathrooms": Yup.string().required("Bathrooms is required"),
  "Passenger Day Trip": Yup.string().required("Passenger Day Trip is required"),
  "Passenger Overnight": Yup.string().required("Passenger Overnight is required"),
  "Guests": Yup.string().required("Guests is required"),
  "Guests Range": Yup.string().required("Guests Range is required"),
  "Day Trip Price": Yup.string().required("Day Trip Price is required"),
  "Overnight Price": Yup.string().required("Overnight Price is required"),
  "Daytrip Price (Euro)": Yup.string().required("Daytrip Price (Euro) is required"),
  // "Daytrip Price (THB)": Yup.string(),
  // "Daytrip Price (USD)": Yup.string(),
  // "Price": Yup.string(),
  // "Trip Details": Yup.string(),
  "Day Charter": Yup.string(),
  "Overnight Charter": Yup.string(),
  "About this Boat": Yup.string(),
  "Specifications": Yup.string(),
  "Boat Layout": Yup.string(),
  "Video Link": Yup.string().nullable().transform((value) => value === "" ? undefined : value),
  // "Video Link 2": Yup.string(),
  // "Video Link 3": Yup.string(),
  "Badge": Yup.string(),
  "Slug": Yup.string().required("Slug is required"),
  "Design": Yup.string(),
  "Built": Yup.string(),
  "Cruising Speed": Yup.string(),
  "Length Overall": Yup.string(),
  "Fuel Capacity": Yup.string(),
  "Water Capacity": Yup.string(),
  "Yacht Type": Yup.string().required("Yacht Type is required"),
  "Code": Yup.string(),
  "Tags": Yup.array().of(Yup.string()).default([]),
  "Primary Image": Yup.mixed<File>()
    .required("Primary Image is required")
    .test("is-file", "Please select a valid file", (value) => {
      return value instanceof File;
    })
    .test("file-size", "File must be 10MB or smaller", (value) => {
      return value instanceof File && value.size <= 10 * 1024 * 1024
    })
    .test("file-type", "Only JPEG, PNG images are allowed", (value) => {
      if (!(value instanceof File)) return false;
      const allowedTypes = ["image/jpeg", "image/png"];
      return allowedTypes.includes(value.type);
    }),
  "Gallery Images": Yup.array<File>()
    .required("Gallery Images is required")
    .min(1, "Gallery Images is required")
    .test("is-array", "Must be an array of files", (value) => {
      return value === null || Array.isArray(value);
    })
    .test("max-files", "Maximum 30 images allowed", (value) => {
      return value === null || (Array.isArray(value) && value.length <= 30);
    })
    .test("file-size", "Each file must be 10MB or smaller", (value) => {
      return value === null ||
        (Array.isArray(value) && value.every(file => file.size <= 10 * 1024 * 1024));
    })
    .test("file-type", "Only JPEG, PNG images are allowed", (value) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      return value === null ||
        (Array.isArray(value) && value.every(file => allowedTypes.includes(file.type)));
    })
});


export const yachtsUpdateValidationSchema = Yup.object().shape({
  "Title": Yup.string().required("Title is required"),
  "Boat Type": Yup.string().required("Boat Type is required"),
  "Category": Yup.string().required("Category is required"),
  "Capacity": Yup.string().required("Capacity is required"),
  "Length": Yup.string().required("Length is required"),
  "Length Range": Yup.string(),
  "Cabins": Yup.string().required("Cabins is required"),
  "Bathrooms": Yup.string().required("Bathrooms is required"),
  "Passenger Day Trip": Yup.string().required("Passenger Day Trip is required"),
  "Passenger Overnight": Yup.string().required("Passenger Overnight is required"),
  "Guests": Yup.string().required("Guests is required"),
  "Guests Range": Yup.string().required("Guests Range is required"),
  "Day Trip Price": Yup.string().required("Day Trip Price is required"),
  "Overnight Price": Yup.string().required("Overnight Price is required"),
  "Daytrip Price (Euro)": Yup.string().required("Daytrip Price (Euro) is required"),
  // "Daytrip Price (THB)": Yup.string(),
  // "Daytrip Price (USD)": Yup.string(),
  // "Price": Yup.string(),
  // "Trip Details": Yup.string(),
  "Day Charter": Yup.string(),
  "Overnight Charter": Yup.string(),
  "About this Boat": Yup.string(),
  "Specifications": Yup.string(),
  "Boat Layout": Yup.string(),
  "Video Link": Yup.string().nullable().transform((value) => value === "" ? undefined : value),
  // "Video Link 2": Yup.string(),
  // "Video Link 3": Yup.string(),
  "Badge": Yup.string(),
  "Slug": Yup.string().required("Slug is required"),
  "Design": Yup.string(),
  "Built": Yup.string(),
  "Cruising Speed": Yup.string(),
  "Length Overall": Yup.string(),
  "Fuel Capacity": Yup.string(),
  "Water Capacity": Yup.string(),
  "Yacht Type": Yup.string().required("Yacht Type is required"),
  "Code": Yup.string(),
  "Tags": Yup.array().of(Yup.string()).default([]),
  "Primary Image": Yup.mixed<File | string>()
    .required("Primary Image is required")
    .test("is-valid", "Primary Image must be a file or URL", (value) => {
      return value instanceof File || (typeof value === 'string' && value.length > 0);
    })
    .test("file-size", "File must be 10MB or smaller", (value) => {
      return !(value instanceof File) || value.size <= 10 * 1024 * 1024;
    })
    .test("file-type", "Only JPEG, PNG images are allowed", (value) => {
      if (!(value instanceof File)) return true;
      const allowedTypes = ["image/jpeg", "image/png"];
      return allowedTypes.includes(value.type);
    }),
  "Gallery Images": Yup.array()
    .test("is-array", "Must be an array", (value) => {
      return value === null || Array.isArray(value);
    })
    .test("max-files", "Maximum 30 images allowed", (value) => {
      return value === null || (Array.isArray(value) && value.length <= 30);
    })
    .test("file-size", "Each file must be 10MB or smaller", (value) => {
      if (!Array.isArray(value)) return true;
      return value.every(item => {
        if (item.type === 'file') {
          return (item.value as File).size <= 10 * 1024 * 1024;
        }
        return true;
      });
    })
    .test("file-type", "Only JPEG, PNG images are allowed", (value) => {
      if (!Array.isArray(value)) return true;
      const allowedTypes = ["image/jpeg", "image/png"];
      return value.every(item => {
        if (item.type === 'file') {
          return allowedTypes.includes((item.value as File).type);
        }
        return true;
      });
    })
});

export type FormYachtsValues = Yup.InferType<typeof yachtsvalidationSchema>;
export type FormYachtsUpdateValues = Yup.InferType<typeof yachtsUpdateValidationSchema>;