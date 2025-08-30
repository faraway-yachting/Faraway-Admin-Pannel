import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// Types
export interface Blog {
  _id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  detailDescription?: string;
  image?: File | string;
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogResponse {
  blogs: Blog[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface AddBlogPayload {
  title: string;
  slug: string;
  status: string;
  shortDescription: string;
  detailDescription: string;
  image?: File;
}

export interface UpdateBlogPayload {
  blogId: string;
  data: Partial<Omit<AddBlogPayload, "image">> & {
    image?: File | string;
  };
}

export interface GetBlogsParams {
  page: number;
  limit: number;
}

export interface PublishBlogPayload {
  blogId: string;
  status: "draft" | "published";
}

// State interface
interface BlogState {
  loading: boolean;
  blogs: Blog | null;
  currentBlog: Blog | null;
  allBlogs: Blog[];
  error: string | null;
  addLoading: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
  getLoading: boolean;
  deleteLoading: boolean;
  publishLoading: boolean;
}

const initialState: BlogState = {
  loading: false,
  blogs: null,
  currentBlog: null,
  allBlogs: [],
  error: null,
  addLoading: false,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  getLoading: false,
  deleteLoading: false,
  publishLoading: false,
};

// Add Blog
export const addBlog = createAsyncThunk<
  Blog,
  AddBlogPayload,
  { rejectValue: { error: { message: string } } }
>(
  "blog/addBlog",
  async (credentials, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("title", credentials.title);
      formData.append("slug", credentials.slug);
      formData.append("status", credentials.status);
      formData.append("shortDescription", credentials.shortDescription);
      formData.append("detailDescription", credentials.detailDescription);
      if (credentials.image) {
        formData.append("image", credentials.image);
      }

      const response = await axios.post(
        "https://awais.thedevapp.online/blog/add-blog",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

// Get All Blogs
export const getBlogs = createAsyncThunk<
  BlogResponse,
  GetBlogsParams,
  { rejectValue: { error: { message: string } } }
>(
  "blog/getBlogs",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://awais.thedevapp.online/blog/all-blogs?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

// Get Blog by ID
export const getBlogById = createAsyncThunk<
  Blog,
  { blogId: string },
  { rejectValue: { error: { message: string } } }
>(
  "blog/getBlogById",
  async ({ blogId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://awais.thedevapp.online/blog/blogByID?id=${blogId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
     
    } catch (error) {
      let message = "Something went wrong";
      
      if (error && typeof error === 'object') {
        if ('response' in error) {
          const axiosError = error as { response?: { data?: { message?: string; error?: { message?: string } } }; message?: string };
          message = axiosError.response?.data?.message ||
                    axiosError.response?.data?.error?.message ||
                    axiosError.message ||
                    "API request failed";
        } else if ('message' in error) {
          message = (error as { message: string }).message;
        }
      }
      
      return rejectWithValue({ error: { message } });
    }
  }
);

// Update Blog
export const updateBlog = createAsyncThunk<
  Blog,
  { blogId: string; data: Partial<Blog> & { image?: File | string } },
  { rejectValue: { error: { message: string } } }
>(
  "blog/updateBlog",
  async ({ blogId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle special cases for specific fields
          if (key === 'image' && value && typeof value === 'object' && 'name' in value) {
            formData.append('image', value as File);
          } else if (typeof value === 'string' && value.trim() !== '') {
            formData.append(key, value.trim());
          } else if (typeof value !== 'string') {
            formData.append(key, String(value));
          }
        }
      });



      // Check if FormData is empty
      if (formData.entries().next().done) {
        throw new Error("No valid data to update");
      }

      const response = await axios.put(
        `https://awais.thedevapp.online/blog/edit-blog?id=${blogId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      
      if (response?.data?.error) {
        throw new Error(response.data.error.message || "API returned an error");
      }

      return response.data;
            } catch (error) {
      let message = "Something went wrong";
      
      // Safely extract error message
      if (error && typeof error === 'object') {
        if ('response' in error) {
          const axiosError = error as { response?: { data?: { message?: string; error?: { message?: string } } }; message?: string };
          message = axiosError.response?.data?.message ||
                    axiosError.response?.data?.error?.message ||
                    axiosError.message ||
                    "API request failed";
        } else if ('message' in error) {
          message = (error as { message: string }).message;
        }
      }
      
      return rejectWithValue({ error: { message } });
    }
  }
);


// Delete Blog
export const deleteBlog = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: { error: { message: string } } }
>(
  "blog/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      // Try different endpoint patterns for blog deletion
      let response;
      
      try {
        // Try yacht-style endpoint
        response = await axios.delete(
          `https://awais.thedevapp.online/blog/delete-blog?id=${blogId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch {
        // Try blog-specific endpoint
        response = await axios.delete(
          `https://awais.thedevapp.online/blog/delete-blog/${blogId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string; error?: { message: string } }>;
      
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

// Publish/Unpublish Blog
export const publishBlog = createAsyncThunk<
  Blog,
  PublishBlogPayload,
  { rejectValue: { error: { message: string } } }
>(
  "blog/publishBlog",
  async ({ blogId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      // Try different endpoint patterns for blog status update
      let response;
      
      try {
        // Try yacht-style endpoint
        response = await axios.patch(
          `https://awais.thedevapp.online/blog/update-status?id=${blogId}`,
          { status },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch {
        try {
          // Try blog-specific endpoint
          response = await axios.patch(
            `https://awais.thedevapp.online/blog/update-status${blogId}`,
            { status },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch {
          // Try using the update-blog endpoint with status
          response = await axios.put(
            `https://awais.thedevapp.online/blog/update-status${blogId}`,
            { status },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
      
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      // Handle both response.data and response.data.data structures
      const result = response.data.data || response.data;
      return result;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string; error?: { message: string } }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

// Slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBlogs: (state) => {
      state.blogs = null;
    },
  },
  extraReducers: (builder) => {
    // Add Blog
    builder
      .addCase(addBlog.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.addLoading = false;
        state.blogs = action.payload;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload?.error?.message || "Failed to add blog";
      });

    // Get Blogs
    builder
      .addCase(getBlogs.pending, (state) => {
        state.getLoading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.getLoading = false;
        state.allBlogs = action.payload.blogs;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.getLoading = false;
        state.error = action.payload?.error?.message || "Failed to get blogs";
      });

    // Get Blog by ID
    builder
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload; // Assign to currentBlog
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error?.message || "Failed to get blog";
      });

    // Update Blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.addLoading = false;
        state.blogs = action.payload;
        state.currentBlog = action.payload; // Also update currentBlog
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload?.error?.message || "Failed to update blog";
      });

    // Delete Blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.error?.message || "Failed to delete blog";
      });

    // Publish Blog
    builder
      .addCase(publishBlog.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
      })
      .addCase(publishBlog.fulfilled, (state, action) => {
        state.publishLoading = false;
        // Update the blog in the list
        const index = state.allBlogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.allBlogs[index] = action.payload;
        }
      })
      .addCase(publishBlog.rejected, (state, action) => {
        state.publishLoading = false;
        state.error = action.payload?.error?.message || "Failed to publish blog";
      });
  },
});

export const { clearError, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer 
