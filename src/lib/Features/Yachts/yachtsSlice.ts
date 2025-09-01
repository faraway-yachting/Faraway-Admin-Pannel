import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface AddYachtsPayload {
  boatType: string;
  price: string;
  capacity: string;
  length: string;
  lengthRange: string;
  cabins: string;
  bathrooms: string;
  passengerDayTrip: string;
  passengerOvernight: string;
  tags: string[];
  guests: string;
  guestsRange: string;
  dayTripPrice: string;
  // daytripPriceUSD: string;
  overnightPrice: string;
  daytripPriceEuro: string;
  // daytripPriceTHB: string;
  priceEditor?: string;
  tripDetailsEditor?: string;
  dayCharter?: string;
  overnightCharter?: string;
  aboutThisBoat?: string;
  specifications?: string;
  boatLayout?: string;
  videoLink?: string;
  videoLink2?: string;
  videoLink3?: string;
  badge?: string;
  slug: string;
  design: string;
  built: string;
  cruisingSpeed: string;
  lengthOverall: string;
  fuelCapacity: string;
  waterCapacity: string;
  code?: string;
  title: string;
  type: string;
  primaryImage: File;
  galleryImages: (File | string)[];
}

export interface YachtsApiResponse {
  _id: string;
  boatType: string;
  title: string;
  description: string;
  price: string;
  capacity: string;
  length: string;
  lengthRange: string;
  cabins: string;
  bathrooms: string;
  passengerDayTrip: string;
  passengerOvernight: string;
  guests: string;
  guestsRange: string;
  dayTripPrice: string;
  // daytripPriceUSD: string;
  overnightPrice: string;
  daytripPriceEuro: string;
  // daytripPriceTHB: string;
  primaryImage: string;
  galleryImages: string[];
  priceEditor?: string;
  tripDetailsEditor?: string;
  dayCharter?: string;
  overnightCharter?: string;
  aboutThisBoat?: string;
  specifications?: string;
  boatLayout?: string;
  videoLink?: string;
  videoLink2?: string;
  videoLink3?: string;
  badge?: string;
  slug: string;
  design: string;
  tags: string[];
  built: string;
  cruisingSpeed: string;
  lengthOverall: string;
  fuelCapacity: string;
  waterCapacity: string;
  type: string;
  code?: string;
  status: string;
  createdAt: string;
  __v: number;
}

export interface Yachts extends YachtsApiResponse {
  id: string;
}

interface GetYachtsParams {
  page: number;
  limit: number;
}

interface YachtsResponse {
  yachts: YachtsApiResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface YachtsState {
  loading: boolean;
  yachts: Yachts | null;
  allYachts: YachtsApiResponse[];
  error: string | null;
  addLoading: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
  getLoading: boolean;
  deleteLoading: boolean;
  publishLoading: boolean;
}

const initialState: YachtsState = {
  loading: false,
  yachts: null,
  allYachts: [],
  error: null,
  addLoading: false,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  getLoading: false,
  deleteLoading: false,
  publishLoading: false,
};

// Add Yacht
export const addYachts = createAsyncThunk<
  Yachts,
  AddYachtsPayload,
  { rejectValue: { error: { message: string } } }
>(
  "yachts/addYacht",
  async (credentials, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://awais.thedevapp.online/yacht/add-yacht",
        credentials,
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

// Get All Yachts
export const getYachts = createAsyncThunk<
  YachtsResponse,
  GetYachtsParams,
  { rejectValue: { error: { message: string } } }
>(
  "yachts/getYachts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://awais.thedevapp.online/yacht/all-yachts?page=${page}&limit=${limit}`,
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

export const getYachtsById = createAsyncThunk(
  "yachts/getYachtsById",
  async (
    { yachtsId }: { yachtsId: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://awais.thedevapp.online/yacht?id=${yachtsId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        yachts: response.data.data
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

export const updateYachts = createAsyncThunk(
  "yachts/updateYachts",
  async ({ payload, yachtsId }: { payload: AddYachtsPayload; yachtsId: string },
    { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://awais.thedevapp.online/yacht/edit-yacht?id=${yachtsId}`,
        payload,
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


// Delete Yacht
export const deleteYachts = createAsyncThunk<
  { success: boolean; id: string },
  string,
  { rejectValue: { error: { message: string } } }
>(
  "yachts/deleteYacht",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://awais.thedevapp.online/yacht/delete-yacht?id=${id}`,
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

export const publishYacht = createAsyncThunk<
  Yachts,
  { yachtId: string; status: string },
  { rejectValue: { error: { message: string } } }
>(
  "yachts/publishYacht",
  async ({ yachtId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        status: status
      };
      const response = await axios.patch(
        `https://awais.thedevapp.online/yacht/update-status?id=${yachtId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      console.error('Error in publishYacht:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);


const yachtsSlice = createSlice({
  name: "yachts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearYachts: (state) => {
      state.yachts = null;
      state.allYachts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Yacht
      .addCase(addYachts.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addYachts.fulfilled, (state, action) => {
        state.addLoading = false;
        state.yachts = action.payload;
        state.error = null;
      })
      .addCase(addYachts.rejected, (state, action) => {
        state.addLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to add yacht.";
      })
      // Get Yachts
      .addCase(getYachts.pending, (state) => {
        state.getLoading = true;
        state.error = null;
      })
      .addCase(getYachts.fulfilled, (state, action) => {
        state.getLoading = false;
        state.allYachts = action.payload.yachts;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getYachts.rejected, (state, action) => {
        state.getLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to get yachts.";
      })

      // Get Yacht by ID
      .addCase(getYachtsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYachtsById.fulfilled, (state, action) => {
        state.loading = false;
        state.yachts = action.payload.yachts;
        state.error = null;
      })
      .addCase(getYachtsById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to get yacht by ID.";
      })
      // Update Yacht
      .addCase(updateYachts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateYachts.fulfilled, (state, action) => {
        state.loading = false;
        state.yachts = action.payload;
        state.error = null;
      })
      .addCase(updateYachts.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to update yacht.";
      })
      // Delete Yacht
      .addCase(deleteYachts.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteYachts.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the deleted yacht from the list
        state.allYachts = state.allYachts.filter(yacht => yacht._id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteYachts.rejected, (state, action) => {
        state.deleteLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to delete yacht.";
      })
      // Publish Yacht
      .addCase(publishYacht.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
      })
      .addCase(publishYacht.fulfilled, (state, action) => {
        state.publishLoading = false;
        // Update the yacht in the list with published status
        const index = state.allYachts.findIndex(yacht => yacht._id === action.payload._id);
        if (index !== -1) {
          state.allYachts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(publishYacht.rejected, (state, action) => {
        state.publishLoading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Failed to publish yacht.";
      });
  },
});

export const { clearError, clearYachts } = yachtsSlice.actions;
export default yachtsSlice.reducer;