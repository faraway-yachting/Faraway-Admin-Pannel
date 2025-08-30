import * as Yup from "yup";


export const tagsValidationSchema = Yup.object().shape({
  "Name": Yup.string().required("Name is required"),
  "Slug": Yup.string().required("Slug is required"),
  "Description": Yup.string()
    .required("Description is required")
    .min(100, "Description must be at least 100 characters long"),
});

export type FormTagsValues = Yup.InferType<typeof tagsValidationSchema>;