import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { getBackendUrl } from "@/lib/env";

// Get API URL from env utility (handles both NEXT_PUBLIC_BACKEND_URL and BACKEND_URL)
const API_URL = getBackendUrl();

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
  displayOrder?: number;
}

export interface YachtTranslation {
  slug: string;
  title: string;
  dayCharter?: string;
  overnightCharter?: string;
  aboutThisBoat?: string;
  specifications?: string;
  boatLayout?: string;
  tags?: string[];
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
  displayOrder?: number;
  createdAt: string;
  __v: number;
  translations?: {
    en?: YachtTranslation;
    fr?: YachtTranslation;
    de?: YachtTranslation;
    ru?: YachtTranslation;
    zh?: YachtTranslation;
    th?: YachtTranslation;
    ar?: YachtTranslation;
  };
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
  currentPage?: number;
  page?: number; // Backend returns 'page' not 'currentPage'
}

interface YachtsState {
  loading: boolean;
  yachts: Yachts | null;
  allYachts: YachtsApiResponse[];
  error: string | null;
  addLoading: boolean;
  updateLoading: boolean;
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
  updateLoading: false,
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
      const formData = new FormData();

      const translations = {
        en: {
          slug: credentials.slug?.trim(),
          title: credentials.title?.trim(),
          dayCharter: credentials.dayCharter?.trim() || "",
          overnightCharter: credentials.overnightCharter?.trim() || "",
          aboutThisBoat: credentials.aboutThisBoat?.trim() || "",
          specifications: credentials.specifications?.trim() || "",
          boatLayout: credentials.boatLayout?.trim() || "",
          tags: credentials.tags || [],
        },
      };

      formData.append("translations", JSON.stringify(translations));

      const entries: Record<string, unknown> = {
        boatType: credentials.boatType,
        price: credentials.price,
        capacity: credentials.capacity,
        length: credentials.length,
        lengthRange: credentials.lengthRange,
        cabins: credentials.cabins,
        bathrooms: credentials.bathrooms,
        passengerDayTrip: credentials.passengerDayTrip,
        passengerOvernight: credentials.passengerOvernight,
        guests: credentials.guests,
        guestsRange: credentials.guestsRange,
        dayTripPrice: credentials.dayTripPrice,
        overnightPrice: credentials.overnightPrice,
        daytripPriceEuro: credentials.daytripPriceEuro,
        videoLink: credentials.videoLink,
        badge: credentials.badge,
        slug: credentials.slug?.trim(),
        design: credentials.design,
        built: credentials.built,
        cruisingSpeed: credentials.cruisingSpeed,
        lengthOverall: credentials.lengthOverall,
        fuelCapacity: credentials.fuelCapacity,
        waterCapacity: credentials.waterCapacity,
        code: credentials.code,
        type: credentials.type,
        displayOrder: credentials.displayOrder ?? 9999,
      };

      Object.entries(entries).forEach(([key, value]) => {
        // Send empty strings to preserve them in the database
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Primary image (required)
      if (credentials.primaryImage) {
        formData.append("primaryImage", credentials.primaryImage);
      }

      // Gallery images
      if (Array.isArray(credentials.galleryImages)) {
        credentials.galleryImages.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }

      const response = await axios.post(`${API_URL}/yacht/add-yacht`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 1800000, // 30 minutes (increased for translation processing and large file uploads)
      });
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
        `${API_URL}/yacht/all-yachts?page=${page}&limit=${limit}`,
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
      const response = await axios.get(`${API_URL}/yacht?id=${yachtsId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const formData = new FormData();

      const translations = {
        en: {
          slug: payload.slug?.trim(),
          title: payload.title?.trim(),
          dayCharter: payload.dayCharter?.trim() || "",
          overnightCharter: payload.overnightCharter?.trim() || "",
          aboutThisBoat: payload.aboutThisBoat?.trim() || "",
          specifications: payload.specifications?.trim() || "",
          boatLayout: payload.boatLayout?.trim() || "",
          tags: payload.tags || [],
        },
      };

      formData.append("translations", JSON.stringify(translations));

      const entries: Record<string, unknown> = {
        boatType: payload.boatType,
        price: payload.price,
        capacity: payload.capacity,
        length: payload.length,
        lengthRange: payload.lengthRange,
        cabins: payload.cabins,
        bathrooms: payload.bathrooms,
        passengerDayTrip: payload.passengerDayTrip,
        passengerOvernight: payload.passengerOvernight,
        guests: payload.guests,
        guestsRange: payload.guestsRange,
        dayTripPrice: payload.dayTripPrice,
        overnightPrice: payload.overnightPrice,
        daytripPriceEuro: payload.daytripPriceEuro,
        videoLink: payload.videoLink,
        badge: payload.badge,
        slug: payload.slug?.trim(),
        design: payload.design,
        built: payload.built,
        cruisingSpeed: payload.cruisingSpeed,
        lengthOverall: payload.lengthOverall,
        fuelCapacity: payload.fuelCapacity,
        waterCapacity: payload.waterCapacity,
        code: payload.code,
        type: payload.type,
        displayOrder: payload.displayOrder ?? 9999,
      };

      Object.entries(entries).forEach(([key, value]) => {
        // Send empty strings to preserve them in the database
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (payload.primaryImage) {
        formData.append("primaryImage", payload.primaryImage);
      }

      if (Array.isArray(payload.galleryImages)) {
        payload.galleryImages.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }

      const response = await axios.put(
        `${API_URL}/yacht/edit-yacht?id=${yachtsId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 1800000, // 30 minutes (increased for translation processing and large file uploads)
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
        `${API_URL}/yacht/delete-yacht?id=${id}`,
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
        `${API_URL}/yacht/update-status?id=${yachtId}`,
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
        // Ensure yachts is always an array, handle both 'page' and 'currentPage' from backend
        const yachts = Array.isArray(action.payload.yachts) ? action.payload.yachts : [];
        console.log('[yachtsSlice] getYachts.fulfilled:', {
          yachtsCount: yachts.length,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          currentPage: action.payload.currentPage,
          payloadKeys: Object.keys(action.payload),
        });
        state.allYachts = yachts;
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.page || action.payload.currentPage || 1;
        state.error = null;
        console.log('[yachtsSlice] State after update:', {
          allYachtsLength: state.allYachts.length,
          total: state.total,
          totalPages: state.totalPages,
        });
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
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateYachts.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.yachts = action.payload;
        state.error = null;
      })
      .addCase(updateYachts.rejected, (state, action) => {
        state.updateLoading = false;
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