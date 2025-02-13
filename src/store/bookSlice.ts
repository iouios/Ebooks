import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Author {
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  languages: string[];
  subjects: string[];
  download_count: number;
  summaries: string[];
  bookshelves: string[];
  formats: {
    'text/plain'?: string;
    'application/epub+zip'?: string;
    'image/jpeg'?: string;  
  };
}

interface BookState {
  books: Book[];         // To store the list of books
  book: Book | null;     // To store a single book's data, defaulting to null
  loading: boolean;
  error: string | null;
  next: string | null;
}

const initialState: BookState = {
  books: [],
  book: null, // Add a property to store a single book's data
  loading: false,
  error: null,
  next: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (nextUrl: string | null = null, { rejectWithValue }) => {
    try {
      const url = nextUrl || 'https://gutendex.com/books';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.results || !data.next) {
        throw new Error("Invalid API response structure");
      }

      return {
        results: data.results,
        next: data.next,
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue("error"); 
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log(`Fetching book with ID: ${id}`);
      const response = await fetch(`https://gutendex.com/books?ids=${id}`); // ✅ ใช้ query `ids` แทน `/books/:id`

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // ✅ ตรวจสอบ response จาก API

      if (!data.results || data.results.length === 0) {
        throw new Error("No book found with this ID");
      }

      return data.results[0]; // ✅ คืนค่า book object ตัวเดียว
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue("Error fetching book data");
    }
  }
);



const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload.results)) {
          state.books = [...state.books, ...action.payload.results];
        }
        state.next = action.payload.next || null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'เกิดข้อผิดพลาด';
      })
      
      // Handle fetchBookById
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;  // Store the single book data
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'เกิดข้อผิดพลาด';
      });
  },
});


export default bookSlice.reducer;
