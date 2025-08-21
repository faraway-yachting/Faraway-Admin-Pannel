import * as Yup from "yup";

export const addBlogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Title must be at least 1 character")
    .max(300, "Title must not exceed 300 characters"),

  slug: Yup.string()
    .min(1, "Slug must be at least 1 character")
    .max(100, "Slug must not exceed 100 characters"),

  shortDescription: Yup.string()
    .min(1, "Description must be at least 1 character")
    .max(600, "Description must not exceed 600 characters"),

  detailDescription: Yup.string()
    .min(1, "Content must be at least 1 character"),

  image: Yup.mixed()
    .nullable()
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
    .min(1, "Title must be at least 1 character")
    .max(300, "Title must not exceed 300 characters"),

  slug: Yup.string()
    .min(1, "Slug must be at least 1 character")
    .max(100, "Slug must not exceed 100 characters"),

  shortDescription: Yup.string()
    .min(1, "Description must be at least 1 character")
    .max(600, "Description must not exceed 600 characters"),

  detailDescription: Yup.string()
    .min(1, "Content must be at least 1 character"),

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