import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface AddTagsPayload {
  name: string;
  slug: string;
  description: string;
}

export interface TagsApiResponse {
  _id: string;
  Name: string;
  Slug: string;
  Description: string;
}

export interface Tags extends TagsApiResponse {
  id: string;
}

interface GetTagsParams {
  page?: number;
  limit?: number;
}

interface TagsResponse {
  tags: TagsApiResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface TagsState {
  loading: boolean;
  tags: Tags | null;
  allTags: TagsApiResponse[];
  error: string | null;
  addLoading: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
  getLoading: boolean;
  deleteLoading: boolean;
  publishLoading: boolean;
}

const initialState: TagsState = {
  loading: false,
  tags: null,
  allTags: [],
  error: null,
  addLoading: false,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  getLoading: false,
  deleteLoading: false,
  publishLoading: false,
};

// Add Tags
export const addTags = createAsyncThunk<
  Tags,
  AddTagsPayload,
  { rejectValue: { error: { message: string } } }
>(
  "tags/addTags",
  async (credentials, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://awais.thedevapp.online/tags/add-tag",
        credentials,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
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

// Get All Tags
export const getTags = createAsyncThunk<
  TagsResponse,
  GetTagsParams | void,
  { rejectValue: { error: { message: string } } }
>(
  "tags/getTags",
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      let queryString = "https://awais.thedevapp.online/tags/all-tags";
      if (params && (params.page || params.limit)) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        queryString += `?${queryParams.toString()}`;
      }
      
      const response = await axios.get(queryString, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

export const getTagsById = createAsyncThunk(
  "tags/getTagsById",
  async (
    { tagsId }: { tagsId: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://awais.thedevapp.online/tags/tagByID?id=${tagsId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        tags: response.data.data
      };
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

export const updateTags = createAsyncThunk(
  "tags/updateTags",
  async ({ payload, tagsId }: { payload: AddTagsPayload; tagsId: string },
    { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://awais.thedevapp.online/tags/edit-tag?id=${tagsId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
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


// Delete Tags
export const deleteTags = createAsyncThunk<
  { success: boolean; id: string },
  string,
  { rejectValue: { error: { message: string } } }
>(
  "tags/deleteTags",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://awais.thedevapp.online/tags/delete-tag?id=${id}`,
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
      return { success: true, id };
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



const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTags: (state) => {
      state.tags = null;
      state.allTags = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Yacht
      .addCase(addTags.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addTags.fulfilled, (state, action) => {
        state.addLoading = false;
        state.tags = action.payload;
        state.error = null;
      })
      .addCase(addTags.rejected, (state, action) => {
        state.addLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to add tags.";
      })
      // Get Yachts
      .addCase(getTags.pending, (state) => {
        state.getLoading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.getLoading = false;
        state.allTags = action.payload.tags;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.getLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to get tags.";
      })

      // Get Yacht by ID
      .addCase(getTagsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTagsById.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;
        state.error = null;
      })
      .addCase(getTagsById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to get tags by ID.";
      })
      // Update Yacht
      .addCase(updateTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
        state.error = null;
      })
      .addCase(updateTags.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to update tags.";
      })
      // Delete Yacht
      .addCase(deleteTags.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteTags.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the deleted yacht from the list
        state.allTags = state.allTags.filter(tags => tags._id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteTags.rejected, (state, action) => {
        state.deleteLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to delete tags.";
      })
  },
});

export const { clearError, clearTags } = tagsSlice.actions;
export default tagsSlice.reducer;