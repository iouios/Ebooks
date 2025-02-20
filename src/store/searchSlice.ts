// ตัวอย่างใน bookSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// สมมุติว่า API ของคุณใช้ searchQuery เป็น string
export const fetchBook = createAsyncThunk(
  "books/fetchBooks",
  async (searchQuery: string) => {
    const response = await axios.get(`https://gutendex.com/books/?search=${searchQuery}`);
    return response.data.results;  // ส่งข้อมูลที่ได้รับจาก API
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    next: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;  // เพิ่มหนังสือที่ได้จาก API
      })
      .addCase(fetchBook.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default booksSlice.reducer;
