import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk สำหรับค้นหาหนังสือจาก API
export const searchBooks = createAsyncThunk(
  "search/searchBooks",
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) return []; 
      const response = await axios.get(
        `https://gutendex.com/books?search=${query.replace(" ", "%20")}`
      );
      return response.data.results || [];
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error fetching search results");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchResults: [],
    searchLoading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(searchBooks.pending, (state) => {
        state.searchLoading = true;
        state.searchResults = []; 
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload; 
      })
      .addCase(searchBooks.rejected, (state) => {
        state.searchLoading = false;
        state.searchResults = []; 
      });
  },
});

export default searchSlice.reducer;
