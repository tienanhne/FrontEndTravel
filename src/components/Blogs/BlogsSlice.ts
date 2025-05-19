// BlogsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Thumbnail {
  id: number;
  url: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  createDate: string;
  tags: string[];
  categories: string[];
  userName: string;
  totalLike: number;
  status: string;
  thumbnail: Thumbnail;
}
export interface BlogsState {
  blogs: Blog[];
}

const initialState: BlogsState = {
  blogs: [],
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action: PayloadAction<Blog[]>) {
      state.blogs = action.payload;
    },
    addBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = [...state.blogs, ...action.payload];
    },
  },
});

export const { setBlogs, addBlogs } = blogsSlice.actions;

export default blogsSlice.reducer;
