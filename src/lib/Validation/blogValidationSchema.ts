import * as Yup from "yup";

export const addBlogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(300, "Title must not exceed 200 characters"),

  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must not exceed 50 characters"),

  shortDescription: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(600, "Description must not exceed 600 characters"),

  detailDescription: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 1000 characters"),

  image: Yup.mixed()
    .required("Primary image is required")
    .test("fileSize", "File size is too large", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value || !(value instanceof File)) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(value.type);
    }),
});

export const updateBlogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(300, "Title must not exceed 50 characters"),

  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must not exceed 50 characters"),

  shortDescription: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(600, "Description must not exceed 600 characters"),

  detailDescription: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),

  image: Yup.mixed<File | string>()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value || typeof value === 'string') return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB limit
      }
      return true;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value || typeof value === 'string') return true;
      if (value instanceof File) {
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(value.type);
      }
      return true;
    }),
}); 