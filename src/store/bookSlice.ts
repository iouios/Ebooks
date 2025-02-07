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
  formats: {
    'text/plain'?: string;
    'application/epub+zip'?: string;
    'image/jpeg'?: string;  
  };
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  next: string | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
  next: null,
};


export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (nextUrl: string | null = null) => {
    const url = nextUrl || 'https://gutendex.com/books'; 
    const response = await fetch(url);
    const data = await response.json();
    return {
      results: data.results, 
      next: data.next 
    };
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

        console.log(action.payload);
    
        if (Array.isArray(action.payload.results)) {
          state.books = [...state.books, ...action.payload.results]; 
        }


        state.next = action.payload.next || null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'เกิดข้อผิดพลาด';
      });
  },
});

export default bookSlice.reducer;
